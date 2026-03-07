export type VoiceProvider = "gemini" | "webspeech";

export interface VoiceMessage {
  role: "user" | "assistant";
  text: string;
  provider: VoiceProvider;
  timestamp: Date;
}

export interface VoiceServiceConfig {
  lang: "en" | "hi";
  onMessage: (msg: VoiceMessage) => void;
  onStatusChange: (status: VoiceStatus) => void;
  onError: (err: Error, provider: VoiceProvider) => void;
  onFallback: (reason: string) => void;
}

export type VoiceStatus =
  | "idle"
  | "thinking"
  | "error"
  | "fallback";

const SYSTEM_PROMPTS = {
  en: `You are the CipherGuard voice assistant. You help parents manage 
child safety and parental controls. Be warm, concise, and helpful. 
Speak like a knowledgeable friend, not a robot. 
Keep responses under 3 sentences unless more detail is needed.
Common tasks: adding children, copying tokens, checking activity,
understanding what is blocked, dashboard help.`,

  hi: `आप CipherGuard के वॉयस असिस्टेंट हैं। आप माता-पिता को बच्चों की 
सुरक्षा और पैरेंटल कंट्रोल प्रबंधित करने में मदद करते हैं।
गर्मजोशी से, संक्षेप में और सहायक तरीके से बोलें।
जब तक अधिक विवरण की आवश्यकता न हो, 3 वाक्यों से कम में उत्तर दें।
सामान्य कार्य: बच्चे जोड़ना, टोकन कॉपी करना, गतिविधि जाँचना,
क्या ब्लॉक है यह समझना, डैशबोर्ड सहायता।`,
};

export class VoiceService {
  private config: VoiceServiceConfig;
  private currentProvider: VoiceProvider = "gemini";

  constructor(config: VoiceServiceConfig) {
    this.config = config;
  }

  async startSession(): Promise<void> {
    // For Gemini-only mode, there's no persistent server session to establish.
    // We just move to idle and wait for user input.
    this.currentProvider = "gemini";
    this.config.onStatusChange("idle");
  }

  async sendMessage(text: string): Promise<void> {
    await this.sendViaGemini(text);
  }

  async sendViaGemini(userMessage: string): Promise<void> {
    this.currentProvider = "gemini";
    this.config.onStatusChange("thinking");

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${SYSTEM_PROMPTS[this.config.lang]}\n\nUser: ${userMessage}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Gemini HTTP 429: rate limit exceeded");
        }
        throw new Error(`Gemini HTTP ${response.status}`);
      }

      const data = await response.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ??
        (this.config.lang === "hi"
          ? "माफ करें, मैं अभी उत्तर नहीं दे सकता।"
          : "Sorry, I couldn't get a response right now.");

      this.config.onMessage({
        role: "assistant",
        text: reply,
        provider: "gemini",
        timestamp: new Date(),
      });

      this.speakFallback(reply);
      this.config.onStatusChange("idle");
    } catch (err) {
      const error = err as Error;
      this.config.onError(error, "gemini");
      this.config.onStatusChange("error");

      const isRateLimit = error.message.includes("429") || error.message.toLowerCase().includes("rate limit");
      const errMsg =
        this.config.lang === "hi"
          ? isRateLimit
            ? "माफ करें, वॉयस सर्विस की सीमा पूरी हो गई है। कृपया बाद में पुनः प्रयास करें।"
            : "माफ करें, कोई त्रुटि हुई।"
          : isRateLimit
            ? "Voice limit reached for now. Please try again later."
            : "Sorry, something went wrong.";

      this.speakFallback(errMsg);
    }
  }

  private speakFallback(text: string): void {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = this.config.lang === "hi" ? "hi-IN" : "en-IN";
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  }

  async stopSession(): Promise<void> {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    this.config.onStatusChange("idle");
  }

  async setMicMuted(muted: boolean): Promise<void> {
    // No-op for Gemini-only mode; included to keep API surface compatible with previous implementation.
  }

  getProvider(): VoiceProvider {
    return this.currentProvider;
  }
}
