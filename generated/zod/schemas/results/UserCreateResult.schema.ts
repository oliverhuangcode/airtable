import * as z from 'zod';
export const UserCreateResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  bases: z.array(z.unknown()),
  createdAt: z.date(),
  updatedAt: z.date()
});