"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { type SignInValues, signInSchema } from "@/components/pages/account/auth-schemas";
import { showDemoToast, simulateRequest } from "@/components/pages/account/demo-auth";
import { ForgotPasswordDialog } from "@/components/pages/account/forgot-password-dialog";
import { PasswordInput } from "@/components/pages/account/password-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

export function SignInForm() {
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const forgotButtonRef = useRef<HTMLButtonElement>(null);
  const {
    register,
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  async function onSubmit({ email, remember }: SignInValues) {
    await simulateRequest();
    showDemoToast(
      "Signed in",
      `Welcome back, ${email}.${remember ? " You’d stay signed in on this device." : ""}`,
    );
    reset({ email, password: "", remember });
  }

  return (
    <>
      <form noValidate onSubmit={handleSubmit(onSubmit)} aria-label="Sign in">
        <FieldGroup>
          <Field data-invalid={errors.email ? true : undefined}>
            <FieldLabel htmlFor="sign-in-email">Email</FieldLabel>
            <Input
              id="sign-in-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="h-10"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "sign-in-email-error" : undefined}
              readOnly={isSubmitting}
              {...register("email")}
            />
            <FieldError id="sign-in-email-error" errors={[errors.email]} />
          </Field>

          <Field data-invalid={errors.password ? true : undefined}>
            <div className="flex items-center justify-between gap-4">
              <FieldLabel htmlFor="sign-in-password">Password</FieldLabel>
              <Button
                ref={forgotButtonRef}
                type="button"
                variant="link"
                size="xs"
                className="h-auto px-0 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setResetEmail(getValues("email"));
                  setForgotOpen(true);
                }}
              >
                Forgot password?
              </Button>
            </div>
            <PasswordInput
              id="sign-in-password"
              autoComplete="current-password"
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={errors.password ? "sign-in-password-error" : undefined}
              readOnly={isSubmitting}
              {...register("password")}
            />
            <FieldError id="sign-in-password-error" errors={[errors.password]} />
          </Field>

          <Controller
            control={control}
            name="remember"
            render={({ field }) => (
              <Field orientation="horizontal">
                <Checkbox
                  id="sign-in-remember"
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                  onBlur={field.onBlur}
                  ref={field.ref}
                />
                <FieldLabel htmlFor="sign-in-remember" className="font-normal">
                  Keep me signed in
                </FieldLabel>
              </Field>
            )}
          />

          <Button type="submit" size="lg" className="h-11 w-full rounded-full" disabled={isSubmitting}>
            {isSubmitting && <Spinner data-icon="inline-start" aria-hidden />}
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        </FieldGroup>
      </form>

      <ForgotPasswordDialog
        open={forgotOpen}
        onOpenChange={setForgotOpen}
        defaultEmail={resetEmail}
        returnFocusRef={forgotButtonRef}
      />
    </>
  );
}
