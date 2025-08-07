import { ArrowLeft } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"

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
          <div className="relative w-full max-w-4xl h-96 bg-sage-light/20 rounded-xl border-2 border-beige flex items-center justify-center">
            <p className="text-sage text-lg font-light">Foto wordt hier toegevoegd</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <div className="text-center space-y-6">
              <p className="text-lg text-sage leading-relaxed font-light">
                Nieuwerkerken biedt wandelaars een unieke ervaring door zijn diverse landschappen, 
                van glooiende heuvels tot vredige valleien, doorsneden door historische paden en moderne wandelroutes.
              </p>
              
              <p className="text-lg text-sage leading-relaxed font-light">
                Onze gemeente herbergt 15 verschillende gehuchten, elk met hun eigen karakter en charme. 
                De wandelroutes verbinden deze gemeenschappen en tonen de rijke geschiedenis en natuurlijke schoonheid van onze streek.
              </p>
              
              <p className="text-lg text-sage leading-relaxed font-light">
                Of je nu een ervaren wandelaar bent of gewoon op zoek bent naar een ontspannende wandeling, 
                Nieuwerkerken heeft voor iedereen iets te bieden. Van korte gezinsvriendelijke routes tot uitdagende tochten 
                door onze mooiste natuurgebieden.
              </p>
              
              <p className="text-lg text-sage leading-relaxed font-light">
                Alle routes zijn zorgvuldig samengesteld door lokale wandelaars die de streek door en door kennen. 
                Ze leiden je langs de mooiste plekken, verborgen pareltjes en historische bezienswaardigheden 
                die Nieuwerkerken zo bijzonder maken.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
