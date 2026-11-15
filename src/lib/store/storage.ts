import type { PersistStorage, StorageValue } from "zustand/middleware";

/**
 * JSON storage for persisted stores that never throws:
 * - falls back to memory when localStorage is unavailable (SSR, blocked site
 *   data, some private modes), so `store.persist` always exists;
 * - discards unreadable entries instead of failing hydration, so the UI never
 *   stays stuck on loading skeletons.
 */
export function createSafeStorage<T>(): PersistStorage<T> {
  const memory = new Map<string, string>();

  function backend(): Pick<Storage, "getItem" | "setItem" | "removeItem"> {
    try {
      const storage = window.localStorage;
      const probe = "__store_probe__";
      storage.setItem(probe, probe);
      storage.removeItem(probe);
      return storage;
    } catch {
      return {
        getItem: (key) => memory.get(key) ?? null,
        setItem: (key, value) => void memory.set(key, value),
        removeItem: (key) => void memory.delete(key),
      };
    }
  }

  return {
    getItem: (name) => {
      const storage = backend();
      const raw = storage.getItem(name);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as StorageValue<T>;
      } catch {
        storage.removeItem(name);
        return null;
      }
    },
    setItem: (name, value) => {
      try {
        backend().setItem(name, JSON.stringify(value));
      } catch {
        // Quota exceeded or storage revoked: keep working in memory.
      }
    },
    removeItem: (name) => backend().removeItem(name),
  };
}
