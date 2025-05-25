import { ProductsTable } from "@/components/dashboard/products-table"

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
        <p className="text-muted-foreground">Gestiona el catálogo de productos de la tienda.</p>
      </div>

      <ProductsTable />
    </div>
  )
}
