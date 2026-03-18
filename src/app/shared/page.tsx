import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { SharedView } from "~/features/bases/components/SharedView";

export default async function SharedPage() {
  const session = await auth();
  if (!session) redirect("/api/auth/signin");
  return <SharedView />;
}
