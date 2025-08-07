'use client'

import { useState, useEffect, useCallback } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/header'
import Link from 'next/link'
import { ArrowLeft, Ruler, Pencil } from 'lucide-react'
import { createClient } from '@/lib/supabase'

// Fix for default Leaflet icon issue with Webpack
delete (L.Icon.Default.prototype as any)._get='iconUrl';
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface Route {
  id: string
  name: string
  description: string
  distance: number
  coordinates: { lat: number; lng: number }[]
  created_at: string
}

interface MapUpdaterProps {
  center: L.LatLngExpression
  zoom: number
  polyline: L.LatLngExpression[]
}

function MapUpdater({ center, zoom, polyline }: MapUpdaterProps) {
  const map = useMap()

  useEffect(() => {
    if (center) {
      map.setView(center, zoom)
    }
    if (polyline && polyline.length > 0) {
      const bounds = L.latLngBounds(polyline)
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [map, center, zoom, polyline])

  return null
}

export default function RouteDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [route, setRoute] = useState<Route | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchRoute = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching route:', error)
      setRoute(null)
    } else if (data) {
      setRoute(data)
    }
    setLoading(false)
  }, [id, supabase])

  useEffect(() => {
    fetchRoute()

    // Re-fetch when window gains focus (e.g., returning from another tab)
    const handleFocus = () => {
      fetchRoute()
    }
    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [fetchRoute])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="text-sage-dark">Laden...</p>
      </div>
    )
  }

  if (!route) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream p-6">
        <Header />
        <Card className="w-full max-w-md bg-white shadow-lg border-2 border-beige">
          <CardHeader>
            <CardTitle className="text-sage-dark text-2xl">Route niet gevonden</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sage mb-4">De gevraagde route kon niet worden geladen.</p>
            <Link href="/">
              <Button className="bg-sage hover:bg-sage-dark text-white">Terug naar overzicht</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const polylinePath = route.coordinates ? route.coordinates.map(coord => [coord.lat, coord.lng]) as L.LatLngExpression[] : []
  const mapCenter: L.LatLngExpression = polylinePath.length > 0 ? polylinePath[0] : [50.93, 3.98] // Default to Nieuwerkerken if no coords

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-1">
          <Card className="bg-white shadow-lg border-2 border-beige h-full flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Link href="/">
                  <Button variant="outline" className="border-sage-light text-sage hover:bg-sage-light hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Terug naar overzicht
                  </Button>
                </Link>
                <Link href={`/route-editor/${route.id}`}>
                  <Button className="bg-sage hover:bg-sage-dark text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300 text-sm">
                    <Pencil className="w-4 h-4 mr-2" />
                    Bewerken
                  </Button>
                </Link>
              </div>
              <CardTitle className="text-sage-dark text-3xl mb-2 title-font">{route.name}</CardTitle>
              <div className="flex items-center text-sage-dark text-base font-medium">
                <Ruler className="w-4 h-4 mr-2 text-sage-light" />
                <span>{route.distance ? `${route.distance.toFixed(2)} km` : 'N/A km'}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <p className="text-sage text-base leading-relaxed font-light mb-6 flex-1">
                {route.description}
              </p>
              <div className="text-sm text-gray-500 mt-auto">
                Aangemaakt op: {new Date(route.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-white shadow-lg border-2 border-beige h-full">
            <CardHeader>
              <CardTitle className="text-sage-dark text-2xl">Route Kaart</CardTitle>
            </CardHeader>
            <CardContent className="h-[500px] w-full">
              <MapContainer
                center={mapCenter}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full rounded-lg shadow-inner"
                key={route.id} // Force re-render map when route changes
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {polylinePath.length > 0 && (
                  <>
                    <Polyline positions={polylinePath} color="#6B8E23" weight={5} />
                    {polylinePath.map((pos, index) => (
                      <Marker key={index} position={pos} />
                    ))}
                  </>
                )}
                <MapUpdater center={mapCenter} zoom={13} polyline={polylinePath} />
              </MapContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
