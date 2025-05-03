
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "./RegisterForm";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";

interface RegisterCredentialsFieldsProps {
  form: UseFormReturn<RegisterFormValues>;
  passwordStrength: {
    hasLowercase: boolean;
    hasUppercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
    hasLength: boolean;
  };
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RegisterCredentialsFields: React.FC<RegisterCredentialsFieldsProps> = ({ 
  form, 
  passwordStrength, 
  handlePasswordChange 
}) => {
  return (
    <>
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input 
                type="password" 
                placeholder="••••••" 
                onChange={handlePasswordChange} 
                value={field.value}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            </FormControl>
            <PasswordStrengthIndicator passwordStrength={passwordStrength} />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm Password</FormLabel>
            <FormControl>
              <Input 
                type="password" 
                placeholder="••••••" 
                {...field} 
                className={cn(
                  field.value && field.value !== form.watch("password") ? "border-red-500" : "",
                  field.value && field.value === form.watch("password") && field.value !== "" ? "border-green-500" : ""
                )}
              />
            </FormControl>
            {field.value && field.value !== form.watch("password") && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Passwords do not match
              </p>
            )}
            {field.value && field.value === form.watch("password") && field.value !== "" && (
              <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Passwords match
              </p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default RegisterCredentialsFields;
