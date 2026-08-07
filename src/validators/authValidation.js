import z from 'zod';
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;



export const signupValidation = z.object({
    username: z.string().trim().min(3).max(50),
    email: z.string().email().max(50),
    password: z.string().min(12).max(50).regex(
        passwordRegex, 
        "At least one uppercase letter, one lowercase, one number, one special character (@$!%*?&) exist in password"
    ),
    // Confirm password field 
    confirmPassword: z.string().min(1, "Confirm password is required")
})
// compare both have same
.superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Passwords do not match",
            path: ["confirmPassword"] // throw error 
        });
    }
});

export  const loginValidation=z.object({
    email: z.string().email().max(50),
    password: z.string().min(12).max(50).regex(
        passwordRegex, 
        "At least one uppercase letter, one lowercase, one number, one  special character (@$!%*?&) exist in password"
      )

})