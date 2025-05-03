// This file is kept temporarily for backward compatibility
// It re-exports everything from the new structure to maintain compatibility
import { AuthProvider, useAuth } from "./auth";
import { z } from "zod";

// Student schema: TUP ID required and validated
const studentSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  role: z.literal("student"),
  tupId: z.string()
    .min(1, { message: "TUP ID is required for students" })
    .regex(/^TUPM-\d{2}-\d{4}$/, { message: "Invalid TUP ID format. Must be TUPM-YY-XXXX" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
}).refine(
  (data) => data.password === data.confirmPassword,
  { message: "Passwords do not match", path: ["confirmPassword"] }
);

// Teacher schema: TUP ID optional, no validation
const teacherSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  role: z.literal("teacher"),
  tupId: z.string().optional(),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
}).refine(
  (data) => data.password === data.confirmPassword,
  { message: "Passwords do not match", path: ["confirmPassword"] }
);

export { AuthProvider, useAuth };

console.log("role:", data.role, "tupId:", data.tupId);

if (role === "student") {
  if (!tupId || tupId.trim() === "") {
    throw new Error("TUP ID is required for students");
  }
  if (!/^TUPM-\d{2}-\d{4}$/.test(tupId)) {
    throw new Error("Invalid TUP ID format. Must be TUPM-YY-XXXX");
  }
}
// For teachers, do nothing
