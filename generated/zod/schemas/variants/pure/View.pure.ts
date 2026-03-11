import * as z from 'zod';
// prettier-ignore
export const ViewModelSchema = z.object({
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

export type ViewPureType = z.infer<typeof ViewModelSchema>;
