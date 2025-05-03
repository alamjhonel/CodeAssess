
import React, { useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormDescription } from "@/components/ui/form";
import { useAuth } from "@/contexts/auth";
import { UseFormReturn } from "react-hook-form";

interface RegisterTUPFieldsProps {
  form: UseFormReturn<any>;
  validateTupId?: (id: string) => boolean;
  validateTupEmail?: (email: string) => boolean;
}

const RegisterTUPFields: React.FC<RegisterTUPFieldsProps> = ({ 
  form, 
  validateTupId: propValidateTupId,
  validateTupEmail
}) => {
  const { validateTupId: contextValidateTupId } = useAuth();
  const role = form.watch("role");
  
  // Use the prop validator if provided, otherwise fall back to the context validator
  const validateTUPID = propValidateTupId || contextValidateTupId;
  
  // When role changes to teacher, clear the TUP ID field
  useEffect(() => {
    if (role === "teacher") {
      form.setValue("tupId", "");
      form.clearErrors("tupId"); // Clear any errors on the tupId field
    }
  }, [role, form]);

  const validateTUPIDField = (value: string) => {
    // Skip validation for teachers
    if (role === "teacher") return true;
    
    // Only validate for students
    return validateTUPID(value) || "Invalid TUP ID format. Must be TUPM-YY-XXXX";
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Role</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <label htmlFor="student" className="cursor-pointer">Student</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="teacher" id="teacher" />
                  <label htmlFor="teacher" className="cursor-pointer">Teacher</label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tupId"
        rules={{
          validate: validateTUPIDField,
          required: role === "student" ? "TUP ID is required for students" : false,
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>TUP ID {role === "teacher" && "(Not Required for Teachers)"}</FormLabel>
            <FormControl>
              <Input 
                placeholder={role === "teacher" ? "Not required for teachers" : "e.g. TUPM-22-1234"}
                {...field} 
                disabled={role === "teacher"} 
                className={role === "teacher" ? "bg-gray-100" : ""}
              />
            </FormControl>
            <FormDescription>
              {role === "student" 
                ? "Your Technological University of the Philippines ID number"
                : "Teachers don't need to provide a TUP ID"}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input 
                type="email" 
                placeholder="lastname.firstname@tup.edu.ph" 
                {...field}
              />
            </FormControl>
            <FormDescription>
              Only @tup.edu.ph email addresses are accepted for registration
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default RegisterTUPFields;
