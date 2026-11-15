import { toast } from "sonner";

/**
 * The template ships without a backend, so the account forms only simulate a
 * request. Replace `simulateRequest` calls with your auth provider:
 *
 * - Auth.js: `signIn("credentials", { email, password })` from `next-auth/react`
 * - Clerk: `<SignIn />` / `<SignUp />` or the `useSignIn()` hook
 * - Better Auth: `authClient.signIn.email({ email, password })`
 * - Supabase: `supabase.auth.signInWithPassword({ email, password })`
 */
export function simulateRequest(duration = 800) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

const providers = "Auth.js, Clerk, Better Auth or Supabase";

export function showDemoToast(title: string, detail?: string) {
  toast.success(title, {
    description: `${detail ? `${detail} ` : ""}This is a demo: nothing was sent. Plug in ${providers} in src/components/pages/account to make it real.`,
    duration: 8000,
  });
}
