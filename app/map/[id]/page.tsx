'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getRouteById } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Header from '@/components/header'

// Fix for default icon issue with Webpack
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface Route {
  id: string
  name: string
  coordinates: [number, number][] // [latitude, longitude]
}

export default function RouteMapPage({ params }: { params: { id: string } }) {
  const { id } = params
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<L.Map | null>(null)
  const polylineRef = useRef<L.Polyline | null>(null)
  const [route, setRoute] = useState<Route | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadRoute = async () => {
    setLoading(true)
    setError(null)
    try {
      const routeData = await getRouteById(id)
      if (routeData) {
        setRoute(routeData)
      } else {
        setError('Route niet gevonden.')
      }
    } catch (err) {
      console.error('Fout bij het laden van de route:', err)
      setError('Fout bij het laden van de route.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRoute()

    // Re-fetch data when the window gains focus
    window.addEventListener('focus', loadRoute)

    return () => {
      window.removeEventListener('focus', loadRoute)
    }
  }, [id])

  useEffect(() => {
    if (mapRef.current && !leafletMapRef.current) {
      leafletMapRef.current = L.map(mapRef.current).setView([50.93, 4.03], 13) // Default view for Nieuwerkerken

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(leafletMapRef.current)
    }

    if (leafletMapRef.current && route && route.coordinates && route.coordinates.length > 0) {
      const map = leafletMapRef.current

      // Remove existing polyline if any
      if (polylineRef.current) {
        map.removeLayer(polylineRef.current)
      }

      // Add new polyline
      const latlngs = route.coordinates.map(coord => [coord[0], coord[1]] as L.LatLngExpression)
      polylineRef.current = L.polyline(latlngs, { color: '#4CAF50', weight: 5 }).addTo(map)

      // Fit map to polyline bounds
      map.fitBounds(polylineRef.current.getBounds())

      // Add start and end markers
      L.marker(latlngs[0]).addTo(map).bindPopup('Startpunt').openPopup()
      L.marker(latlngs[latlngs.length - 1]).addTo(map).bindPopup('Eindpunt')

      // Invalidate map size to ensure it renders correctly
      map.invalidateSize()
    }
  }, [route]) // Depend on route to re-render map when route data changes

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-sage">Kaart laden...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <div className="text-center text-red-500">
            <p>{error}</p>
            <Link href="/" passHref>
              <Button className="mt-4 bg-sage hover:bg-sage-dark text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug naar overzicht
              </Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  if (!route) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <div className="text-center text-sage">
            <p>Geen routegegevens beschikbaar.</p>
            <Link href="/" passHref>
              <Button className="mt-4 bg-sage hover:bg-sage-dark text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug naar overzicht
              </Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-sage-dark title-font">Kaart van {route.name}</h1>
          <Link href={`/route/${route.id}`} passHref>
            <Button variant="outline" className="border-sage text-sage hover:bg-sage-light hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug naar Route
            </Button>
          </Link>
        </div>
        <div id="map" ref={mapRef} className="w-full h-[600px] rounded-lg shadow-lg border-2 border-beige" key={route.id}></div>
      </main>
    </div>
  )
}
