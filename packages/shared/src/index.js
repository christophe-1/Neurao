// packages/shared/src/index.js
export const ORDER_STATUSES = Object.freeze(['pending', 'paid', 'shipped', 'cancelled'])
export { productIdSchema, productListQuerySchema } from './schemas/productSchemas.js'
