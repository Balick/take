"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheckIcon, SendIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ORDER_ID_PATTERN } from "@/components/checkout/order-id";
import { contactDetails, contactTopics } from "@/components/pages/contact/contact-details";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

const MESSAGE_MIN = 20;
const MESSAGE_MAX = 1000;

const topicValues = contactTopics.map((topic) => topic.value) as [
  (typeof contactTopics)[number]["value"],
  ...(typeof contactTopics)[number]["value"][],
];

const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80, "Use 80 characters or fewer."),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address.")
    .pipe(z.email("Enter a valid email address, like name@example.com.")),
  orderNumber: z
    .string()
    .trim()
    .transform((value) => value.toUpperCase())
    .refine(
      // Same format as the order numbers generated at checkout.
      (value) => value === "" || ORDER_ID_PATTERN.test(value),
      "Order numbers look like ORD-7KQ2XM.",
    ),
  topic: z.enum(topicValues, { error: "Choose a topic." }),
  message: z
    .string()
    .trim()
    .min(MESSAGE_MIN, `Tell us a little more (at least ${MESSAGE_MIN} characters).`)
    .max(MESSAGE_MAX, `Keep it under ${MESSAGE_MAX} characters.`),
});

type ContactInput = z.input<typeof contactSchema>;
type ContactValues = z.output<typeof contactSchema>;

const defaultValues: Partial<ContactInput> = {
  name: "",
  email: "",
  orderNumber: "",
  message: "",
};

/**
 * Contact form. Demo only: replace the timeout with a Server Action that
 * forwards the message to your help desk or email provider (Resend, Postmark,
 * Zendesk, Help Scout...).
 */
export function ContactForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput, unknown, ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues,
  });
  const message = useWatch({ control, name: "message" }) ?? "";

  async function onSubmit(values: ContactValues) {
    setSentTo(null);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const firstName = values.name.split(" ")[0];
    toast.success("Message sent", {
      description: `Thanks ${firstName}, we’ll reply to ${values.email} soon.`,
    });
    setSentTo(values.email);
    reset(defaultValues);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* A persistent live region announces the confirmation; the Alert's own
          role="alert" is dropped so it isn't announced twice. */}
      <div role="status">
        {sentTo && (
          <Alert role={undefined} className="border-success/30 bg-success/5">
            <CircleCheckIcon aria-hidden className="text-success" />
            <AlertTitle>Thanks, your message is on its way</AlertTitle>
            <AlertDescription>
              We’ll get back to you at {sentTo}. {contactDetails.responseTime}
            </AlertDescription>
          </Alert>
        )}
      </div>

      <form noValidate onSubmit={handleSubmit(onSubmit)} aria-labelledby="contact-form-heading">
        <FieldGroup>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field data-invalid={errors.name ? true : undefined}>
              <FieldLabel htmlFor="contact-name">Name</FieldLabel>
              <Input
                id="contact-name"
                autoComplete="name"
                placeholder="Alex Morgan"
                className="h-10"
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? "contact-name-error" : undefined}
                readOnly={isSubmitting}
                {...register("name")}
              />
              <FieldError id="contact-name-error" errors={[errors.name]} />
            </Field>

            <Field data-invalid={errors.email ? true : undefined}>
              <FieldLabel htmlFor="contact-email">Email</FieldLabel>
              <Input
                id="contact-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="h-10"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? "contact-email-error" : undefined}
                readOnly={isSubmitting}
                {...register("email")}
              />
              <FieldError id="contact-email-error" errors={[errors.email]} />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Controller
              control={control}
              name="topic"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid ? true : undefined}>
                  <FieldLabel htmlFor="contact-topic">Topic</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger
                      id="contact-topic"
                      ref={field.ref}
                      onBlur={field.onBlur}
                      className="h-10 w-full data-[size=default]:h-10"
                      aria-invalid={fieldState.invalid ? true : undefined}
                      aria-describedby={fieldState.error ? "contact-topic-error" : undefined}
                    >
                      <SelectValue placeholder="What can we help with?" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {contactTopics.map((topic) => (
                        <SelectItem key={topic.value} value={topic.value}>
                          {topic.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError id="contact-topic-error" errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Field data-invalid={errors.orderNumber ? true : undefined}>
              <FieldLabel htmlFor="contact-order">
                Order number <span className="font-normal text-muted-foreground">(optional)</span>
              </FieldLabel>
              <Input
                id="contact-order"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                placeholder="ORD-7KQ2XM"
                className="h-10 font-mono uppercase placeholder:normal-case"
                aria-invalid={errors.orderNumber ? true : undefined}
                aria-describedby={
                  errors.orderNumber ? "contact-order-error" : "contact-order-hint"
                }
                readOnly={isSubmitting}
                {...register("orderNumber")}
              />
              {errors.orderNumber ? (
                <FieldError id="contact-order-error" errors={[errors.orderNumber]} />
              ) : (
                <FieldDescription id="contact-order-hint">
                  Found in your confirmation email.
                </FieldDescription>
              )}
            </Field>
          </div>

          <Field data-invalid={errors.message ? true : undefined}>
            <div className="flex items-baseline justify-between gap-4">
              <FieldLabel htmlFor="contact-message">Message</FieldLabel>
              <span
                aria-hidden
                className="text-xs text-muted-foreground tabular-nums data-[over=true]:text-destructive"
                data-over={message.length > MESSAGE_MAX}
              >
                {message.length}/{MESSAGE_MAX}
              </span>
            </div>
            <Textarea
              id="contact-message"
              rows={6}
              placeholder="Tell us how we can help. For a return or exchange, include the item and size."
              className="min-h-36 resize-y"
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={errors.message ? "contact-message-error" : "contact-message-hint"}
              readOnly={isSubmitting}
              {...register("message")}
            />
            {errors.message ? (
              <FieldError id="contact-message-error" errors={[errors.message]} />
            ) : (
              <FieldDescription id="contact-message-hint">
                {`At least ${MESSAGE_MIN} characters. Please don’t include card details.`}
              </FieldDescription>
            )}
          </Field>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">{contactDetails.responseTime}</p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="lg"
                className="h-11 rounded-full px-5"
                disabled={isSubmitting}
                onClick={() => {
                  reset(defaultValues);
                  setSentTo(null);
                }}
              >
                Reset
              </Button>
              <Button
                type="submit"
                size="lg"
                className="h-11 flex-1 rounded-full px-6 sm:flex-none"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Spinner data-icon="inline-start" aria-hidden />
                ) : (
                  <SendIcon data-icon="inline-start" aria-hidden />
                )}
                {isSubmitting ? "Sending…" : "Send message"}
              </Button>
            </div>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
