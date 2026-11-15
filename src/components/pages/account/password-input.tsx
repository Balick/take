"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type">;

/** Password field with a show/hide toggle. Forwards `ref`, so it works with `register()`. */
export function PasswordInput({ className, disabled, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <InputGroup className={cn("h-10", className)} data-disabled={disabled ? true : undefined}>
      <InputGroupInput
        type={visible ? "text" : "password"}
        disabled={disabled}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-xs"
          aria-label="Show password"
          aria-pressed={visible}
          title={visible ? "Hide password" : "Show password"}
          aria-controls={props.id}
          disabled={disabled}
          onClick={() => setVisible((value) => !value)}
        >
          {visible ? <EyeOffIcon aria-hidden /> : <EyeIcon aria-hidden />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
