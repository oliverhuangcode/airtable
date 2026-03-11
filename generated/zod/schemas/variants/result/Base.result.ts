import * as z from 'zod';
// prettier-ignore
export const BaseResultSchema = z.object({
    id: z.string(),
    name: z.string(),
    createdById: z.string(),
    createdBy: z.unknown(),
    createdAt: z.date(),
    updatedAt: z.date(),
    tables: z.array(z.unknown())
}).strict();

export type BaseResultType = z.infer<typeof BaseResultSchema>;
