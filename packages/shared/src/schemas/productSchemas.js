import { z } from 'zod'

const SLUG_MAX_LENGTH = 60
const SEARCH_MAX_LENGTH = 100

export const productListQuerySchema = z.object({
  category: z.string().max(SLUG_MAX_LENGTH).optional(),
  search: z.string().max(SEARCH_MAX_LENGTH).optional(),
  page: z.coerce.number().int().min(1).default(1),
})

export const productIdSchema = z.object({
  id: z.coerce.number().int().min(1),
})
