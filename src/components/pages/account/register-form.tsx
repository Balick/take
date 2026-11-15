"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";

import { type RegisterValues, registerSchema } from "@/components/pages/account/auth-schemas";
import { showDemoToast, simulateRequest } from "@/components/pages/account/demo-auth";
import { PasswordInput } from "@/components/pages/account/password-input";
import { PasswordStrength } from "@/components/pages/account/password-strength";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

const defaultValues: RegisterValues = { name: "", email: "", password: "", terms: false };

export function RegisterForm() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues,
  });
  const password = useWatch({ control, name: "password" });

  async function onSubmit({ name }: RegisterValues) {
    await simulateRequest();
    const firstName = name.split(" ")[0];
    showDemoToast("Account created", `Welcome to the club, ${firstName}.`);
    reset(defaultValues);
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} aria-label="Create account">
      <FieldGroup>
        <Field data-invalid={errors.name ? true : undefined}>
          <FieldLabel htmlFor="register-name">Full name</FieldLabel>
          <Input
            id="register-name"
            autoComplete="name"
            placeholder="Alex Morgan"
            className="h-10"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "register-name-error" : undefined}
            readOnly={isSubmitting}
            {...register("name")}
          />
          <FieldError id="register-name-error" errors={[errors.name]} />
        </Field>

        <Field data-invalid={errors.email ? true : undefined}>
          <FieldLabel htmlFor="register-email">Email</FieldLabel>
          <Input
            id="register-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="h-10"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "register-email-error" : undefined}
            readOnly={isSubmitting}
            {...register("email")}
          />
          <FieldError id="register-email-error" errors={[errors.email]} />
        </Field>

        <Field data-invalid={errors.password ? true : undefined}>
          <FieldLabel htmlFor="register-password">Password</FieldLabel>
          <PasswordInput
            id="register-password"
            autoComplete="new-password"
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={
              errors.password
                ? "register-password-error register-password-strength"
                : "register-password-strength"
            }
            readOnly={isSubmitting}
            {...register("password")}
          />
          <FieldError id="register-password-error" errors={[errors.password]} />
          <PasswordStrength id="register-password-strength" password={password} />
        </Field>

        <Controller
          control={control}
          name="terms"
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid ? true : undefined}>
              <Checkbox
                id="register-terms"
                name={field.name}
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                onBlur={field.onBlur}
                ref={field.ref}
                aria-invalid={fieldState.invalid ? true : undefined}
                aria-describedby={
                  fieldState.error ? "register-terms-error register-terms-hint" : "register-terms-hint"
                }
              />
              <FieldContent>
                <FieldLabel htmlFor="register-terms" className="font-normal">
                  I accept the terms of sale and the privacy policy
                </FieldLabel>
                <FieldDescription id="register-terms-hint">
                  We only email you about your orders unless you opt in to news.
                </FieldDescription>
                <FieldError id="register-terms-error" errors={[fieldState.error]} />
              </FieldContent>
            </Field>
          )}
        />

        <Button type="submit" size="lg" className="h-11 w-full rounded-full" disabled={isSubmitting}>
          {isSubmitting && <Spinner data-icon="inline-start" aria-hidden />}
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </FieldGroup>
    </form>
  );
}
