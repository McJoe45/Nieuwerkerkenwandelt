"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import RouteMap from "@/components/route-map"
import { getRouteById, type Route } from "@/lib/auth"

export default function FullscreenMapPage() {
  const params = useParams()
  const [route, setRoute] = useState<Route | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRoute() {
      if (params.id) {
        try {
          const routeData = await getRouteById(params.id as string)
          setRoute(routeData)
        } catch (error) {
          console.error('Error loading route:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    loadRoute()
  }, [params.id])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-cream">
        <p className="text-sage-dark text-xl">Kaart wordt geladen...</p>
      </div>
    )
  }

  if (!route) {
    return (
      <div className="h-screen flex items-center justify-center bg-cream">
        <p className="text-sage-dark text-xl">Route niet gevonden</p>
      </div>
    )
  }

  return (
    <div className="h-screen">
      <RouteMap 
        coordinates={route.coordinates} 
        routeName={route.name}
        className="w-full h-full"
      />
    </div>
  )
}
