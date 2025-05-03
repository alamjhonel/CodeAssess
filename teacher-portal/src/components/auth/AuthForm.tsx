
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import GlassCard from "../ui/custom/GlassCard";
import FadeIn from "../animations/FadeIn";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import SocialAuth from "./SocialAuth";
import { useNavigate } from "react-router-dom";
import CodeGradeLogo from "@/components/brand/CodeGradeLogo";
import { useAuth } from "@/contexts/auth";

interface AuthFormProps {
  onAuthSuccess?: (role: 'student' | 'teacher') => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const { signIn, signUp } = useAuth();
  const { toast: systemToast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState("sign-in");
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  const [tupId, setTupId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [passwordStrength, setPasswordStrength] = useState({
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecial: false,
    hasLength: false,
  });

  const validateTupId = (id: string) => {
    const pattern = /^TUPM-\d{2}-\d{4}$/;
    return pattern.test(id);
  };

  const validateTupEmail = (email: string) => {
    const pattern = /^[a-zA-Z]+\.[a-zA-Z]+@tup\.edu\.ph$/;
    return pattern.test(email);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPassword(password);
    
    setPasswordStrength({
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
      hasLength: password.length >= 8,
    });
  };
  
  // Create a handler for role changes that safely casts the value
  const handleRoleChange = (value: string) => {
    if (value === 'student' || value === 'teacher') {
      setRole(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (tab === "sign-in") {
        // For sign-in, birthdate is optional
        await signIn(tupId, password, date);
        
        // Call the success callback with the role from the user's profile
        // This will be handled by the auth context after successful login
      } else {
        // For sign-up
        if (!firstName || !lastName || !tupId || !email || !password) {
          systemToast({
            title: "Missing Information",
            description: "Please fill all required fields.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        await signUp(email, password, firstName, lastName, role, tupId, date);
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      // Error toast will be shown by the auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <GlassCard intensity="high" className="p-8">
        <FadeIn>
          <div className="flex justify-center mb-6">
            <CodeGradeLogo size="md" showText={true} />
          </div>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 transition-all hover:scale-[1.02]">
              <TabsTrigger value="sign-in" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors">Sign In</TabsTrigger>
              <TabsTrigger value="sign-up" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sign-in" className="space-y-6">
              <SignInForm 
                tupId={tupId}
                setTupId={setTupId}
                password={password}
                setPassword={setPassword}
                date={date}
                setDate={setDate}
                loading={loading}
                handleSubmit={handleSubmit}
                handlePasswordChange={handlePasswordChange}
              />
              
              <SocialAuth onSuccess={() => {
                if (onAuthSuccess) onAuthSuccess('student');
                navigate('/dashboard');
              }} />
              
              <div className="text-center mt-4">
                <Button variant="link" onClick={() => navigate('/')}>
                  Return to Home
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="sign-up" className="space-y-6">
              <SignUpForm 
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                tupId={tupId}
                setTupId={setTupId}
                email={email}
                setEmail={setEmail}
                password={password}
                role={role}
                setRole={handleRoleChange}
                date={date}
                setDate={setDate}
                loading={loading}
                handleSubmit={handleSubmit}
                handlePasswordChange={handlePasswordChange}
                validateTupId={validateTupId}
                validateTupEmail={validateTupEmail}
                passwordStrength={passwordStrength}
              />
              
              <SocialAuth onSuccess={() => {
                if (onAuthSuccess) onAuthSuccess('student');
                navigate('/dashboard');
              }} />
              
              <div className="text-center mt-4">
                <Button variant="link" onClick={() => navigate('/')}>
                  Return to Home
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </FadeIn>
      </GlassCard>
    </div>
  );
};

export default AuthForm;
