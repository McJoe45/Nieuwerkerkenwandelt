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
          <div className="relative w-full max-w-3xl h-64 sm:h-80 md:h-96 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
            <Image
              src="/placeholder.svg?height=384&width=768"
              alt="Plaatsaanduiding voor wandelafbeelding"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-xl"
            />
          </div>
        </div>

        {/* Explanatory Text */}
        <div className="max-w-3xl mx-auto text-center text-sage text-lg leading-relaxed font-light">
          <p className="mb-4">
            Nieuwerkerken, met zijn diverse landschappen en charmante gehuchten, biedt een unieke wandelervaring voor iedereen. Of je nu op zoek bent naar een korte, ontspannende wandeling door het dorp of een langere tocht door uitgestrekte velden en bossen, je vindt hier altijd een route die bij je past.
          </p>
          <p className="mb-4">
            De wandelpaden zijn zorgvuldig uitgekozen om je de mooiste plekjes van de gemeente te laten ontdekken. Je wandelt langs historische bezienswaardigheden, door rustige natuurgebieden en langs pittoreske steegjes die je terug in de tijd voeren. Elk gehucht heeft zijn eigen karakter en verhaal, wat elke wandeling tot een nieuwe ontdekking maakt.
          </p>
          <p>
            Vergeet niet comfortabele schoenen aan te trekken en te genieten van de rust en de natuur die Nieuwerkerken te bieden heeft. We hopen dat je een onvergetelijke tijd zult hebben op onze wandelpaden!
          </p>
        </div>
      </main>
    </div>
  )
}
