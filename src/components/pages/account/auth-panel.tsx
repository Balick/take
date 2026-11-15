"use client";

import Link from "next/link";
import { useState } from "react";

import { RegisterForm } from "@/components/pages/account/register-form";
import { SignInForm } from "@/components/pages/account/sign-in-form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AuthTab = "sign-in" | "register";

/** "Sign in" / "Create account" tabs. Demo only, see `demo-auth.ts`. */
export function AuthPanel() {
  const [tab, setTab] = useState<AuthTab>("sign-in");

  /** Switching from a link inside a panel unmounts it: move focus to the new form. */
  function switchTo(next: AuthTab, focusId: string) {
    setTab(next);
    requestAnimationFrame(() => document.getElementById(focusId)?.focus());
  }

  return (
    <Tabs value={tab} onValueChange={(value) => setTab(value as AuthTab)} className="gap-8">
      <TabsList className="w-full group-data-horizontal/tabs:h-10">
        <TabsTrigger value="sign-in">Sign in</TabsTrigger>
        <TabsTrigger value="register">Create account</TabsTrigger>
      </TabsList>

      <TabsContent value="sign-in" className="flex flex-col gap-6">
        <AuthHeading
          title="Welcome back"
          description="Sign in to track your orders, check out faster and see your wishlist on every device."
        />
        <SignInForm />
        <SwitchPrompt
          question="New here?"
          action="Create an account"
          onClick={() => switchTo("register", "register-name")}
        />
      </TabsContent>

      <TabsContent value="register" className="flex flex-col gap-6">
        <AuthHeading
          title="Create your account"
          description="It takes less than a minute. Free returns and early access to new drops included."
        />
        <RegisterForm />
        <SwitchPrompt
          question="Already have an account?"
          action="Sign in"
          onClick={() => switchTo("sign-in", "sign-in-email")}
        />
      </TabsContent>

      <p className="border-t pt-6 text-center text-sm text-muted-foreground">
        Just want to place an order?{" "}
        <Link
          href="/checkout"
          className="font-medium text-foreground underline underline-offset-4"
        >
          Check out as a guest
        </Link>
      </p>
    </Tabs>
  );
}

function AuthHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <h2 className="font-display text-3xl tracking-tight">{title}</h2>
      <p className="text-sm text-pretty text-muted-foreground">{description}</p>
    </div>
  );
}

function SwitchPrompt({
  question,
  action,
  onClick,
}: {
  question: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <p className="text-center text-sm text-muted-foreground">
      {question}{" "}
      <Button
        type="button"
        variant="link"
        className="h-auto p-0 text-sm text-foreground underline"
        onClick={onClick}
      >
        {action}
      </Button>
    </p>
  );
}
