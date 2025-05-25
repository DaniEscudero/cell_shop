"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EditOrderStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: {
    id: string
    status: string
  } | null
}

const statuses = [
  { value: "processing", label: "En proceso" },
  { value: "shipped", label: "Enviado" },
  { value: "completed", label: "Completado" },
  { value: "cancelled", label: "Cancelado" },
]

export function EditOrderStatusDialog({ open, onOpenChange, order }: EditOrderStatusDialogProps) {
  const { toast } = useToast()
  const [status, setStatus] = useState<string>(order?.status || "processing")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // En un caso real, aquí enviaríamos los datos al servidor
    console.log(`Actualizando estado del pedido ${order?.id} a: ${status}`)

    toast({
      title: "Estado actualizado",
      description: `El pedido ${order?.id} ha sido actualizado a "${
        statuses.find((s) => s.value === status)?.label || status
      }".`,
    })

    onOpenChange(false)
  }

  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Actualizar Estado del Pedido
            </DialogTitle>
            <DialogDescription>
              Cambia el estado del pedido <span className="font-medium">{order.id}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Estado actual:</Label>
                <Badge
                  variant={
                    order.status === "completed"
                      ? "default"
                      : order.status === "processing"
                        ? "secondary"
                        : order.status === "shipped"
                          ? "outline"
                          : "destructive"
                  }
                >
                  {order.status === "completed"
                    ? "Completado"
                    : order.status === "processing"
                      ? "En proceso"
                      : order.status === "shipped"
                        ? "Enviado"
                        : "Cancelado"}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label>Selecciona el nuevo estado:</Label>
                <RadioGroup value={status} onValueChange={setStatus} className="space-y-2">
                  {statuses.map((statusOption) => (
                    <div key={statusOption.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={statusOption.value} id={`status-${statusOption.value}`} />
                      <Label htmlFor={`status-${statusOption.value}`} className="font-normal">
                        {statusOption.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
