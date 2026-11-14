import { z } from 'zod'

const QUANTITY_MAX = 10
const NAME_MAX_LENGTH = 200
const ADDRESS_MAX_LENGTH = 255
const POSTAL_CODE_MAX_LENGTH = 10
const CITY_MAX_LENGTH = 100
const DELIVERY_COUNTRIES = ['FR', 'BE', 'CH', 'LU']

export const orderSchema = z.object({
  productId: z.number().int().min(1),
  quantity: z.number().int().min(1).max(QUANTITY_MAX),
  fullName: z.string().trim().min(1).max(NAME_MAX_LENGTH),
  address: z.string().trim().min(1).max(ADDRESS_MAX_LENGTH),
  postalCode: z.string().trim().min(1).max(POSTAL_CODE_MAX_LENGTH),
  city: z.string().trim().min(1).max(CITY_MAX_LENGTH),
  countryCode: z.enum(DELIVERY_COUNTRIES),
})
