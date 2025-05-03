
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth";
import { useForm } from "react-hook-form";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import FadeIn from "@/components/animations/FadeIn";
import PageTransition from "@/components/animations/PageTransition";
import { Loader2, AlertCircle, Info, User, Mail, IdCard } from "lucide-react";
import DatePickerField from "@/components/auth/DatePickerField";
import CodeGradeLogo from "@/components/brand/CodeGradeLogo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const loginSchema = z.object({
  identifier: z.string().min(1, { message: "Please enter your TUP ID or email" })
    .refine(val => {
      // If it's an email, it must end with @tup.edu.ph
      if (val.includes('@')) {
        return val.endsWith('@tup.edu.ph');
      }
      return true; // Allow TUP IDs to pass this validation
    }, { message: "Only TUP email addresses (@tup.edu.ph) are allowed" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { signIn, signInWithGoogle, user, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const [birthdate, setBirthdate] = useState<Date | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loginMethod, setLoginMethod] = useState<'email' | 'tup_id'>('email');

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  // Handle email confirmation if token is in URL
  useEffect(() => {
    const token = searchParams.get('token');
    const type = searchParams.get('type');

    const handleEmailConfirmation = async () => {
      if (token && type === 'email_confirmation') {
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'email',
          });

          if (error) {
            toast.error("Error confirming email: " + error.message);
          } else {
            toast.success("Email confirmed successfully. You can now sign in.");
          }
        } catch (error) {
          console.error("Error confirming email:", error);
          toast.error("An error occurred while confirming your email.");
        }
      }
    };

    handleEmailConfirmation();
  }, [searchParams]);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      console.log(`Attempting login with ${data.identifier.includes('@') ? 'email' : 'TUP ID'}: ${data.identifier}`);
      
      // Get current date as fallback if birthdate is not provided
      const birthdateToUse = birthdate;
      
      await signIn(data.identifier, data.password, birthdateToUse);
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Check if the error is about unregistered user
      if (error.message && error.message.includes("Account not found")) {
        setErrorMessage("This account doesn't exist. Please sign up first.");
      } else if (error.message && error.message.includes("Invalid login credentials")) {
        setErrorMessage("Invalid email or password. Please check your credentials and try again.");
      } else if (error.message && error.message.includes("Only TUP email")) {
        setErrorMessage("Only TUP email addresses (@tup.edu.ph) are allowed");
      } else if (error.message && error.message.includes("TUP ID not found")) {
        setErrorMessage("TUP ID not found. Please check your TUP ID or use your email instead.");
      } else {
        toast.error(error.message || "Error signing in");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <header className="py-6 px-8 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <CodeGradeLogo size="md" />
          </Link>
          <Link to="/register">
            <Button variant="outline">Register</Button>
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <FadeIn className="w-full max-w-md">
            <Card className="shadow-xl border-border/40">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {errorMessage && (
                  <Alert className="bg-destructive/10 border-destructive/20 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {errorMessage}
                      <Link 
                        to="/register" 
                        className="ml-2 font-medium underline hover:no-underline"
                      >
                        Sign up here
                      </Link>
                    </AlertDescription>
                  </Alert>
                )}

                <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as 'email' | 'tup_id')} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email
                    </TabsTrigger>
                    <TabsTrigger value="tup_id" className="flex items-center gap-2">
                      <IdCard className="h-4 w-4" /> TUP ID
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="email">
                    <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Sign in with your TUP email address (@tup.edu.ph)
                      </AlertDescription>
                    </Alert>
                  </TabsContent>
                  
                  <TabsContent value="tup_id">
                    <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Sign in with your TUP ID (format: TUPM-XX-XXXX)
                      </AlertDescription>
                    </Alert>
                  </TabsContent>
                </Tabs>

                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2"
                  onClick={() => signInWithGoogle()}
                >
                  <img src="/google.svg" alt="Google Logo" className="h-5 w-5" />
                  Sign in with Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/30" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="identifier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{loginMethod === 'email' ? 'Email' : 'TUP ID'}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              {loginMethod === 'email' ? (
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                              ) : (
                                <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                              )}
                              <Input 
                                placeholder={loginMethod === 'email' ? "your.name@tup.edu.ph" : "TUPM-XX-XXXX"} 
                                {...field} 
                                className="pl-10"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="birthdate">Birthdate (Optional)</Label>
                      </div>
                      <DatePickerField 
                        id="birthdate"
                        label=""
                        date={birthdate}
                        setDate={setBirthdate}
                        required={false}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign in"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>

              <CardFooter className="flex flex-col space-y-2">
                <div className="text-sm text-center mt-2">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-primary hover:underline">
                    Register
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </FadeIn>
        </main>
      </div>
    </PageTransition>
  );
};

export default Login;
