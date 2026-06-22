/**
 * Single backend shared with the parent app (CONVENTIONS.md §0). Override via
 * EXPO_PUBLIC_API_URL.
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api';
