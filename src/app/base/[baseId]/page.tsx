// src/app/base/[baseId]/page.tsx
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { BaseView } from "~/features/base/components/BaseView";

interface Props {
  params: Promise<{ baseId: string }>;
}

export default async function BasePage({ params }: Props) {
  const [session, { baseId }] = await Promise.all([auth(), params]);
  if (!session) redirect("/api/auth/signin");
  return (
    <Suspense fallback={null}>
      <BaseView baseId={baseId} />
    </Suspense>
  );
}
