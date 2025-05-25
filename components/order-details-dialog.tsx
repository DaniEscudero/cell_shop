import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Package, Calendar, MapPin, User, Mail, CreditCard } from "lucide-react"

interface OrderDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
}

interface Order {
  id: string
  customer: string
  email?: string
  date: string
  status: string
  total: string
  items: number
  shippingAddress?: {
    street: string
    city: string
    postalCode: string
    country: string
  }
  products?: Array<{
    name: string
    price: number
    quantity: number
  }>
}

export function OrderDetailsDialog({ open, onOpenChange, order }: OrderDetailsDialogProps) {
  if (!order) return null

  // Datos de ejemplo para productos
  const orderProducts = order.products || [
    { name: "iPhone 15 Pro", price: 999, quantity: 1 },
    { name: "Funda de silicona", price: 49, quantity: 1 },
    { name: "Protector de pantalla", price: 19, quantity: 2 },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Detalles del Pedido {order.id}
          </DialogTitle>
          <DialogDescription>Información completa del pedido</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Estado y fecha */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
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
              <span className="text-sm text-muted-foreground">
                <Calendar className="mr-1 inline-block h-3 w-3" />
                {order.date}
              </span>
            </div>
            <div className="font-medium">Total: {order.total}</div>
          </div>

          <Separator />

          {/* Información del cliente */}
          <div>
            <h3 className="mb-2 font-medium">Información del cliente</h3>
            <div className="grid gap-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{order.customer}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{order.email || "cliente@example.com"}</span>
              </div>
            </div>
          </div>

          {/* Dirección de envío */}
          <div>
            <h3 className="mb-2 font-medium">Dirección de envío</h3>
            <div className="rounded-md border p-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p>{order.shippingAddress?.street || "Calle Ejemplo 123"}</p>
                  <p>
                    {order.shippingAddress?.city || "Madrid"}, {order.shippingAddress?.postalCode || "28001"}
                  </p>
                  <p>{order.shippingAddress?.country || "España"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Productos */}
          <div>
            <h3 className="mb-2 font-medium">Productos</h3>
            <div className="rounded-md border">
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 p-4 text-sm font-medium">
                <div>Producto</div>
                <div className="text-right">Cant.</div>
                <div className="text-right">Precio</div>
              </div>
              <Separator />
              {orderProducts.map((product, index) => (
                <div key={index} className="grid grid-cols-[1fr_auto_auto] gap-4 p-4 text-sm">
                  <div>{product.name}</div>
                  <div className="text-right">{product.quantity}</div>
                  <div className="text-right">${product.price.toFixed(2)}</div>
                </div>
              ))}
              <Separator />
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 p-4 text-sm font-medium">
                <div>Total</div>
                <div></div>
                <div className="text-right">{order.total}</div>
              </div>
            </div>
          </div>

          {/* Método de pago */}
          <div>
            <h3 className="mb-2 font-medium">Método de pago</h3>
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span>Tarjeta de crédito</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
