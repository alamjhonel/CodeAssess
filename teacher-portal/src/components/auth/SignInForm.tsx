
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, Loader2 } from "lucide-react";
import DatePickerField from "./DatePickerField";

interface SignInFormProps {
  tupId: string;
  setTupId: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SignInForm: React.FC<SignInFormProps> = ({
  tupId,
  setTupId,
  password,
  setPassword,
  date,
  setDate,
  loading,
  handleSubmit,
  handlePasswordChange,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tup-id">TUP ID or Email</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            id="tup-id" 
            placeholder="TUPM-XX-XXXX or your email" 
            value={tupId} 
            onChange={(e) => setTupId(e.target.value)}
            className="rounded-lg pl-10 transition-all hover:border-primary focus-visible:ring-primary"
            required 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            id="password" 
            type="password" 
            value={password}
            onChange={handlePasswordChange}
            className="rounded-lg pl-10 transition-all hover:border-primary focus-visible:ring-primary"
            required 
          />
        </div>
      </div>
      
      <DatePickerField
        id="birthdate"
        label="Birthdate (Optional)"
        date={date}
        setDate={setDate}
        required={false}
      />
      
      <Button 
        type="submit" 
        className="w-full rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
        disabled={loading || !tupId || !password}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing In...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
};

export default SignInForm;
