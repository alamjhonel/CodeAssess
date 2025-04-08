
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, Loader2, BookCheck, Mail, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import DatePickerField from "./DatePickerField";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";

interface SignUpFormProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  tupId: string;
  setTupId: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  role: string;
  setRole: (value: string) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validateTupId: (id: string) => boolean;
  validateTupEmail: (email: string) => boolean;
  passwordStrength: {
    hasLowercase: boolean;
    hasUppercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
    hasLength: boolean;
  };
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  tupId,
  setTupId,
  email,
  setEmail,
  password,
  role,
  setRole,
  date,
  setDate,
  loading,
  handleSubmit,
  handlePasswordChange,
  validateTupId,
  validateTupEmail,
  passwordStrength,
}) => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordsMatch(value === password);
  };

  const isFormValid = () => {
    return (
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      validateTupId(tupId) &&
      validateTupEmail(email) &&
      date !== undefined &&
      password !== "" &&
      confirmPassword !== "" &&
      password === confirmPassword &&
      Object.values(passwordStrength).every(Boolean)
    );
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) {
      return;
    }
    handleSubmit(e);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first-name">First Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              id="first-name" 
              placeholder="First Name" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="rounded-lg pl-10 transition-all hover:border-primary focus-visible:ring-primary"
              required 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="last-name">Last Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              id="last-name" 
              placeholder="Last Name" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="rounded-lg pl-10 transition-all hover:border-primary focus-visible:ring-primary"
              required
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tup-id-signup">TUP ID</Label>
        <div className="relative">
          <BookCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            id="tup-id-signup" 
            placeholder="TUPM-XX-XXXX" 
            value={tupId}
            onChange={(e) => setTupId(e.target.value)}
            className={cn(
              "rounded-lg pl-10 transition-all hover:border-primary focus-visible:ring-primary",
              tupId && !validateTupId(tupId) ? "border-red-500" : "",
              tupId && validateTupId(tupId) ? "border-green-500" : ""
            )}
            required 
          />
        </div>
        {tupId && !validateTupId(tupId) && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            ID must be in format TUPM-YY-XXXX (e.g., TUPM-23-1234)
          </p>
        )}
        {tupId && validateTupId(tupId) && (
          <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Valid TUP ID format
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email-signup">TUP Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            id="email-signup" 
            placeholder="lastname.firstname@tup.edu.ph" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cn(
              "rounded-lg pl-10 transition-all hover:border-primary focus-visible:ring-primary",
              email && !validateTupEmail(email) ? "border-red-500" : "",
              email && validateTupEmail(email) ? "border-green-500" : ""
            )}
            required 
          />
        </div>
        {email && !validateTupEmail(email) && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Email must be in format lastname.firstname@tup.edu.ph
          </p>
        )}
        {email && validateTupEmail(email) && (
          <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Valid TUP email format
          </p>
        )}
      </div>
      
      <DatePickerField
        id="birthdate-signup"
        label="Birthdate"
        date={date}
        setDate={setDate}
      />
      
      <div className="space-y-2">
        <Label htmlFor="role" className="block mb-2">Role</Label>
        <RadioGroup
          defaultValue="student"
          value={role}
          onValueChange={setRole}
          className="flex bg-muted/30 p-1 rounded-lg gap-2 transition-all"
        >
          <div className={cn(
            "flex items-center flex-1 p-2 rounded-md cursor-pointer transition-all",
            role === "student" ? "bg-background shadow-sm" : "hover:bg-background/50"
          )}>
            <RadioGroupItem value="student" id="student" className="sr-only" />
            <Label htmlFor="student" className="cursor-pointer flex items-center gap-2 w-full">
              <User className="h-4 w-4" />
              Student
            </Label>
          </div>
          <div className={cn(
            "flex items-center flex-1 p-2 rounded-md cursor-pointer transition-all",
            role === "teacher" ? "bg-background shadow-sm" : "hover:bg-background/50"
          )}>
            <RadioGroupItem value="teacher" id="teacher" className="sr-only" />
            <Label htmlFor="teacher" className="cursor-pointer flex items-center gap-2 w-full">
              <BookCheck className="h-4 w-4" />
              Teacher
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password-signup">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            id="password-signup" 
            type="password" 
            value={password}
            onChange={handlePasswordChange}
            className={cn(
              "rounded-lg pl-10 transition-all hover:border-primary focus-visible:ring-primary",
              password && (!passwordStrength.hasLowercase || !passwordStrength.hasUppercase || 
                        !passwordStrength.hasNumber || !passwordStrength.hasSpecial || 
                        !passwordStrength.hasLength) ? "border-red-500" : "",
              password && (passwordStrength.hasLowercase && passwordStrength.hasUppercase && 
                        passwordStrength.hasNumber && passwordStrength.hasSpecial && 
                        passwordStrength.hasLength) ? "border-green-500" : ""
            )}
            required 
          />
        </div>
        <PasswordStrengthIndicator passwordStrength={passwordStrength} />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            id="confirm-password" 
            type="password" 
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className={cn(
              "rounded-lg pl-10 transition-all hover:border-primary focus-visible:ring-primary",
              confirmPassword && !passwordsMatch ? "border-red-500" : "",
              confirmPassword && passwordsMatch && confirmPassword !== "" ? "border-green-500" : ""
            )}
            required 
          />
        </div>
        {confirmPassword && !passwordsMatch && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Passwords do not match
          </p>
        )}
        {confirmPassword && passwordsMatch && confirmPassword !== "" && (
          <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Passwords match
          </p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
        disabled={loading || !isFormValid()}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
};

export default SignUpForm;
