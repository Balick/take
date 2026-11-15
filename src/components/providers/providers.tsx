"use client";

import { ThemeProvider } from "next-themes";

import { StoreHydration } from "@/components/providers/store-hydration";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider delayDuration={200}>
        {children}
        <StoreHydration />
        {/* Fixed bottom bars (e.g. the product page "Add to bag" bar) set
            --sticky-bar-height so toasts stack above them on mobile. */}
        <Toaster
          position="bottom-right"
          closeButton
          mobileOffset={{ bottom: "calc(var(--sticky-bar-height, 0px) + 16px)" }}
        />
      </TooltipProvider>
    </ThemeProvider>
  );
}
