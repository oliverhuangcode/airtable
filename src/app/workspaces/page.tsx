import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { WorkspacesView } from "~/features/bases/components/WorkspacesView";

export default async function WorkspacesPage() {
  const session = await auth();
  if (!session) redirect("/api/auth/signin");
  return <WorkspacesView />;
}
