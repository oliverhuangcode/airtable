import { z } from "zod";
import type { UserModelSchema } from "generated/zod/schemas/variants/pure/User.pure";

export type User = z.infer<typeof UserModelSchema>;

// Scalar-only subset — avoids ZodUnknown from Prisma relation fields.
export const UserSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
});
export type UserSummary = z.infer<typeof UserSummarySchema>;
