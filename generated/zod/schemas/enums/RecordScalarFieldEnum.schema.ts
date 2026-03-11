import * as z from 'zod';

export const RecordScalarFieldEnumSchema = z.enum(['id', 'tableId', 'order', 'data', 'createdAt', 'updatedAt'])

export type RecordScalarFieldEnum = z.infer<typeof RecordScalarFieldEnumSchema>;