import * as z from 'zod';
// prettier-ignore
export const RecordInputSchema = z.object({
    id: z.string(),
    tableId: z.string(),
    table: z.unknown(),
    order: z.number().int(),
    data: z.unknown(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type RecordInputType = z.infer<typeof RecordInputSchema>;
