"use client";

import { create } from "zustand";

interface SearchState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

/**
 * Open state of the global search palette. Any client component can open it
 * with `useSearchStore.getState().setOpen(true)`.
 */
export const useSearchStore = create<SearchState>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
