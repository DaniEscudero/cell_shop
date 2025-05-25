import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Iniciar sesión | CellShop",
  description: "Inicia sesión en tu cuenta de CellShop",
}

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
