'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { addRoute, isAuthenticated } from '@/lib/supabase'
import Header from '@/components/header'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface RouteFormData {
  name: string
  gehuchten: string
  distance: number
  muddy: boolean
  description: string
  coordinates: [number, number][]
  difficulty: string
  duration: string
  highlights: string
}

export default function CreateRoutePage() {
  const router = useRouter()
  const [formData, setFormData] = useState<RouteFormData>({
    name: '',
    gehuchten: '',
    distance: 0,
    muddy: false,
    description: '',
    coordinates: [],
    difficulty: 'Gemakkelijk',
    duration: '',
    highlights: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  if (typeof window !== 'undefined' && !isAuthenticated()) {
    router.push('/login')
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type, checked } = e.target as HTMLInputElement
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSelectChange = (id: keyof RouteFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const newRoute = {
        name: formData.name,
        gehuchten: formData.gehuchten.split(',').map((g) => g.trim()).filter(Boolean),
        distance: parseFloat(formData.distance.toString()),
        muddy: formData.muddy,
        description: formData.description,
        coordinates: formData.coordinates, // Assuming coordinates are handled elsewhere or are empty for now
        difficulty: formData.difficulty,
        duration: formData.duration,
        highlights: formData.highlights.split(',').map((h) => h.trim()).filter(Boolean),
      }

      const result = await addRoute(newRoute)

      if (result) {
        setSuccess('Route succesvol aangemaakt!')
        setFormData({
          name: '',
          gehuchten: '',
          distance: 0,
          muddy: false,
          description: '',
          coordinates: [],
          difficulty: 'Gemakkelijk',
          duration: '',
          highlights: '',
        })
        router.push('/admin') // Redirect to admin page after successful creation
      } else {
        setError('Fout bij het aanmaken van de route. Probeer opnieuw.')
      }
    } catch (err) {
      console.error('Error creating route:', err)
      setError('Er is een onverwachte fout opgetreden.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-sage-dark title-font">Nieuwe Route Aanmaken</h1>
          <Link href="/admin" passHref>
            <Button variant="outline" className="border-sage text-sage hover:bg-sage-light hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug naar Admin
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="name" className="text-sage-dark">Naam Route</Label>
              <Input id="name" value={formData.name} onChange={handleChange} required className="border-beige focus:border-sage" />
            </div>
            <div>
              <Label htmlFor="distance" className="text-sage-dark">Afstand (km)</Label>
              <Input id="distance" type="number" step="0.1" value={formData.distance} onChange={handleChange} required className="border-beige focus:border-sage" />
            </div>
          </div>

          <div className="mb-6">
            <Label htmlFor="gehuchten" className="text-sage-dark">Gehuchten (komma-gescheiden)</Label>
            <Input id="gehuchten" value={formData.gehuchten} onChange={handleChange} placeholder="bv. Dorp, Laar, Bremt" className="border-beige focus:border-sage" />
          </div>

          <div className="mb-6">
            <Label htmlFor="description" className="text-sage-dark">Beschrijving</Label>
            <Textarea id="description" value={formData.description} onChange={handleChange} rows={5} required className="border-beige focus:border-sage" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="difficulty" className="text-sage-dark">Moeilijkheidsgraad</Label>
              <Select value={formData.difficulty} onValueChange={(value) => handleSelectChange('difficulty', value)}>
                <SelectTrigger className="w-full border-beige focus:border-sage">
                  <SelectValue placeholder="Selecteer moeilijkheidsgraad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gemakkelijk">Gemakkelijk</SelectItem>
                  <SelectItem value="Matig">Matig</SelectItem>
                  <SelectItem value="Moeilijk">Moeilijk</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duration" className="text-sage-dark">Duur (bv. 1u 30min)</Label>
              <Input id="duration" value={formData.duration} onChange={handleChange} className="border-beige focus:border-sage" />
            </div>
          </div>

          <div className="mb-6">
            <Label htmlFor="highlights" className="text-sage-dark">Highlights (komma-gescheiden)</Label>
            <Input id="highlights" value={formData.highlights} onChange={handleChange} placeholder="bv. Kapel, Bos, Rivier" className="border-beige focus:border-sage" />
          </div>

          <div className="flex items-center space-x-2 mb-8">
            <Checkbox id="muddy" checked={formData.muddy} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, muddy: checked as boolean }))} />
            <Label htmlFor="muddy" className="text-sage-dark">Modderpaden aanwezig</Label>
          </div>

          <Button type="submit" className="w-full bg-sage hover:bg-sage-dark text-white" disabled={loading}>
            {loading ? 'Aanmaken...' : 'Route Aanmaken'}
          </Button>
        </form>
      </main>
    </div>
  )
}
