import * as z from 'zod';

export const TableScalarFieldEnumSchema = z.enum(['id', 'name', 'baseId', 'order', 'createdAt', 'updatedAt'])

export type TableScalarFieldEnum = z.infer<typeof TableScalarFieldEnumSchema>;