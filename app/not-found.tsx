// app/not-found.tsx (root level)
// This redirects to the localized not-found page
import { redirect } from "next/navigation";

export default function RootNotFound() {
  // Redirect to default locale's not-found
  redirect("/en");
}
