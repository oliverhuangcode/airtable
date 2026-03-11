import * as z from 'zod';

export const ViewScalarFieldEnumSchema = z.enum(['id', 'name', 'tableId', 'filters', 'sorts', 'hiddenFields', 'createdAt', 'updatedAt'])

export type ViewScalarFieldEnum = z.infer<typeof ViewScalarFieldEnumSchema>;