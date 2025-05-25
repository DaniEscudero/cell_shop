"use client"

import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"

interface CartItemProps {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export function CartItem({ id, name, price, quantity, image }: CartItemProps) {
  const { increaseQuantity, decreaseQuantity, removeItem } = useCart()

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-20 overflow-hidden rounded-md border">
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <h3 className="font-medium">{name}</h3>
        <p className="text-sm text-muted-foreground">${price.toFixed(2)}</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => decreaseQuantity(id)}>
            <Minus className="h-3 w-3" />
            <span className="sr-only">Decrease quantity</span>
          </Button>
          <span className="w-4 text-center text-sm">{quantity}</span>
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => increaseQuantity(id)}>
            <Plus className="h-3 w-3" />
            <span className="sr-only">Increase quantity</span>
          </Button>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeItem(id)}>
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Remove item</span>
      </Button>
    </div>
  )
}
