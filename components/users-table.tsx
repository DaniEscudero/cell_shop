"use client"

import { useState } from "react"
import { MoreHorizontal, ArrowUpDown, ChevronDown, User, Mail, Calendar, Edit, Trash2 } from "lucide-react"

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
import { EditUserDialog } from "@/components/dashboard/edit-user-dialog"

const users = [
  {
    id: "1",
    name: "Juan Díaz",
    email: "juan.diaz@example.com",
    status: "active",
    role: "Usuario",
    lastActive: "Hace 2 horas",
  },
  {
    id: "2",
    name: "María Rodríguez",
    email: "maria.rodriguez@example.com",
    status: "active",
    role: "Admin",
    lastActive: "Hace 5 minutos",
  },
  {
    id: "3",
    name: "Carlos López",
    email: "carlos.lopez@example.com",
    status: "inactive",
    role: "Usuario",
    lastActive: "Hace 2 días",
  },
  {
    id: "4",
    name: "Ana García",
    email: "ana.garcia@example.com",
    status: "active",
    role: "Usuario",
    lastActive: "Hace 1 hora",
  },
  {
    id: "5",
    name: "Pedro Martínez",
    email: "pedro.martinez@example.com",
    status: "pending",
    role: "Usuario",
    lastActive: "Hace 1 semana",
  },
]

export function UsersTable() {
  const [sorting, setSorting] = useState<"asc" | "desc" | null>(null)
  const [sortBy, setSortBy] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(null)

  const sortedUsers = [...users]
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
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
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

  const handleEditUser = (user: (typeof users)[0]) => {
    setSelectedUser(user)
    setEditDialogOpen(true)
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Usuarios</CardTitle>
            <CardDescription>Gestiona los usuarios registrados en la plataforma.</CardDescription>
          </div>
          <Button>Añadir Usuario</Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o email..."
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
                <DropdownMenuCheckboxItem checked>Activos</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Inactivos</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Pendientes</DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Filtrar por rol</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Administradores</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>Usuarios</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => handleSort("name")}>
                      <span>Usuario</span>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => handleSort("role")}>
                      <span>Rol</span>
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
                    <Button
                      variant="ghost"
                      className="p-0 hover:bg-transparent"
                      onClick={() => handleSort("lastActive")}
                    >
                      <span>Última actividad</span>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedUsers.length > 0 ? (
                  sortedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.status === "active" ? "default" : user.status === "inactive" ? "secondary" : "outline"
                          }
                        >
                          {user.status === "active" ? "Activo" : user.status === "inactive" ? "Inactivo" : "Pendiente"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{user.lastActive}</span>
                        </div>
                      </TableCell>
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
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Editar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              <span>Enviar email</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Eliminar</span>
                            </DropdownMenuItem>
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

      <EditUserDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} user={selectedUser} />
    </>
  )
}
