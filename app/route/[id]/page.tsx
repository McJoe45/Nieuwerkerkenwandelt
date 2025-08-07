'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/header'
import Link from 'next/link'
import { ArrowLeft, MapPin, Ruler, Edit } from 'lucide-react'

// Fix for default icon issues with Webpack
delete (L.Icon.Default.prototype as any)._get='_getIconUrl';
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface RouteData {
  id: string;
  name: string;
  description: string;
  distance: number;
  gehuchten: string[];
  geojson: any;
}

export default function RouteDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params
  const [route, setRoute] = useState<RouteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const routeLayer = useRef<L.GeoJSON | null>(null)
  const supabase = createClient()

  const fetchRoute = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: fetchError } = await supabase.from('routes').select('*').eq('id', id).single()

    if (fetchError) {
      console.error('Error fetching route:', fetchError)
      setError('Fout bij het laden van de route.')
      setLoading(false)
      return
    }

    if (data) {
      setRoute(data)
      setLoading(false)

      if (mapInstance.current && data.geojson) {
        if (routeLayer.current) {
          mapInstance.current.removeLayer(routeLayer.current)
        }
        routeLayer.current = L.geoJSON(data.geojson, {
          style: {
            color: '#6B8E23', // Sage green
            weight: 5,
            opacity: 0.7
          }
        }).addTo(mapInstance.current)

        mapInstance.current.fitBounds(routeLayer.current.getBounds(), { padding: [50, 50] })
      }
    } else {
      setError('Route niet gevonden.')
      setLoading(false)
    }
  }, [id, supabase])

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([50.93, 3.98], 13) // Centered around Nieuwerkerken

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.current)
    }

    fetchRoute()

    // Re-fetch when window gains focus (for real-time updates)
    const handleFocus = () => fetchRoute()
    window.addEventListener('focus', handleFocus)

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
      window.removeEventListener('focus', handleFocus)
    }
  }, [fetchRoute])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-sage-dark text-xl">Route laden...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6">
        <p className="text-red-500 text-xl mb-4">{error}</p>
        <Link href="/">
          <Button className="bg-sage hover:bg-sage-dark text-white">Terug naar overzicht</Button>
        </Link>
      </div>
    )
  }

  if (!route) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6">
        <p className="text-sage-dark text-xl mb-4">Geen routegegevens beschikbaar.</p>
        <Link href="/">
          <Button className="bg-sage hover:bg-sage-dark text-white">Terug naar overzicht</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <div className="mb-8 flex justify-between items-center">
          <Link href="/">
            <Button variant="outline" className="border-sage-light text-sage hover:bg-sage-light hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug naar overzicht
            </Button>
          </Link>
          <Link href={`/edit-route/${route.id}`}>
            <Button className="bg-sage hover:bg-sage-dark text-white">
              <Edit className="w-4 h-4 mr-2" />
              Route Bewerken
            </Button>
          </Link>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-sage-dark mb-6 tracking-wide leading-tight title-font">
          {route.name}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-2 border-beige bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-sage-dark">Route Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sage">
              <p className="text-lg leading-relaxed font-light">{route.description}</p>
              <div className="flex items-center text-base">
                <Ruler className="w-5 h-5 mr-2 text-sage-light" />
                <span>Afstand: {route.distance ? `${route.distance.toFixed(2)} km` : 'N/A km'}</span>
              </div>
              {route.gehuchten && route.gehuchten.length > 0 && (
                <div className="flex items-center text-base">
                  <MapPin className="w-5 h-5 mr-2 text-sage-light" />
                  <span>Gehuchten: {route.gehuchten.join(', ')}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-beige bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-sage-dark">Route Kaart</CardTitle>
            </CardHeader>
            <CardContent>
              <div id="map" ref={mapRef} className="w-full h-[400px] rounded-md border border-beige" key={route.id}></div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
