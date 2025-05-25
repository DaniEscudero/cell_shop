import { OrdersTable } from "@/components/dashboard/orders-table"

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
        <p className="text-muted-foreground">Gestiona los pedidos realizados en la tienda.</p>
      </div>

      <OrdersTable />
    </div>
  )
}
