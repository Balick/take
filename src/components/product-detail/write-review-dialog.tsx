"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PenLineIcon, StarIcon } from "lucide-react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const TITLE_MAX = 80;
const BODY_MAX = 1000;

const ratingLabels = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

const reviewSchema = z.object({
  rating: z.number().int().min(1, "Please choose a rating.").max(5),
  title: z
    .string()
    .trim()
    .min(3, "Add a short title (at least 3 characters).")
    .max(TITLE_MAX, `Keep the title under ${TITLE_MAX} characters.`),
  body: z
    .string()
    .trim()
    .min(20, "Tell us a little more (at least 20 characters).")
    .max(BODY_MAX, `Keep your review under ${BODY_MAX.toLocaleString("en-US")} characters.`),
});

type ReviewValues = z.infer<typeof reviewSchema>;

export function WriteReviewDialog({ productName }: { productName: string }) {
  const id = useId();
  const titleId = `${id}-title`;
  const bodyId = `${id}-body`;
  const [open, setOpen] = useState(false);
  const form = useForm<ReviewValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, title: "", body: "" },
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    // Start fresh next time: no stale values or error messages.
    if (!next) form.reset();
  }

  async function onSubmit() {
    // Demo only: plug in your reviews API (or a Server Action) here.
    await new Promise((resolve) => setTimeout(resolve, 600));
    toast.success("Thanks, your review will appear after moderation");
    handleOpenChange(false);
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="h-10 w-full rounded-full">
          <PenLineIcon data-icon="inline-start" />
          Write a review
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100svh-2rem)] gap-6 overflow-y-auto p-6 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl font-normal tracking-tight">
            Write a review
          </DialogTitle>
          <DialogDescription>
            Share your thoughts on the {productName} to help others choose.
          </DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <FieldGroup>
            <Controller
              name="rating"
              control={form.control}
              render={({ field, fieldState }) => (
                <StarRatingField
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={titleId}>Title</FieldLabel>
                  <Input
                    {...field}
                    id={titleId}
                    maxLength={TITLE_MAX}
                    placeholder="Sum it up in a few words"
                    aria-invalid={fieldState.invalid}
                    aria-describedby={fieldState.invalid ? `${titleId}-error` : undefined}
                    autoComplete="off"
                  />
                  <FieldError id={`${titleId}-error`} errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="body"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={bodyId}>Review</FieldLabel>
                  <Textarea
                    {...field}
                    id={bodyId}
                    rows={5}
                    maxLength={BODY_MAX}
                    placeholder="What did you like? How does it look, feel and hold up?"
                    aria-invalid={fieldState.invalid}
                    aria-describedby={
                      fieldState.invalid ? `${bodyId}-error ${bodyId}-count` : `${bodyId}-count`
                    }
                    className="min-h-32"
                  />
                  <FieldDescription id={`${bodyId}-count`} className="text-right tabular-nums">
                    {field.value.length.toLocaleString("en-US")} /{" "}
                    {BODY_MAX.toLocaleString("en-US")}
                    <span className="sr-only"> characters</span>
                  </FieldDescription>
                  <FieldError id={`${bodyId}-error`} errors={[fieldState.error]} />
                </Field>
              )}
            />
          </FieldGroup>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline" size="lg" className="rounded-full px-4">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              size="lg"
              className="rounded-full px-4"
              disabled={isSubmitting}
            >
              {isSubmitting && <Spinner data-icon="inline-start" aria-hidden />}
              {isSubmitting ? "Submitting…" : "Submit review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function StarRatingField({
  value,
  onChange,
  onBlur,
  error,
}: {
  value: number;
  onChange: (value: number) => void;
  onBlur: () => void;
  error?: string;
}) {
  const id = useId();
  const [hovered, setHovered] = useState(0);
  const preview = hovered || value;

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldTitle id={`${id}-label`}>Rating</FieldTitle>
      <div className="flex items-center gap-3">
        <RadioGroupPrimitive.Root
          value={value ? String(value) : ""}
          onValueChange={(next) => onChange(Number(next))}
          onBlur={onBlur}
          onMouseLeave={() => setHovered(0)}
          aria-labelledby={`${id}-label`}
          aria-required
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="-ml-1 flex w-fit"
        >
          {ratingLabels.slice(1).map((label, index) => {
            const stars = index + 1;
            return (
              <RadioGroupPrimitive.Item
                key={stars}
                value={String(stars)}
                aria-label={`${stars} ${stars === 1 ? "star" : "stars"}, ${label}`}
                onMouseEnter={() => setHovered(stars)}
                className="rounded-md p-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <StarIcon
                  aria-hidden
                  className={cn(
                    "size-7 transition-[color,fill,scale] motion-safe:duration-150",
                    stars <= preview
                      ? "fill-amber-400 text-amber-400"
                      : "fill-transparent text-muted-foreground",
                    stars === hovered && "motion-safe:scale-110",
                  )}
                />
              </RadioGroupPrimitive.Item>
            );
          })}
        </RadioGroupPrimitive.Root>
        <span aria-hidden className="text-sm text-muted-foreground">
          {ratingLabels[preview]}
        </span>
      </div>
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </Field>
  );
}
