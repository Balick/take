"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address.")
    .pipe(z.email("Enter a valid email address, like name@example.com.")),
});

type NewsletterValues = z.infer<typeof newsletterSchema>;

/**
 * Newsletter signup. Demo only: replace the timeout with a call to your
 * email provider (Resend, Mailchimp, Klaviyo...) from a Server Action.
 */
export function NewsletterForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit({ email }: NewsletterValues) {
    await new Promise((resolve) => setTimeout(resolve, 700));
    toast.success("You're on the list", {
      description: `We'll send new drops and early sale access to ${email}.`,
    });
    reset();
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
      <Field data-invalid={errors.email ? true : undefined}>
        <FieldLabel htmlFor="newsletter-email" className="sr-only">
          Email address
        </FieldLabel>
        <div className="flex gap-2">
          <Input
            id="newsletter-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="h-10 flex-1 rounded-full bg-background px-4"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "newsletter-email-error" : "newsletter-email-hint"}
            readOnly={isSubmitting}
            {...register("email")}
          />
          <Button type="submit" className="h-10 rounded-full px-4" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner data-icon="inline-start" role="presentation" aria-hidden />
                Subscribing…
              </>
            ) : (
              <>
                Subscribe
                <ArrowRightIcon data-icon="inline-end" aria-hidden />
              </>
            )}
          </Button>
        </div>
        <FieldError id="newsletter-email-error" errors={[errors.email]} />
        {!errors.email && (
          <FieldDescription id="newsletter-email-hint">
            One email a month. No spam, unsubscribe anytime.
          </FieldDescription>
        )}
      </Field>
    </form>
  );
}
