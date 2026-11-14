import { QUANTITY_MAX } from '@neurao/shared'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/** The cart, shared by every component and saved in the browser (localStorage). */
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      /** Adds a product to the cart. If it is already there, adds to its quantity (10 at most). */
      addItem: (product, quantity) => {
        const oldItem = get().items.find((item) => item.productId === product.id)
        const otherItems = get().items.filter((item) => item.productId !== product.id)

        let newQuantity = quantity
        if (oldItem) {
          newQuantity = Math.min(oldItem.quantity + quantity, QUANTITY_MAX)
        }

        const newItem = {
          productId: product.id,
          name: product.name,
          unitPriceCents: product.unitPriceCents,
          image: product.image,
          quantity: newQuantity,
        }
        set({ items: [...otherItems, newItem] })
      },
    }),
    { name: 'neurao-cart', skipHydration: true },
  ),
)
