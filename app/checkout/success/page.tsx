"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle, Home, Package } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const [orderNumber, setOrderNumber] = useState("")

  // Generar un número de pedido aleatorio al cargar la página
  useEffect(() => {
    // Verificar si estamos en el cliente
    if (typeof window !== "undefined") {
      // Comprobar si venimos de la página de checkout
      const referrer = document.referrer
      if (!referrer.includes("/checkout")) {
        router.push("/")
        return
      }

      // Generar número de pedido
      setOrderNumber(
        `ORD-${Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, "0")}`,
      )
    }
  }, [router])

  if (!orderNumber) {
    return null // No mostrar nada mientras se verifica o redirige
  }

  return (
    <div className="container max-w-md py-16">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-2xl">¡Pedido completado!</CardTitle>
          <CardDescription>Tu pedido ha sido procesado correctamente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">Número de pedido</p>
            <p className="font-medium">{orderNumber}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Hemos enviado un correo electrónico con los detalles de tu compra. Recibirás actualizaciones sobre el estado
            de tu pedido.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Volver a la tienda
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/dashboard/pedidos">
              <Package className="mr-2 h-4 w-4" />
              Ver mis pedidos
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
