import { z } from "zod";
import type { UserModelSchema } from "generated/zod/schemas/variants/pure/User.pure";

// ─── Base type ────────────────────────────────────────────────────────────────
// Use the generated scalar-only schema directly for the base type
export type User = z.infer<typeof UserModelSchema>;

// ─── Views ────────────────────────────────────────────────────────────────────
// Build from scratch using only scalars — avoids ZodUnknown from relation fields
export const UserSummarySchema = z.object({
  id:   z.string(),
  name: z.string(),
});
export type UserSummary = z.infer<typeof UserSummarySchema>;