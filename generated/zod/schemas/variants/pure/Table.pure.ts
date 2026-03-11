import * as z from 'zod';
// prettier-ignore
export const TableModelSchema = z.object({
    id: z.string(),
    name: z.string(),
    baseId: z.string(),
    base: z.unknown(),
    order: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    fields: z.array(z.unknown()),
    records: z.array(z.unknown()),
    views: z.array(z.unknown())
}).strict();

export type TablePureType = z.infer<typeof TableModelSchema>;
