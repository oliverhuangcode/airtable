import * as z from 'zod';

export const FieldTypeSchema = z.enum(['TEXT', 'NUMBER'])

export type FieldType = z.infer<typeof FieldTypeSchema>;