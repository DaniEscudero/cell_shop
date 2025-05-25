import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Registro | CellShop",
  description: "Crea una cuenta en CellShop",
}

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
