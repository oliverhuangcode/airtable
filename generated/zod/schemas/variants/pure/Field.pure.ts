import * as z from 'zod';
import { FieldTypeSchema } from '../../enums/FieldType.schema';
// prettier-ignore
export const FieldModelSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: FieldTypeSchema,
    tableId: z.string(),
    table: z.unknown(),
    order: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type FieldPureType = z.infer<typeof FieldModelSchema>;
