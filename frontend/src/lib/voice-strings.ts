export const voiceStrings = {
  en: {
    stepAuth: "Welcome to CipherGuard. Please sign in or create an account.",
    stepAuthLogin: "Welcome back. Sign in to manage your child's protection.",
    stepAuthSignup: "Create your account. Sign up to start protecting your child's browsing.",
    stepSafety: "Please confirm you are a parent or guardian setting this up for your child's safety.",
    stepIdentity: "Enter your Aadhaar number or upload a government ID to verify your identity.",
    stepVerifyComplete: "Verification Complete. You are verified. We are setting up your dashboard.",
    stepComplete: "Setup complete. You are now verified.",
    tokenCopied: "Token has been copied to clipboard. Paste it in the CipherGuard extension.",
    childAdded: "Child profile has been added successfully.",
  },
  hi: {
    stepAuth: "सिफरगार्ड में आपका स्वागत है। कृपया साइन इन करें या खाता बनाएं।",
    stepAuthLogin: "वापसी पर स्वागत है। अपने बच्चे की सुरक्षा प्रबंधित करने के लिए साइन इन करें।",
    stepAuthSignup: "अपना खाता बनाएं। अपने बच्चे की ब्राउज़िंग की सुरक्षा शुरू करने के लिए साइन अप करें।",
    stepSafety: "कृपया पुष्टि करें कि आप एक माता-पिता या अभिभावक हैं जो अपने बच्चे की सुरक्षा के लिए यह सेटअप कर रहे हैं।",
    stepIdentity: "अपना आधार नंबर दर्ज करें या अपनी पहचान सत्यापित करने के लिए सरकारी आईडी अपलोड करें।",
    stepVerifyComplete: "सत्यापन पूर्ण। आप सत्यापित हैं। हम आपका डैशबोर्ड सेट अप कर रहे हैं।",
    stepComplete: "सेटअप पूर्ण। आप अब सत्यापित हैं।",
    tokenCopied: "टोकन क्लिपबोर्ड पर कॉपी हो गया है। इसे सिफरगार्ड एक्सटेंशन में पेस्ट करें।",
    childAdded: "बच्चे की प्रोफ़ाइल सफलतापूर्वक जोड़ी गई है।",
  },
} as const;

export type VoiceKey = keyof (typeof voiceStrings)["en"];
