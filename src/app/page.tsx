import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  // If user is logged in → go to dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  // If user is NOT logged in → go to auth flow
  redirect("/auth/signin");
}