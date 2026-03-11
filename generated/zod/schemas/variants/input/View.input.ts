import * as z from 'zod';
// prettier-ignore
export const ViewInputSchema = z.object({
    id: z.string(),
    name: z.string(),
    tableId: z.string(),
    table: z.unknown(),
    filters: z.unknown(),
    sorts: z.unknown(),
    hiddenFields: z.unknown(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type ViewInputType = z.infer<typeof ViewInputSchema>;
