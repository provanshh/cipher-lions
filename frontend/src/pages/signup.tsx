import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, Lock, UserPlus, Cpu, ArrowRight } from "lucide-react";
import { CipherQueryModal } from "@/components/CipherQueryModal";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [querySent, setQuerySent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setIsSignedUp(true);
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Something went wrong");
    }
  };

  if (isSignedUp) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0A0A14] relative overflow-hidden">
        <div className="scanline"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>

        <div className="text-center space-y-8 z-10 animate-in fade-in zoom-in duration-500">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white neon-text">Account Created!</h1>
            <p className="text-gray-400 max-w-md mx-auto">
              {querySent
                ? "Security registration complete. You're ready to protect your family."
                : "One last step: Please activate your CIPHER network registration to enable all monitoring features."}
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            {!querySent ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="group relative px-8 py-4 bg-transparent border-2 border-cipher-purple rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] active:scale-95"
              >
                <div className="absolute inset-0 bg-cipher-purple transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <span className="relative flex items-center gap-3 text-2xl font-bold text-cipher-purple group-hover:text-white">
                  <Cpu className="h-8 w-8" />
                  ACTIVATE CIPHER
                </span>
              </button>
            ) : (
              <Button
                onClick={() => window.location.href = "/dashboard"}
                className="px-8 py-6 text-xl rounded-full bg-cipher-purple hover:bg-cipher-purple/90 shadow-[0_0_20px_rgba(139,92,246,0.3)] animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                Access Dashboard <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            )}

          </div>
        </div>

        <CipherQueryModal
          isOpen={isModalOpen}
          isMandatory={true}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => setQuerySent(true)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full py-16 flex items-center justify-center bg-gradient-to-br from-purple-100 via-white to-blue-100">
      <Card className="w-full max-w-md mx-4 shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">Create an account</CardTitle>
          <CardDescription>
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your Name"
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="pl-9"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              Sign up <UserPlus className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <a href="/login" className="text-primary hover:underline">
                Sign in
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignUp;