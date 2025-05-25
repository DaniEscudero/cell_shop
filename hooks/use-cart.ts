"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  increaseQuantity: (id: string) => void
  decreaseQuantity: (id: string) => void
  clearCart: () => void
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (item) => {
        const { items } = get()
        const existingItem = items.find((i) => i.id === item.id)

        if (existingItem) {
          // Si el artículo ya existe, aumentamos la cantidad
          return get().increaseQuantity(item.id)
        }

        // Si es un artículo nuevo, lo añadimos al carrito
        set((state) => {
          const updatedItems = [...state.items, item]
          return {
            items: updatedItems,
            totalItems: updatedItems.reduce((total, item) => total + item.quantity, 0),
            totalPrice: updatedItems.reduce((total, item) => total + item.price * item.quantity, 0),
          }
        })
      },

      removeItem: (id) => {
        set((state) => {
          const updatedItems = state.items.filter((item) => item.id !== id)
          return {
            items: updatedItems,
            totalItems: updatedItems.reduce((total, item) => total + item.quantity, 0),
            totalPrice: updatedItems.reduce((total, item) => total + item.price * item.quantity, 0),
          }
        })
      },

      increaseQuantity: (id) => {
        set((state) => {
          const updatedItems = state.items.map((item) => {
            if (item.id === id) {
              return { ...item, quantity: item.quantity + 1 }
            }
            return item
          })

          return {
            items: updatedItems,
            totalItems: updatedItems.reduce((total, item) => total + item.quantity, 0),
            totalPrice: updatedItems.reduce((total, item) => total + item.price * item.quantity, 0),
          }
        })
      },

      decreaseQuantity: (id) => {
        const { items } = get()
        const item = items.find((i) => i.id === id)

        if (item && item.quantity === 1) {
          // Si la cantidad es 1, eliminamos el artículo
          return get().removeItem(id)
        }

        set((state) => {
          const updatedItems = state.items.map((item) => {
            if (item.id === id) {
              return { ...item, quantity: item.quantity - 1 }
            }
            return item
          })

          return {
            items: updatedItems,
            totalItems: updatedItems.reduce((total, item) => total + item.quantity, 0),
            totalPrice: updatedItems.reduce((total, item) => total + item.price * item.quantity, 0),
          }
        })
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        })
      },
    }),
    {
      name: "cart-storage", // nombre para localStorage
    },
  ),
)
