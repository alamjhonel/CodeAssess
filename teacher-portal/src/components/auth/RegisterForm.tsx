
import React, { useState } from "react";
import { useAuth } from "@/contexts/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import DatePickerField from "@/components/auth/DatePickerField";
import RegisterPersonalInfoFields from "./RegisterPersonalInfoFields";
import RegisterCredentialsFields from "./RegisterCredentialsFields";
import RegisterTUPFields from "./RegisterTUPFields";

// Define a schema that conditionally validates tupId based on role
const registerSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  role: z.enum(["teacher", "student"], { 
    required_error: "You must select a role" 
  }),
  tupId: z.string().optional(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .refine((password) => /[a-z]/.test(password), {
      message: "Password must contain at least one lowercase letter"
    })
    .refine((password) => /[A-Z]/.test(password), {
      message: "Password must contain at least one uppercase letter"
    })
    .refine((password) => /[0-9]/.test(password), {
      message: "Password must contain at least one number"
    })
    .refine((password) => /[^A-Za-z0-9]/.test(password), {
      message: "Password must contain at least one special character"
    }),
  confirmPassword: z.string(),
}).refine(
  (data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
).refine(
  (data) => {
    // Only require TUP ID for students
    if (data.role === 'student') {
      return !!data.tupId && data.tupId.length > 0;
    }
    // For teachers, TUP ID is optional
    return true;
  },
  {
    message: "TUP ID is required for students",
    path: ["tupId"],
  }
);

export type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const { signUp, validateTupId, validateTupEmail } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [birthdate, setBirthdate] = useState<Date>();
  const [passwordStrength, setPasswordStrength] = useState({
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecial: false,
    hasLength: false,
  });

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      tupId: "",
      password: "",
      confirmPassword: "",
      role: "student",
    },
    mode: "onChange", // Validate on change for better UX
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    form.setValue("password", password);
    
    setPasswordStrength({
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
      hasLength: password.length >= 8,
    });
  };

  const onSubmit = async (data: RegisterFormValues) => {
    if (!birthdate) {
      form.setError("root", { message: "Birthdate is required" });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Validate TUP ID format only for students
      if (data.role === "student" && (!validateTupId(data.tupId || ''))) {
        form.setError("tupId", { message: "Invalid TUP ID format. Must be TUPM-YY-XXXX" });
        setIsSubmitting(false);
        return;
      }
      
      // Validate TUP email format
      if (!validateTupEmail(data.email)) {
        form.setError("email", { message: "Invalid TUP email format. Must be lastname.firstname@tup.edu.ph" });
        setIsSubmitting(false);
        return;
      }
      
      await signUp(
        data.email, 
        data.password, 
        data.firstName, 
        data.lastName, 
        data.role,
        data.tupId || '', // Send empty string if undefined
        birthdate
      );
      form.reset();
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-xl border-border/40">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <RegisterPersonalInfoFields form={form} />
            
            <RegisterTUPFields 
              form={form} 
              validateTupId={validateTupId}
              validateTupEmail={validateTupEmail}
            />
            
            <div className="space-y-1">
              <FormLabel htmlFor="birthdate">Birthdate <span className="text-red-500">*</span></FormLabel>
              <DatePickerField 
                id="birthdate"
                label=""
                date={birthdate}
                setDate={setBirthdate}
              />
              {form.formState.errors.root && (
                <p className="text-sm font-medium text-destructive mt-1">
                  {form.formState.errors.root.message}
                </p>
              )}
            </div>

            <RegisterCredentialsFields 
              form={form}
              passwordStrength={passwordStrength}
              handlePasswordChange={handlePasswordChange}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting || !birthdate}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>

            <div className="text-sm text-center mt-2">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
