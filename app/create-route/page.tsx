"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, MapPin, Plus, X } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/header"
import { addRoute, isAuthenticated } from "@/lib/auth"

export default function CreateRoutePage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    gehuchten: [""],
    distance: "",
    muddy: false,
    description: "",
    difficulty: "",
    duration: "",
    highlights: [""],
  })

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
    } else {
      setIsLoggedIn(true)
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const route = {
        name: formData.name,
        gehuchten: formData.gehuchten.filter((g) => g.trim() !== ""),
        distance: Number.parseFloat(formData.distance),
        muddy: formData.muddy,
        description: formData.description,
        difficulty: formData.difficulty,
        duration: formData.duration,
        highlights: formData.highlights.filter((h) => h.trim() !== ""),
        coordinates: [
          [50.9167, 4.0333],
          [50.92, 4.04],
        ] as [number, number][], // Default coordinates for Nieuwerkerken
      }

      const result = await addRoute(route)
      
      if (result) {
        router.push("/")
      } else {
        alert("Er is een fout opgetreden bij het opslaan van de route.")
      }
    } catch (error) {
      console.error('Error creating route:', error)
      alert("Er is een fout opgetreden bij het opslaan van de route.")
    } finally {
      setLoading(false)
    }
  }

  const addGehucht = () => {
    setFormData((prev) => ({
      ...prev,
      gehuchten: [...prev.gehuchten, ""],
    }))
  }

  const removeGehucht = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gehuchten: prev.gehuchten.filter((_, i) => i !== index),
    }))
  }

  const updateGehucht = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      gehuchten: prev.gehuchten.map((g, i) => (i === index ? value : g)),
    }))
  }

  const addHighlight = () => {
    setFormData((prev) => ({
      ...prev,
      highlights: [...prev.highlights, ""],
    }))
  }

  const removeHighlight = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }))
  }

  const updateHighlight = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.map((h, i) => (i === index ? value : h)),
    }))
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button
              variant="outline"
              className="border-sage-light text-sage-dark hover:bg-sage-lightest bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug naar overzicht
            </Button>
          </Link>
        </div>

        <Card className="max-w-2xl mx-auto border-beige bg-white">
          <CardHeader>
            <CardTitle className="text-2xl text-sage-dark flex items-center gap-2 title-font">
              <MapPin className="w-6 h-6" />
              Nieuwe Wandelroute Aanmaken
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sage-dark title-font">
                  Naam van de route *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  className="border-beige focus:border-sage-light focus:ring-sage-light/20"
                  placeholder="Bijv. Bospad langs de Dender"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sage-dark title-font">Gehuchten *</Label>
                {formData.gehuchten.map((gehucht, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={gehucht}
                      onChange={(e) => updateGehucht(index, e.target.value)}
                      className="border-beige focus:border-sage-light focus:ring-sage-light/20"
                      placeholder="Bijv. Centrum, Bosstraat, ..."
                    />
                    {formData.gehuchten.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeGehucht(index)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addGehucht}
                  className="border-sage-light text-sage-dark hover:bg-sage-lightest bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Gehucht toevoegen
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="distance" className="text-sage-dark title-font">
                    Afstand (km) *
                  </Label>
                  <Input
                    id="distance"
                    type="number"
                    step="0.1"
                    value={formData.distance}
                    onChange={(e) => setFormData((prev) => ({ ...prev, distance: e.target.value }))}
                    required
                    className="border-beige focus:border-sage-light focus:ring-sage-light/20"
                    placeholder="5.2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-sage-dark title-font">
                    Geschatte duur
                  </Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                    className="border-beige focus:border-sage-light focus:ring-sage-light/20"
                    placeholder="1u 30min"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty" className="text-sage-dark title-font">
                  Moeilijkheidsgraad
                </Label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, difficulty: value }))}>
                  <SelectTrigger className="border-beige focus:border-sage-light focus:ring-sage-light/20">
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
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, muddy: checked as boolean }))}
                />
                <Label htmlFor="muddy" className="text-sage-dark title-font">
                  Deze route bevat modderige paden
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sage-dark title-font">
                  Beschrijving *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  required
                  className="border-beige focus:border-sage-light focus:ring-sage-light/20 min-h-[100px]"
                  placeholder="Beschrijf de route, wat je onderweg kunt zien, bijzonderheden..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sage-dark title-font">Hoogtepunten</Label>
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={highlight}
                      onChange={(e) => updateHighlight(index, e.target.value)}
                      className="border-beige focus:border-sage-light focus:ring-sage-light/20"
                      placeholder="Bijv. Mooie kerk, historische molen, ..."
                    />
                    {formData.highlights.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeHighlight(index)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addHighlight}
                  className="border-sage-light text-sage-dark hover:bg-sage-lightest bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Hoogtepunt toevoegen
                </Button>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-sage-light hover:bg-sage-lighter text-white title-font"
                  disabled={loading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Bezig met opslaan..." : "Route Opslaan"}
                </Button>
                <Link href="/" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                    disabled={loading}
                  >
                    Annuleren
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
