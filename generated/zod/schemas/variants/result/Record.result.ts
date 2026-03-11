import * as z from 'zod';
// prettier-ignore
export const RecordResultSchema = z.object({
    id: z.string(),
    tableId: z.string(),
    table: z.unknown(),
    order: z.number().int(),
    data: z.unknown(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type RecordResultType = z.infer<typeof RecordResultSchema>;
