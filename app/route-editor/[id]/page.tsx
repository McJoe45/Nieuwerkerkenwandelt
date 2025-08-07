'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-draw'
import Header from '@/components/header'

// Fix for default icon issues with Webpack
delete (L.Icon.Default.prototype as any)._get='_getIconUrl';
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface RouteData {
  id?: string;
  name: string;
  description: string;
  distance: number;
  gehuchten: string[];
  geojson: any;
}

export default function RouteEditorPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params
  const isNewRoute = id === 'new'
  const [routeData, setRouteData] = useState<RouteData>({
    name: '',
    description: '',
    distance: 0,
    gehuchten: [],
    geojson: null,
  })
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const editableLayers = useRef<L.FeatureGroup | null>(null)
  const drawControl = useRef<L.Control.Draw | null>(null)
  const supabase = createClient()

  const calculateDistance = useCallback((geojson: any): number => {
    if (!geojson || !geojson.coordinates || geojson.coordinates.length < 2) {
      return 0
    }

    let totalDistance = 0
    for (let i = 0; i < geojson.coordinates.length - 1; i++) {
      const p1 = L.latLng(geojson.coordinates[i][1], geojson.coordinates[i][0])
      const p2 = L.latLng(geojson.coordinates[i + 1][1], geojson.coordinates[i + 1][0])
      totalDistance += p1.distanceTo(p2)
    }
    return totalDistance / 1000 // Convert meters to kilometers
  }, [])

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([50.93, 3.98], 13) // Centered around Nieuwerkerken

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.current)

      editableLayers.current = new L.FeatureGroup().addTo(mapInstance.current)

      drawControl.current = new L.Control.Draw({
        edit: {
          featureGroup: editableLayers.current,
          poly: {
            allowIntersection: false
          }
        },
        draw: {
          polygon: {
            allowIntersection: false,
            showArea: true
          },
          polyline: {
            metric: true
          },
          circle: false,
          rectangle: false,
          marker: false,
          circlemarker: false
        }
      })
      mapInstance.current.addControl(drawControl.current)

      mapInstance.current.on(L.Draw.Event.CREATED, (e: any) => {
        const layer = e.layer
        editableLayers.current?.addLayer(layer)
        const geojson = layer.toGeoJSON()
        const distance = calculateDistance(geojson.geometry)
        setRouteData(prev => ({ ...prev, geojson: geojson.geometry, distance }))
      })

      mapInstance.current.on(L.Draw.Event.EDITED, (e: any) => {
        e.layers.each((layer: any) => {
          const geojson = layer.toGeoJSON()
          const distance = calculateDistance(geojson.geometry)
          setRouteData(prev => ({ ...prev, geojson: geojson.geometry, distance }))
        })
      })

      mapInstance.current.on(L.Draw.Event.DELETED, () => {
        setRouteData(prev => ({ ...prev, geojson: null, distance: 0 }))
      })
    }

    if (!isNewRoute && mapInstance.current && editableLayers.current) {
      const fetchRoute = async () => {
        const { data, error } = await supabase.from('routes').select('*').eq('id', id).single()
        if (error) {
          console.error('Error fetching route:', error)
          // Handle error, maybe redirect or show a message
          return
        }
        if (data) {
          setRouteData({
            name: data.name,
            description: data.description || '',
            distance: data.distance || 0,
            gehuchten: data.gehuchten || [],
            geojson: data.geojson,
          })

          if (data.geojson) {
            editableLayers.current?.clearLayers()
            const layer = L.geoJSON(data.geojson)
            layer.eachLayer((l) => {
              editableLayers.current?.addLayer(l)
            })
            mapInstance.current?.fitBounds(editableLayers.current.getBounds())
          }
        }
      }
      fetchRoute()
    }
  }, [id, isNewRoute, calculateDistance])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setRouteData(prev => ({ ...prev, [name]: value }))
  }

  const handleGehuchtenChange = (value: string) => {
    setRouteData(prev => ({ ...prev, gehuchten: value ? value.split(',').map(g => g.trim()) : [] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!routeData.geojson) {
      alert('Please draw a route on the map.')
      return
    }

    if (isNewRoute) {
      const { data, error } = await supabase.from('routes').insert([routeData]).select()
      if (error) {
        console.error('Error creating route:', error)
        alert('Fout bij het aanmaken van de route.')
      } else {
        alert('Route succesvol aangemaakt!')
        router.push(`/route/${data[0].id}`)
      }
    } else {
      const { data, error } = await supabase.from('routes').update(routeData).eq('id', id).select()
      if (error) {
        console.error('Error updating route:', error)
        alert('Fout bij het bijwerken van de route.')
      } else {
        alert('Route succesvol bijgewerkt!')
        router.push(`/route/${data[0].id}`)
      }
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-sage-dark mb-8">
          {isNewRoute ? 'Nieuwe Route Maken' : `Route Bewerken: ${routeData.name}`}
        </h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-2 border-beige bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-sage-dark">Route Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sage">Naam</Label>
                <Input
                  id="name"
                  name="name"
                  value={routeData.name}
                  onChange={handleChange}
                  required
                  className="border-beige text-sage-dark focus:border-sage focus:ring-sage"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-sage">Beschrijving</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={routeData.description}
                  onChange={handleChange}
                  rows={4}
                  className="border-beige text-sage-dark focus:border-sage focus:ring-sage"
                />
              </div>
              <div>
                <Label htmlFor="distance" className="text-sage">Afstand (km)</Label>
                <Input
                  id="distance"
                  name="distance"
                  type="number"
                  value={routeData.distance.toFixed(2)}
                  readOnly
                  className="border-beige text-sage-dark bg-gray-50 cursor-not-allowed"
                />
              </div>
              <div>
                <Label htmlFor="gehuchten" className="text-sage">Gehuchten (komma-gescheiden)</Label>
                <Input
                  id="gehuchten"
                  name="gehuchten"
                  value={routeData.gehuchten.join(', ')}
                  onChange={(e) => handleGehuchtenChange(e.target.value)}
                  className="border-beige text-sage-dark focus:border-sage focus:ring-sage"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-beige bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-sage-dark">Route Tekenen</CardTitle>
            </CardHeader>
            <CardContent>
              <div id="map" ref={mapRef} className="w-full h-[400px] rounded-md border border-beige"></div>
              <p className="text-sm text-gray-500 mt-2">
                Gebruik de tekentools op de kaart om de route te tekenen of te bewerken.
              </p>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 flex justify-end">
            <Button type="submit" className="bg-sage hover:bg-sage-dark text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-300 text-base">
              {isNewRoute ? 'Route Aanmaken' : 'Route Opslaan'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
