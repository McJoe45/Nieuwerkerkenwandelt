"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Plus, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import Header from "@/components/header"
import RouteMap from "@/components/route-map"
import { getRouteById, updateRoute, isAuthenticated, type Route } from "@/lib/auth"

export default function EditRoutePage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [coordinates, setCoordinates] = useState<[number, number][]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    distance: 0,
    duration: '',
    difficulty: '',
    muddy: false,
    gehuchten: [''],
    highlights: ['']
  })

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }

    const loadRoute = async () => {
      if (!params.id) return
      
      try {
        const route = await getRouteById(params.id as string)
        if (route) {
          setFormData({
            name: route.name,
            description: route.description,
            distance: route.distance,
            duration: route.duration,
            difficulty: route.difficulty,
            muddy: route.muddy,
            gehuchten: route.gehuchten && route.gehuchten.length > 0 ? route.gehuchten : [''],
            highlights: route.highlights && route.highlights.length > 0 ? route.highlights : ['']
          })
          setCoordinates(route.coordinates)
        } else {
          alert('Route niet gevonden')
          router.push('/')
        }
      } catch (error) {
        console.error('Error loading route:', error)
        alert('Fout bij het laden van de route')
        router.push('/')
      } finally {
        setInitialLoading(false)
      }
    }

    loadRoute()
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.description || coordinates.length < 2) {
      alert('Vul alle verplichte velden in en plaats minimaal 2 punten op de kaart.')
      return
    }

    setLoading(true)
    
    try {
      const routeData: Route = {
        id: params.id as string,
        name: formData.name,
        description: formData.description,
        distance: formData.distance,
        duration: formData.duration,
        difficulty: formData.difficulty,
        muddy: formData.muddy,
        gehuchten: formData.gehuchten.filter(g => g.trim() !== ''),
        highlights: formData.highlights.filter(h => h.trim() !== ''),
        coordinates: coordinates
      }

      const result = await updateRoute(routeData)
      
      if (result) {
        router.push(`/route/${params.id}`)
      } else {
        alert('Er is een fout opgetreden bij het bijwerken van de route.')
      }
    } catch (error) {
      console.error('Error updating route:', error)
      alert('Er is een fout opgetreden bij het bijwerken van de route.')
    } finally {
      setLoading(false)
    }
  }

  const addGehucht = () => {
    setFormData(prev => ({
      ...prev,
      gehuchten: [...prev.gehuchten, '']
    }))
  }

  const removeGehucht = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gehuchten: prev.gehuchten.filter((_, i) => i !== index)
    }))
  }

  const updateGehucht = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      gehuchten: prev.gehuchten.map((g, i) => i === index ? value : g)
    }))
  }

  const addHighlight = () => {
    setFormData(prev => ({
      ...prev,
      highlights: [...prev.highlights, '']
    }))
  }

  const removeHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }))
  }

  const updateHighlight = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.map((h, i) => i === index ? value : h)
    }))
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-sage-dark">Route wordt geladen...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/route/${params.id}`)}
            className="border-sage text-sage hover:bg-sage hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug naar route
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="bg-white border-sage-light">
            <CardHeader>
              <CardTitle className="text-sage-dark flex items-center gap-2 title-font">
                <MapPin className="w-5 h-5" />
                Route Bewerken
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Route Naam *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Bijv. Dendervallei Wandeling"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Beschrijving *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Beschrijf de route..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="distance">Afstand (km) *</Label>
                    <Input
                      id="distance"
                      type="number"
                      step="0.1"
                      value={formData.distance}
                      onChange={(e) => setFormData(prev => ({ ...prev, distance: parseFloat(e.target.value) || 0 }))}
                      placeholder="5.2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duur *</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="1u 15min"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="difficulty">Moeilijkheidsgraad *</Label>
                  <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer moeilijkheidsgraad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gemakkelijk">Gemakkelijk</SelectItem>
                      <SelectItem value="Matig">Matig</SelectItem>
                      <SelectItem value="Moeilijk">Moeilijk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="muddy"
                    checked={formData.muddy}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, muddy: checked as boolean }))}
                  />
                  <Label htmlFor="muddy">Modderig pad</Label>
                </div>

                <div>
                  <Label>Gehuchten</Label>
                  {formData.gehuchten.map((gehucht, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={gehucht}
                        onChange={(e) => updateGehucht(index, e.target.value)}
                        placeholder="Gehucht naam"
                      />
                      {formData.gehuchten.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeGehucht(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addGehucht}
                    className="mt-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Gehucht toevoegen
                  </Button>
                </div>

                <div>
                  <Label>Hoogtepunten</Label>
                  {formData.highlights.map((highlight, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={highlight}
                        onChange={(e) => updateHighlight(index, e.target.value)}
                        placeholder="Hoogtepunt beschrijving"
                      />
                      {formData.highlights.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeHighlight(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addHighlight}
                    className="mt-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Hoogtepunt toevoegen
                  </Button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-sage hover:bg-sage-light text-white"
                  disabled={loading}
                >
                  {loading ? 'Bijwerken...' : 'Route Bijwerken'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Map */}
          <Card className="bg-white border-sage-light">
            <CardHeader>
              <CardTitle className="text-sage-dark">Route Kaart</CardTitle>
              <p className="text-sm text-sage">Klik op de kaart om punten toe te voegen of te verplaatsen</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[600px]">
                <RouteMap 
                  coordinates={coordinates}
                  onCoordinatesChange={setCoordinates}
                  editable={true}
                  routeName={formData.name || 'Route bewerken'}
                  className="h-full w-full rounded-b-lg"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
