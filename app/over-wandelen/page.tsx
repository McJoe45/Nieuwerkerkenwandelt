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

        {/* Photo Placeholder */}
        <div className="mb-16 flex justify-center">
          <div className="relative w-full max-w-4xl">
            <div className="w-full h-96 bg-sage-light/20 rounded-xl border-2 border-beige flex items-center justify-center">
              <p className="text-sage text-lg">Foto wordt nog toegevoegd</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg mx-auto text-center">
            <div className="text-sage leading-relaxed space-y-6">
              <p className="text-xl font-light">
                Nieuwerkerken biedt een unieke wandelervaring door zijn diverse landschap van gehuchten, 
                groene paden en historische plekken.
              </p>
              
              <p>
                Of je nu kiest voor een korte wandeling door het dorpscentrum of een langere tocht 
                door de natuurgebieden, elke route toont je een ander gezicht van onze gemeente.
              </p>
              
              <p>
                De wandelpaden verbinden niet alleen plaatsen, maar ook verhalen. Van de stilte 
                van de Kraaiwinkel tot de levendigheid van het dorpsplein, van de geschiedenis 
                van kasteel Regelsbrugge tot de moderne windmolen in Hoezekouter.
              </p>
              
              <p>
                Neem de tijd om te genieten van wat Nieuwerkerken te bieden heeft. 
                Elke stap is een ontdekking.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
