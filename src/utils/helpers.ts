/** Locate a single element by its `data-test` attribute value. */
export function getByDataTest(value: string) {
  return $(`[data-test="${value}"]`);
}

/** Locate all elements by their `data-test` attribute value. */
export function getAllByDataTest(value: string) {
  return $$(`[data-test="${value}"]`);
}

/** Build a case-insensitive RegExp from a message string. */
export function getCaseInsensitiveMsg(input: string): RegExp {
  return new RegExp(input, "i");
}

/** Parse a currency string like "$44.99" into a number. */
export function parseCurrency(text: string): number {
  return Number(text.replace(/[^0-9.]/g, ""));
}

/** Round a number to two decimal places. */
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Parse a percentage string like "Tax (8%)" into a rate like 0.08. */
export function parsePercentage(text: string): number {
  const match = text.match(/(\d+(?:\.\d+)?)%/);
  return match ? Number(match[1]) / 100 : 0;
}
