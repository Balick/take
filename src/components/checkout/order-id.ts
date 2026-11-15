/** Shape of the demo order numbers, e.g. "ORD-7KQ2XM". */
export const ORDER_ID_PATTERN = /^ORD-[A-Z0-9]{6}$/;

/** Readable order number without ambiguous characters (0/O, 1/I). */
export function generateOrderId() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  const id = Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
  return `ORD-${id}`;
}

export function isOrderId(value: unknown): value is string {
  return typeof value === "string" && ORDER_ID_PATTERN.test(value);
}
