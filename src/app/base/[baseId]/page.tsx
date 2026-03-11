import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { BaseView } from "~/features/base/components/BaseView";

interface Props {
  params: { baseId: string };
}

export default async function BasePage({ params }: Props) {
  const session = await auth();
  if (!session) redirect("/api/auth/signin");
  return <BaseView baseId={params.baseId} />;
}