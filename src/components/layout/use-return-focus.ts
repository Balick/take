"use client";

import { useRef } from "react";

/**
 * Radix dialogs hand focus back to their `Trigger` when they close. Dialogs
 * opened from a store (the cart sheet, the search palette) have no trigger, so
 * focus would otherwise fall back to `<body>` and keyboard users lose their
 * place. Spread these handlers on the dialog content: they remember the
 * element that had focus when the dialog opened and restore it on close.
 */
export function useReturnFocus() {
  const returnTo = useRef<HTMLElement | null>(null);

  function onOpenAutoFocus() {
    // Runs before focus moves into the dialog.
    const active = document.activeElement;
    returnTo.current = active instanceof HTMLElement && active !== document.body ? active : null;
  }

  function onCloseAutoFocus(event: Event) {
    const element = returnTo.current;
    returnTo.current = null;
    if (!element?.isConnected) return;
    event.preventDefault();
    element.focus({ preventScroll: true });
  }

  return { onOpenAutoFocus, onCloseAutoFocus };
}
