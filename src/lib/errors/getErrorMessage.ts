function hasMessage(value: unknown): value is { message: unknown } {
  return typeof value === "object" && value !== null && "message" in value;
}

export function getErrorMessage(
  e: unknown,
  fallback = "Unexpected error"
): string {
  if (e instanceof Error) {
    return e.message;
  }

  if (typeof e === "string") {
    return e;
  }

  if (hasMessage(e) && typeof e.message === "string") {
    return e.message;
  }

  return fallback;
}
