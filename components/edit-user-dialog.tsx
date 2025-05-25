"use client"

import type React from "react"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface User {
  id: string
  name: string
  email: string
  status: string
  role: string
  lastActive: string
}

interface EditUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
}

const roles = [
  { label: "Usuario", value: "Usuario" },
  { label: "Admin", value: "Admin" },
]

const statuses = [
  { label: "Activo", value: "active" },
  { label: "Inactivo", value: "inactive" },
  { label: "Pendiente", value: "pending" },
]

export function EditUserDialog({ open, onOpenChange, user }: EditUserDialogProps) {
  const [formData, setFormData] = useState<Partial<User>>(user || {})
  const [openRoleCombobox, setOpenRoleCombobox] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleStatusChange = (value: string) => {
    setFormData({
      ...formData,
      status: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // En un caso real, aquí enviaríamos los datos al servidor
    console.log("Usuario actualizado:", formData)
    onOpenChange(false)
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>
              Modifica los detalles del usuario. Haz clic en guardar cuando hayas terminado.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="id" className="text-right">
                ID
              </Label>
              <Input
                id="id"
                name="id"
                value={formData.id || ""}
                onChange={handleChange}
                className="col-span-3"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input id="name" name="name" value={formData.name || ""} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Rol
              </Label>
              <div className="col-span-3">
                <Popover open={openRoleCombobox} onOpenChange={setOpenRoleCombobox}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openRoleCombobox}
                      className="w-full justify-between"
                    >
                      {formData.role || "Seleccionar rol..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Buscar rol..." />
                      <CommandList>
                        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                        <CommandGroup>
                          {roles.map((role) => (
                            <CommandItem
                              key={role.value}
                              value={role.value}
                              onSelect={(currentValue) => {
                                setFormData({
                                  ...formData,
                                  role: currentValue,
                                })
                                setOpenRoleCombobox(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.role === role.value ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {role.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Estado</Label>
              <div className="col-span-3">
                <RadioGroup
                  value={formData.status || ""}
                  onValueChange={handleStatusChange}
                  className="flex flex-col space-y-1"
                >
                  {statuses.map((status) => (
                    <div key={status.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={status.value} id={`status-${status.value}`} />
                      <Label htmlFor={`status-${status.value}`} className="font-normal">
                        {status.label}
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
