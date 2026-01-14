import { notFound } from "next/navigation";

// This catch-all route ensures that any unmatched path
// within a valid locale triggers the locale-specific not-found.tsx
export default function CatchAll() {
  notFound();
}
