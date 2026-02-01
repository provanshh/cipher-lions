import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UserPlus, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AddChild = () => {
  const [email, setEmail] = useState("");
  const [name , setName] = useState("");

  // const [childName, setChildName] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const parentToken = localStorage.getItem("token");
      console.log("Parent Token:", parentToken);
      console.log("Child Email:", email);
  
      const response = await fetch(`${import.meta.env.VITE_BACKENDURL}/api/child/add-child`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parentToken}`,
        },
        body: JSON.stringify({ email,name }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setToken(data.token);
        toast({ title: "Child added!", description: "Token generated successfully." });
      } else {
        toast({ title: "Error", description: data.message || "Failed to add child." });
      }
    } catch (err) {
      toast({ title: "Error", description: "Network error or server down." });
    }
  };
  

  const copyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      toast({
        title: "Token copied!",
        description: "The token has been copied to your clipboard.",
      });
    }
  };

  return (
    <div className="min-h-screen w-full py-16 flex items-center justify-center bg-gradient-to-br from-purple-100 via-white to-blue-100">
      <Card className="w-full max-w-md mx-4 shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">Add Child</CardTitle>
          <CardDescription>
            Enter your child's details to generate their token
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Child's Name </Label>
              <Input
                id="name"
                placeholder="Enter child's name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
               <Label htmlFor="email">Child's email </Label>
              <Input
                id="email"
                placeholder="Enter child's email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {token && (
              <div className="space-y-2">
                <Label>Child's Token</Label>
                <div className="flex gap-2">
                  <Input value={token} readOnly className="font-mono" />
                  <Button type="button" variant="outline" onClick={copyToken}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={!email.trim()}>
              Generate Token <UserPlus className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddChild;
