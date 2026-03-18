// src/app/page.tsx
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { BasesView } from "~/features/bases/components/BasesView";

export default async function HomePage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  return <BasesView />;
}
