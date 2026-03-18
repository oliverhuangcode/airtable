import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { StarredView } from "~/features/bases/components/StarredView";

export default async function StarredPage() {
  const session = await auth();
  if (!session) redirect("/api/auth/signin");
  return <StarredView />;
}
