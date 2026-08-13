import { z } from "zod";
import pkg from 'pg/lib/defaults';
const { password } = pkg;


// 1. Shared constants and base validators
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const emailSchema = z.string().email().max(50);

export const passwordSchema = z
  .string().min(12, "Password must be at least 12 characters")
  .max(50).regex(
    passwordRegex,
    "At least one uppercase letter, one lowercase, one number, one special character (@$!%*?&) required"
  );

// 2. Helper function to add confirm password matching to any schema
export function withConfirmPassword(baseSchema) {
  return baseSchema
    .extend({
      confirmPassword: z.string().min(1, "Confirm password is required"),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords do not match",
          path: ["confirmPassword"],
        });
      }
    });
}

// 3. Implementation of specific validations

export const loginValidation = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signupValidation = withConfirmPassword(
  z.object({
    username: z.string().trim().min(3).max(50),
    email: emailSchema,
    password: passwordSchema,
  })
);

export const changePasswordValidation = withConfirmPassword(
  z.object({
    password: passwordSchema,
  })
);
