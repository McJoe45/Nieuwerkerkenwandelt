import { ArrowLeft } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Image from "next/image"

export default function OverWandelenPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="container mx-auto px-6 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="border-sage-light text-sage hover:bg-sage-light hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug naar overzicht
            </Button>
          </Link>
        </div>

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-sage-dark mb-6 tracking-wide leading-tight title-font">
            Over wandelen
            <br />
            <span className="bg-gradient-to-r from-sage-light to-sage-lighter bg-clip-text text-transparent">
              in Nieuwerkerken
            </span>
          </h1>
        </div>

        {/* Placeholder Image */}
        <div className="mb-16 flex justify-center">
          <div className="relative w-full max-w-3xl h-64 sm:h-80 md:h-96 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-lg">
            <Image
              src="/placeholder.svg?height=384&width=768"
              alt="Placeholder afbeelding voor wandelen in Nieuwerkerken"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-xl"
            />
          </div>
        </div>

        {/* Explanatory Text */}
        <div className="max-w-3xl mx-auto text-center text-sage text-lg leading-relaxed font-light">
          <p className="mb-4">
            Nieuwerkerken biedt een schat aan wandelmogelijkheden voor jong en oud. Van rustige veldwegen tot avontuurlijke bospaden, er is voor ieder wat wils. De diverse landschappen, van open kouters tot verborgen steegjes, maken elke wandeling uniek.
          </p>
          <p className="mb-4">
            Ontdek de rijke geschiedenis van onze gehuchten, geniet van de lokale flora en fauna, en laat je verrassen door de verborgen pareltjes die Nieuwerkerken te bieden heeft. Of je nu op zoek bent naar een korte ommetje of een uitdagende dagtocht, hier vind je de perfecte route.
          </p>
          <p>
            Vergeet niet comfortabele schoenen aan te trekken en te genieten van de frisse lucht en de prachtige omgeving. Veel wandelplezier!
          </p>
        </div>
      </main>
    </div>
  )
}
