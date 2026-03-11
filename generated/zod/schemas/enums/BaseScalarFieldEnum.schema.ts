import * as z from 'zod';

export const BaseScalarFieldEnumSchema = z.enum(['id', 'name', 'createdById', 'createdAt', 'updatedAt'])

export type BaseScalarFieldEnum = z.infer<typeof BaseScalarFieldEnumSchema>;