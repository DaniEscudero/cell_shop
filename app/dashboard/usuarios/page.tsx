import { UsersTable } from "@/components/dashboard/users-table"

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
        <p className="text-muted-foreground">Gestiona los usuarios de la plataforma.</p>
      </div>

      <UsersTable />
    </div>
  )
}
