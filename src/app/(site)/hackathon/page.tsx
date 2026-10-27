import { redirect } from "next/navigation";

/**
 * No hackathon this edition (organisers, 2026-10-27): it moves to the next
 * one. Links already shared land on the home page. The former page is in the
 * git history (before commit "Edition 2026 without hackathon").
 */
export default function HackathonPage() {
  redirect("/");
}
