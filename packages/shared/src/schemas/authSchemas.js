import { z } from 'zod'

const EMAIL_MAX_LENGTH = 255
const PASSWORD_MIN_LENGTH = 15
const PASSWORD_MAX_LENGTH = 64
const NAME_MAX_LENGTH = 100

export const registerSchema = z.object({
  email: z.email().max(EMAIL_MAX_LENGTH),
  password: z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH),
  firstName: z.string().trim().min(1).max(NAME_MAX_LENGTH),
  lastName: z.string().trim().min(1).max(NAME_MAX_LENGTH),
})
