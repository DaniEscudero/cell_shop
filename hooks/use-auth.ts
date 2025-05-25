"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type UserRole = "user" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

// Usuarios de ejemplo para simular la autenticación
const mockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin" as UserRole,
  },
  {
    id: "2",
    name: "Regular User",
    email: "user@example.com",
    password: "user123",
    role: "user" as UserRole,
  },
]

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })

        try {
          // Simular una llamada a la API con un pequeño retraso
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Buscar el usuario en nuestros datos de ejemplo
          const user = mockUsers.find((user) => user.email === email && user.password === password)

          if (!user) {
            throw new Error("Credenciales incorrectas")
          }

          // Omitir la contraseña del objeto de usuario
          const { password: _, ...userWithoutPassword } = user

          set({
            user: userWithoutPassword,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Error al iniciar sesión",
            isLoading: false,
          })
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null })

        try {
          // Simular una llamada a la API con un pequeño retraso
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Verificar si el email ya está en uso
          const existingUser = mockUsers.find((user) => user.email === email)
          if (existingUser) {
            throw new Error("El email ya está registrado")
          }

          // En un sistema real, aquí crearíamos el usuario en la base de datos
          // Para este ejemplo, simplemente simulamos un registro exitoso
          const newUser = {
            id: `${mockUsers.length + 1}`,
            name,
            email,
            role: "user" as UserRole,
          }

          set({
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Error al registrarse",
            isLoading: false,
          })
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        })
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: "auth-storage", // nombre para localStorage
    },
  ),
)
