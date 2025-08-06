"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import dynamic from "next/dynamic"
import { getRouteById, type Route } from "@/lib/auth"

const RouteMap = dynamic(() => import("@/components/route-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage mx-auto mb-4"></div>
        <p className="text-sage">Kaart laden...</p>
      </div>
    </div>
  ),
})

export default function FullscreenMapPage() {
  const params = useParams()
  const [route, setRoute] = useState<Route | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadRoute() {
      if (!params.id || typeof params.id !== 'string') {
        setError('Ongeldige route ID')
        setLoading(false)
        return
      }

      try {
        const routeData = await getRouteById(params.id)
        if (routeData) {
          setRoute(routeData)
        } else {
          setError('Route niet gevonden')
        }
      } catch (error) {
        console.error('Error loading route:', error)
        setError('Fout bij het laden van de route')
      } finally {
        setLoading(false)
      }
    }

    loadRoute()
  }, [params.id])

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage mx-auto mb-4"></div>
          <p className="text-sage">Route laden...</p>
        </div>
      </div>
    )
  }

  if (error || !route) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Route niet gevonden'}</p>
          <button 
            onClick={() => window.close()} 
            className="px-4 py-2 bg-sage text-white rounded hover:bg-sage-dark"
          >
            Sluiten
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen">
      <RouteMap 
        coordinates={route.coordinates || []} 
        routeName={route.name}
        className="w-full h-full"
      />
    </div>
  )
}
