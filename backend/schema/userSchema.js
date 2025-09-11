

import z, { string } from 'zod'

export const CreateUserSChema = z.object({
  name: z.string().min(1, 'Name is required'),
 email: z.string().email('Email must be valid'),
 password:z.string()
  .min(8, 'Password must be at least 8 characters')


})