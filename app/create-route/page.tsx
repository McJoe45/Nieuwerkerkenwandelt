'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase'
import Header from '@/components/header'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Fix for default Leaflet icon issue with Webpack
delete (L.Icon.Default.prototype as any)._get='iconUrl';
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

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

export default function CreateRoutePage() {
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [distance, setDistance] = useState(0)
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }[]>([])
  const [saving, setSaving] = useState(false)

  const calculateDistance = useCallback((coords: { lat: number; lng: number }[]) => {
    let totalDistance = 0
    for (let i = 0; i < coords.length - 1; i++) {
      const p1 = L.latLng(coords[i].lat, coords[i].lng)
      const p2 = L.latLng(coords[i + 1].lat, coords[i + 1].lng)
      totalDistance += p1.distanceTo(p2)
    }
    return totalDistance / 1000 // Convert meters to kilometers
  }, [])

  const handleMapClick = useCallback((e: L.LeafletMouseEvent) => {
    const newCoordinates = [...coordinates, e.latlng]
    setCoordinates(newCoordinates)
    setDistance(calculateDistance(newCoordinates))
  }, [coordinates, calculateDistance])

  const handleSave = async () => {
    setSaving(true)
    const { data, error } = await supabase
      .from('routes')
      .insert([{ name, description, distance, coordinates }])
      .select()

    if (error) {
      console.error('Error saving route:', error)
      alert('Fout bij het opslaan van de route.')
    } else {
      alert('Route succesvol opgeslagen!')
      router.push(`/route/${data[0].id}`) // Navigate to the new route's detail page
    }
    setSaving(false)
  }

  const polylinePath = coordinates.map(coord => [coord.lat, coord.lng]) as L.LatLngExpression[]
  const mapCenter: L.LatLngExpression = coordinates.length > 0 ? coordinates[0] : [50.93, 3.98] // Default to Nieuwerkerken if no coords

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-1">
          <Card className="bg-white shadow-lg border-2 border-beige h-full flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Link href="/admin">
                  <Button variant="outline" className="border-sage-light text-sage hover:bg-sage-light hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Terug naar Admin
                  </Button>
                </Link>
                <CardTitle className="text-sage-dark text-2xl">Nieuwe Route Aanmaken</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-6">
              <div>
                <Label htmlFor="name" className="text-sage-dark">Naam</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 border-beige focus:border-sage-light focus:ring-sage-light text-sage-dark"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-sage-dark">Beschrijving</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="mt-1 border-beige focus:border-sage-light focus:ring-sage-light text-sage-dark"
                />
              </div>
              <div>
                <Label htmlFor="distance" className="text-sage-dark">Afstand (km)</Label>
                <Input
                  id="distance"
                  type="number"
                  value={distance.toFixed(2)}
                  readOnly
                  className="mt-1 border-beige bg-gray-50 text-sage-dark"
                />
              </div>
              <div className="flex-1 flex items-end justify-end">
                <Button
                  onClick={handleSave}
                  disabled={saving || !name || coordinates.length < 2}
                  className="bg-sage hover:bg-sage-dark text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-300 text-base"
                >
                  {saving ? 'Opslaan...' : 'Route Aanmaken'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-white shadow-lg border-2 border-beige h-full">
            <CardHeader>
              <CardTitle className="text-sage-dark text-2xl">Kaart Tekenen</CardTitle>
            </CardHeader>
            <CardContent className="h-[500px] w-full">
              <MapContainer
                center={mapCenter}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full rounded-lg shadow-inner"
                whenCreated={map => {
                  map.on('click', handleMapClick);
                }}
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
              <p className="text-sage text-sm mt-4">Klik op de kaart om punten toe te voegen. De afstand wordt automatisch berekend.</p>
              <Button
                onClick={() => {
                  setCoordinates([]);
                  setDistance(0);
                }}
                variant="destructive"
                className="mt-4"
              >
                Wis alle punten
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
