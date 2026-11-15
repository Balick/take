"use client";

import { ChevronDownIcon, TagIcon } from "lucide-react";
import { useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";

/**
 * Promo code entry. The template ships without a promotion engine, so every
 * code is rejected: plug your own validation into `applyCode`.
 */
export function PromoCodeForm() {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorId = `${id}-error`;

  async function applyCode(value: string) {
    // Simulates a round trip to the server.
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { valid: false, code: value };
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const value = code.trim().toUpperCase();

    if (!value) {
      setError("Enter a promo code first.");
      inputRef.current?.focus();
      return;
    }

    setPending(true);
    setError(null);
    let result: Awaited<ReturnType<typeof applyCode>>;
    try {
      result = await applyCode(value);
    } catch {
      setError("We couldn’t check this code. Please try again.");
      inputRef.current?.focus();
      return;
    } finally {
      setPending(false);
    }

    if (!result.valid) {
      setError(`“${value}” is not valid or has expired.`);
      // The Apply button was disabled while pending, which drops its focus:
      // bring it back to the input so the code can be corrected right away.
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }

  return (
    <Collapsible className="w-full">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="group/promo h-auto w-full justify-between rounded-none px-6 py-4 text-sm font-medium hover:bg-transparent focus-visible:ring-inset dark:hover:bg-transparent"
        >
          <span className="flex items-center gap-2">
            <TagIcon className="text-muted-foreground" aria-hidden />
            Have a promo code?
          </span>
          <ChevronDownIcon
            aria-hidden
            className="text-muted-foreground transition-transform motion-safe:duration-200 group-data-[state=open]/promo:rotate-180"
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-6 pb-5">
        <form onSubmit={handleSubmit} noValidate>
          <Field data-invalid={!!error}>
            <FieldLabel htmlFor={id} className="sr-only">
              Promo code
            </FieldLabel>
            <InputGroup className="h-10 bg-background">
              <InputGroupInput
                ref={inputRef}
                id={id}
                name="promo"
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                  setError(null);
                }}
                aria-invalid={!!error}
                aria-describedby={error ? errorId : undefined}
                placeholder="Enter code"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                className="uppercase placeholder:normal-case"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="submit"
                  variant="secondary"
                  size="sm"
                  className="h-7 px-3"
                  disabled={pending}
                >
                  {pending && <Spinner data-icon="inline-start" aria-hidden role={undefined} />}
                  Apply
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <FieldError id={errorId}>{error}</FieldError>
          </Field>
        </form>
      </CollapsibleContent>
    </Collapsible>
  );
}
