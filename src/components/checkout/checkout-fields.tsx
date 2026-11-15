"use client";

import { Controller, useFormContext } from "react-hook-form";

import {
  countries,
  type CheckoutFormValues,
} from "@/components/checkout/checkout-schema";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type FieldName<T> = {
  [K in keyof CheckoutFormValues]: CheckoutFormValues[K] extends T ? K : never;
}[keyof CheckoutFormValues];

const fieldId = (name: string) => `checkout-${name}`;

interface TextFieldProps
  extends Omit<React.ComponentProps<"input">, "name" | "value" | "onChange" | "onBlur"> {
  name: FieldName<string>;
  label: React.ReactNode;
  description?: React.ReactNode;
  optional?: boolean;
  /** Icon or text rendered at the end of the input. */
  addon?: React.ReactNode;
  /** Reformats the raw value on every keystroke (card number, expiry...). */
  format?: (value: string, previous: string) => string;
}

/** Text input bound to the checkout form, with label and inline error. */
export function TextField({
  name,
  label,
  description,
  optional,
  addon,
  format,
  className,
  ...inputProps
}: TextFieldProps) {
  const { control } = useFormContext<CheckoutFormValues>();
  const id = fieldId(name);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const describedBy =
          [description && `${id}-description`, fieldState.error && `${id}-error`]
            .filter(Boolean)
            .join(" ") || undefined;

        const controlProps = {
          ...inputProps,
          id,
          ref: field.ref,
          name: field.name,
          value: field.value,
          onBlur: field.onBlur,
          onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
            field.onChange(
              format ? format(event.target.value, field.value) : event.target.value,
            ),
          "aria-invalid": fieldState.invalid,
          "aria-describedby": describedBy,
          "aria-required": optional ? undefined : true,
        };

        return (
          <Field data-invalid={fieldState.invalid} className={className}>
            <FieldLabel htmlFor={id}>
              {label}
              {optional && (
                <span className="font-normal text-muted-foreground">(optional)</span>
              )}
            </FieldLabel>
            {addon ? (
              <InputGroup className="h-10">
                <InputGroupInput {...controlProps} />
                <InputGroupAddon align="inline-end">{addon}</InputGroupAddon>
              </InputGroup>
            ) : (
              <Input {...controlProps} className="h-10" />
            )}
            {description && (
              <FieldDescription id={`${id}-description`}>{description}</FieldDescription>
            )}
            <FieldError id={`${id}-error`} errors={[fieldState.error]} />
          </Field>
        );
      }}
    />
  );
}

interface CountryFieldProps {
  name: "country" | "billingCountry";
  label?: string;
  autoComplete?: string;
  /**
   * Fields whose rules depend on the country (region, postal code). Those
   * already showing an error are re-validated when the country changes.
   */
  dependents?: (keyof CheckoutFormValues)[];
  className?: string;
}

/** Country select bound to the checkout form. */
export function CountryField({
  name,
  label = "Country / region",
  autoComplete = "country",
  dependents = [],
  className,
}: CountryFieldProps) {
  const { control, getFieldState, trigger } = useFormContext<CheckoutFormValues>();
  const id = fieldId(name);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <Select
            name={field.name}
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value);
              const invalid = dependents.filter((dependent) => getFieldState(dependent).invalid);
              if (invalid.length > 0) void trigger(invalid);
            }}
            autoComplete={autoComplete}
          >
            <SelectTrigger
              id={id}
              ref={field.ref}
              onBlur={field.onBlur}
              aria-invalid={fieldState.invalid}
              aria-describedby={fieldState.error ? `${id}-error` : undefined}
              className="w-full data-[size=default]:h-10"
            >
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent position="popper" className="max-h-72">
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError id={`${id}-error`} errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}

interface CheckboxFieldProps {
  name: FieldName<boolean>;
  label: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}

/** Checkbox bound to the checkout form. */
export function CheckboxField({ name, label, description, className }: CheckboxFieldProps) {
  const { control } = useFormContext<CheckoutFormValues>();
  const id = fieldId(name);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Field orientation="horizontal" className={cn("items-start", className)}>
          <Checkbox
            id={id}
            ref={field.ref}
            name={field.name}
            checked={field.value}
            onCheckedChange={(checked) => field.onChange(checked === true)}
            onBlur={field.onBlur}
            aria-describedby={description ? `${id}-description` : undefined}
            className="mt-0.5"
          />
          <FieldContent>
            <FieldLabel htmlFor={id} className="font-normal">
              {label}
            </FieldLabel>
            {description && (
              <FieldDescription id={`${id}-description`}>{description}</FieldDescription>
            )}
          </FieldContent>
        </Field>
      )}
    />
  );
}
