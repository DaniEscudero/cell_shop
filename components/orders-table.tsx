"use client"

import { useState } from "react"
import { MoreHorizontal, ArrowUpDown, ChevronDown, Package, Calendar, Edit, Eye, Download, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { OrderDetailsDialog } from "@/components/dashboard/order-details-dialog"
import { EditOrderStatusDialog } from "@/components/dashboard/edit-order-status-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

const orders = [
  {
    id: "ORD-001",
    customer: "Juan Díaz",
    email: "juan.diaz@example.com",
    date: "15/05/2023",
    status: "completed",
    total: "$1,999.00",
    items: 2,
    shippingAddress: {
      street: "Calle Mayor 123",
      city: "Madrid",
      postalCode: "28001",
      country: "España",
    },
    products: [
      { name: "iPhone 15 Pro", price: 999, quantity: 1 },
      { name: "Funda de silicona", price: 49, quantity: 1 },
      { name: "Protector de pantalla", price: 19, quantity: 2 },
    ],
  },
  {
    id: "ORD-002",
    customer: "María Rodríguez",
    email: "maria.rodriguez@example.com",
    date: "18/05/2023",
    status: "processing",
    total: "$899.00",
    items: 1,
    shippingAddress: {
      street: "Avenida Diagonal 456",
      city: "Barcelona",
      postalCode: "08001",
      country: "España",
    },
    products: [{ name: "Samsung Galaxy S24", price: 899, quantity: 1 }],
  },
  {
    id: "ORD-003",
    customer: "Carlos López",
    email: "carlos.lopez@example.com",
    date: "20/05/2023",
    status: "completed",
    total: "$3,298.00",
    items: 3,
    shippingAddress: {
      street: "Calle San Juan 789",
      city: "Valencia",
      postalCode: "46001",
      country: "España",
    },
  },
  {
    id: "ORD-004",
    customer: "Ana García",
    email: "ana.garcia@example.com",
    date: "22/05/2023",
    status: "shipped",
    total: "$1,249.00",
    items: 1,
    shippingAddress: {
      street: "Calle Gran Vía 321",
      city: "Madrid",
      postalCode: "28013",
      country: "España",
    },
  },
  {
    id: "ORD-005",
    customer: "Pedro Martínez",
    email: "pedro.martinez@example.com",
    date: "25/05/2023",
    status: "cancelled",
    total: "$799.00",
    items: 1,
    shippingAddress: {
      street: "Calle Sierpes 654",
      city: "Sevilla",
      postalCode: "41004",
      country: "España",
    },
  },
]

export function OrdersTable() {
  const { toast } = useToast()
  const [sorting, setSorting] = useState<"asc" | "desc" | null>(null)
  const [sortBy, setSortBy] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<(typeof orders)[0] | null>(null)
  const [ordersList, setOrdersList] = useState([...orders])

  const sortedOrders = [...ordersList]
    .sort((a, b) => {
      if (!sorting || !sortBy) return 0

      const aValue = a[sortBy as keyof typeof a]
      const bValue = b[sortBy as keyof typeof b]

      if (sorting === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
    .filter(
      (order) =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()),
    )

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSorting(sorting === "asc" ? "desc" : sorting === "desc" ? null : "asc")
      if (sorting === "desc") setSortBy(null)
    } else {
      setSortBy(column)
      setSorting("asc")
    }
  }

  const handleViewDetails = (order: (typeof orders)[0]) => {
    setSelectedOrder(order)
    setDetailsDialogOpen(true)
  }

  const handleEditStatus = (order: (typeof orders)[0]) => {
    setSelectedOrder(order)
    setStatusDialogOpen(true)
  }

  const handleDeleteOrder = (orderId: string) => {
    setOrdersList(ordersList.filter((order) => order.id !== orderId))

    toast({
      title: "Pedido eliminado",
      description: `El pedido ${orderId} ha sido eliminado correctamente.`,
    })
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Pedidos</CardTitle>
            <CardDescription>Gestiona los pedidos realizados en la tienda.</CardDescription>
          </div>
          <Button>Exportar Pedidos</Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Package className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID o cliente..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Filtros
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filtrar por estado</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Completados</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>En proceso</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Enviados</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Cancelados</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => handleSort("id")}>
                      <span>ID Pedido</span>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => handleSort("customer")}>
                      <span>Cliente</span>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => handleSort("date")}>
                      <span>Fecha</span>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => handleSort("status")}>
                      <span>Estado</span>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => handleSort("total")}>
                      <span>Total</span>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedOrders.length > 0 ? (
                  sortedOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{order.date}</span>
                        </div>
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>{order.total}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menú</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Ver detalles</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditStatus(order)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Editar estado</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              <span>Descargar factura</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Eliminar</span>
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Esto eliminará permanentemente el pedido{" "}
                                    {order.id} y no podrá ser recuperado.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteOrder(order.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <OrderDetailsDialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen} order={selectedOrder} />
      <EditOrderStatusDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen} order={selectedOrder} />
    </>
  )
}
