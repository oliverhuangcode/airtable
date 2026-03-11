import * as z from 'zod';

export const FieldScalarFieldEnumSchema = z.enum(['id', 'name', 'type', 'tableId', 'order', 'createdAt', 'updatedAt'])

export type FieldScalarFieldEnum = z.infer<typeof FieldScalarFieldEnumSchema>;