"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** `true` on macOS and iOS. Client-only: reads `navigator`. */
export function isApplePlatform() {
  return /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
}

/** `true` on Apple platforms, `false` on the server and elsewhere. */
export function useIsApplePlatform() {
  return useSyncExternalStore(noop, isApplePlatform, () => false);
}
