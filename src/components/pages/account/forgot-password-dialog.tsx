"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { RefObject } from "react";
import { useForm } from "react-hook-form";

import {
  type ResetPasswordValues,
  resetPasswordSchema,
} from "@/components/pages/account/auth-schemas";
import { showDemoToast, simulateRequest } from "@/components/pages/account/demo-auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Prefilled with what the visitor already typed in the sign-in form. */
  defaultEmail?: string;
  /** The button that opened the dialog: focus returns to it on close. */
  returnFocusRef: RefObject<HTMLElement | null>;
}

/**
 * Rendered next to (not inside) the sign-in <form>: React events bubble
 * through portals, so a nested form would also submit the sign-in form.
 */
export function ForgotPasswordDialog({
  open,
  onOpenChange,
  defaultEmail = "",
  returnFocusRef,
}: ForgotPasswordDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        // Without a Dialog.Trigger, Radix has nothing to hand focus back to.
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          returnFocusRef.current?.focus();
        }}
      >
        {/* The content unmounts when closed, so the form starts fresh on every open. */}
        <ResetPasswordForm defaultEmail={defaultEmail} onSent={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function ResetPasswordForm({
  defaultEmail,
  onSent,
}: {
  defaultEmail: string;
  onSent: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: defaultEmail },
  });

  async function onSubmit({ email }: ResetPasswordValues) {
    await simulateRequest();
    onSent();
    showDemoToast("Check your inbox", `If an account exists for ${email}, a reset link is on its way.`);
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      <DialogHeader>
        <DialogTitle>Reset your password</DialogTitle>
        <DialogDescription>
          Enter the email you signed up with and we’ll send you a link to choose a new password.
        </DialogDescription>
      </DialogHeader>

      <Field data-invalid={errors.email ? true : undefined}>
        <FieldLabel htmlFor="reset-email">Email</FieldLabel>
        <Input
          id="reset-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="h-10"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "reset-email-error" : undefined}
          readOnly={isSubmitting}
          {...register("email")}
        />
        <FieldError id="reset-email-error" errors={[errors.email]} />
      </Field>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" size="lg">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting && <Spinner data-icon="inline-start" aria-hidden />}
          {isSubmitting ? "Sending…" : "Send reset link"}
        </Button>
      </DialogFooter>
    </form>
  );
}
