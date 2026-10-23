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
