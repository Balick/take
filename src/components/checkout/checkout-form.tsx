"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCardIcon, InfoIcon, LockIcon } from "lucide-react";
import { useId } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";

import { CheckboxField, CountryField, TextField } from "@/components/checkout/checkout-fields";
import {
  checkoutDefaultValues,
  checkoutSchema,
  deliveryMethods,
  formatCardNumber,
  formatExpiry,
  getCountry,
  getItemsSubtotal,
  getShippingCost,
  type CheckoutFormValues,
} from "@/components/checkout/checkout-schema";
import { CheckoutSection } from "@/components/checkout/checkout-section";
import { CheckoutSummary } from "@/components/checkout/checkout-summary";
import { generateOrderId } from "@/components/checkout/order-id";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";
import type { CartItem } from "@/types";

/** Simulated payment processing time. */
const PAYMENT_DELAY_MS = 1200;

interface CheckoutFormProps {
  items: CartItem[];
  /** Called once the (simulated) payment succeeded. */
  onOrderPlaced: (orderId: string, values: CheckoutFormValues) => void;
}

/** Single-page checkout: contact, shipping, delivery and demo payment. */
export function CheckoutForm({ items, onOrderPlaced }: CheckoutFormProps) {
  const formId = useId();
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: checkoutDefaultValues,
    mode: "onTouched",
    // The first invalid field is focused on submit (react-hook-form default).
    shouldFocusError: true,
  });

  const { control, handleSubmit, formState } = form;
  const [delivery, country, billingSameAsShipping, billingCountry] = useWatch({
    control,
    name: ["delivery", "country", "billingSameAsShipping", "billingCountry"],
  });

  const subtotal = getItemsSubtotal(items);
  const shippingCountry = getCountry(country);
  const billingPostalOptional = getCountry(billingCountry)?.requiresPostalCode === false;

  async function onSubmit(values: CheckoutFormValues) {
    // Replace with a call to your payment provider (Stripe, Adyen, PayPal...).
    await new Promise((resolve) => setTimeout(resolve, PAYMENT_DELAY_MS));
    onOrderPlaced(generateOrderId(), values);
  }

  return (
    <FormProvider {...form}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-16 xl:gap-20">
        <form
          id={formId}
          noValidate
          aria-label="Checkout"
          onSubmit={handleSubmit(onSubmit)}
          className="min-w-0"
        >
          <fieldset disabled={formState.isSubmitting} className="flex min-w-0 flex-col gap-10">
            {/* 1. Contact */}
            <CheckoutSection
              step={1}
              title="Contact"
              description="We’ll send your order confirmation and tracking updates here."
            >
              <FieldGroup>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  spellCheck={false}
                />
                <CheckboxField
                  name="newsletter"
                  label="Email me with news, restocks and exclusive offers"
                />
              </FieldGroup>
            </CheckoutSection>

            {/* 2. Shipping address */}
            <CheckoutSection step={2} title="Shipping address">
              <FieldGroup className="grid gap-5 sm:grid-cols-2">
                <TextField name="firstName" label="First name" autoComplete="given-name" />
                <TextField name="lastName" label="Last name" autoComplete="family-name" />
                <TextField
                  name="address"
                  label="Address"
                  autoComplete="address-line1"
                  placeholder="Street and house number"
                  className="sm:col-span-2"
                />
                <TextField
                  name="apartment"
                  label="Apartment, suite, etc."
                  autoComplete="address-line2"
                  optional
                  className="sm:col-span-2"
                />
                <TextField name="city" label="City" autoComplete="address-level2" />
                <CountryField name="country" dependents={["region", "postalCode"]} />
                <TextField
                  name="region"
                  label={shippingCountry?.regionLabel ?? "State / region"}
                  optional={!shippingCountry?.requiresRegion}
                  autoComplete="address-level1"
                />
                <TextField
                  name="postalCode"
                  label={shippingCountry?.postalLabel ?? "Postal code"}
                  optional={shippingCountry?.requiresPostalCode === false}
                  autoComplete="postal-code"
                  autoCapitalize="characters"
                />
                <TextField
                  name="phone"
                  label="Phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+1 555 010 0199"
                  description="Only used by the carrier if there’s an issue with your delivery."
                  className="sm:col-span-2"
                />
              </FieldGroup>
            </CheckoutSection>

            {/* 3. Delivery method */}
            <CheckoutSection
              step={3}
              title="Delivery method"
              description={`Standard shipping is free on orders of ${formatPrice(siteConfig.freeShippingThreshold)} or more.`}
            >
              <Controller
                name="delivery"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    ref={field.ref}
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    aria-label="Delivery method"
                    className="gap-3"
                  >
                    {deliveryMethods.map((method) => {
                      const cost = getShippingCost(method.value, subtotal);
                      const id = `checkout-delivery-${method.value}`;
                      return (
                        <FieldLabel
                          key={method.value}
                          htmlFor={id}
                          className="cursor-pointer rounded-xl! transition-colors"
                        >
                          <Field orientation="horizontal" className="items-center p-4!">
                            <RadioGroupItem value={method.value} id={id} />
                            <FieldContent>
                              <FieldTitle>{method.label}</FieldTitle>
                              <FieldDescription>{method.estimate}</FieldDescription>
                            </FieldContent>
                            <span className="text-sm font-medium tabular-nums">
                              {cost === 0 ? "Free" : formatPrice(cost)}
                            </span>
                          </Field>
                        </FieldLabel>
                      );
                    })}
                  </RadioGroup>
                )}
              />
            </CheckoutSection>

            {/* 4. Payment */}
            <CheckoutSection
              step={4}
              title="Payment"
              badge={
                <Badge variant="outline" className="ml-auto">
                  Demo
                </Badge>
              }
              description="All transactions are secure and encrypted."
            >
              <Alert role="note" className="bg-muted/50">
                <InfoIcon aria-hidden />
                <AlertDescription>
                  This is a demo store — no payment will be processed. Use any test values like{" "}
                  <span className="font-mono whitespace-nowrap text-foreground">
                    4242 4242 4242 4242
                  </span>
                  .
                </AlertDescription>
              </Alert>

              <FieldGroup className="grid grid-cols-2 gap-5">
                <TextField
                  name="cardNumber"
                  label="Card number"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="1234 1234 1234 1234"
                  maxLength={23}
                  format={formatCardNumber}
                  addon={<CreditCardIcon aria-hidden />}
                  className="col-span-2"
                />
                <TextField
                  name="cardExpiry"
                  label="Expiration (MM/YY)"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM/YY"
                  maxLength={5}
                  format={formatExpiry}
                  className="col-span-2 min-[400px]:col-span-1"
                />
                <TextField
                  name="cardCvc"
                  label="Security code"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="CVC"
                  maxLength={4}
                  format={(value) => value.replace(/\D/g, "").slice(0, 4)}
                  addon={<LockIcon aria-hidden />}
                  className="col-span-2 min-[400px]:col-span-1"
                />
                <TextField
                  name="cardName"
                  label="Name on card"
                  autoComplete="cc-name"
                  className="col-span-2"
                />
                <CheckboxField
                  name="billingSameAsShipping"
                  label="Billing address same as shipping"
                  className="col-span-2"
                />
              </FieldGroup>

              {!billingSameAsShipping && (
                <FieldGroup
                  role="group"
                  aria-labelledby="checkout-billing-heading"
                  className="grid gap-5 rounded-xl border p-4 sm:grid-cols-2 sm:p-6"
                >
                  <h3
                    id="checkout-billing-heading"
                    className="text-sm font-medium sm:col-span-2"
                  >
                    Billing address
                  </h3>
                  <TextField
                    name="billingAddress"
                    label="Address"
                    autoComplete="billing address-line1"
                    className="sm:col-span-2"
                  />
                  <TextField name="billingCity" label="City" autoComplete="billing address-level2" />
                  <TextField
                    name="billingPostalCode"
                    label="Postal code"
                    optional={billingPostalOptional}
                    autoComplete="billing postal-code"
                    autoCapitalize="characters"
                  />
                  <CountryField
                    name="billingCountry"
                    autoComplete="billing country"
                    dependents={["billingPostalCode"]}
                    className="sm:col-span-2"
                  />
                </FieldGroup>
              )}
            </CheckoutSection>
          </fieldset>
        </form>

        <CheckoutSummary
          items={items}
          delivery={delivery}
          formId={formId}
          isSubmitting={formState.isSubmitting}
        />
      </div>
    </FormProvider>
  );
}
