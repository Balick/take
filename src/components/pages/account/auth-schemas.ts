import { z } from "zod";

const email = z
  .string()
  .trim()
  .min(1, "Enter your email address.")
  .pipe(z.email("Enter a valid email address, like name@example.com."));

export const PASSWORD_MIN_LENGTH = 8;

export const signInSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password."),
  remember: z.boolean(),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(80, "Use 80 characters or fewer."),
  email,
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Use at least ${PASSWORD_MIN_LENGTH} characters.`)
    .max(128, "Use 128 characters or fewer.")
    .regex(/[a-z]/i, "Include at least one letter.")
    .regex(/\d/, "Include at least one number."),
  terms: z.boolean().refine((accepted) => accepted, "Accept the terms to create an account."),
});

export const resetPasswordSchema = z.object({ email });

export type SignInValues = z.infer<typeof signInSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export type PasswordStrength = {
  /** 0 (empty) to 4 (strong). */
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  hint: string;
};

/**
 * Lightweight strength estimate for the sign-up hint. It is guidance only:
 * enforce your real password policy on the server (or in your auth provider).
 */
export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      score: 0,
      label: "",
      hint: `Use ${PASSWORD_MIN_LENGTH} or more characters with letters and numbers.`,
    };
  }

  let points = 0;
  if (password.length >= PASSWORD_MIN_LENGTH) points++;
  if (password.length >= 12) points++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) points++;
  if (/\d/.test(password)) points++;
  if (/[^A-Za-z0-9]/.test(password)) points++;

  if (password.length < PASSWORD_MIN_LENGTH || points <= 1) {
    return {
      score: 1,
      label: "Weak",
      hint: `Use at least ${PASSWORD_MIN_LENGTH} characters, mixing letters and numbers.`,
    };
  }
  if (points === 2) {
    return { score: 2, label: "Fair", hint: "Add uppercase letters, numbers or symbols." };
  }
  if (points === 3) {
    return { score: 3, label: "Good", hint: "A longer password makes it even harder to guess." };
  }
  return { score: 4, label: "Strong", hint: "Great password." };
}
