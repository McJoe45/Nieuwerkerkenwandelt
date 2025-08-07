import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/header'
import { ArrowLeft } from 'lucide-react'

const gehuchtenData = [
  {
    id: 1,
    name: 'Rijdent',
    description: 'Wie via de Rijdentstraat richting Edixvelde wandelt, steekt eerst de spoorlijn Oostende-Brussel over via een kleine brug. Daar, te midden van het groen, bevind je je in het hart van Rijdent. Tussen de boomkruinen door duikt in de verte nog net de stompe toren van de dorpskerk op.',
    image: '/images/gehuchten/placeholder-landmark.jpg', // Placeholder
  },
  {
    id: 2,
    name: 'Siesegemkouter',
    description: 'Een open vlakte, badend in rust. Al jaren lonkt de stad naar deze plek om te bouwen, maar wie van de Keizerstraat doorsteekt naar Aalst, begrijpt meteen wat hier echt thuishoort: stilte, groen en lucht. De Siesegemkouter is geen niemandsland, maar ieders landschap.',
    image: '/images/gehuchten/placeholder-landmark.jpg', // Placeholder
  },
  {
    id: 3,
    name: 'Laar',
    description: "'Laar' – een geliefd woord onder puzzelaars. Centraal ligt de opvallende modernistische Sint-Rochuskapel, compleet met vlaggenstok en klok. Een klein monument, wat vervallen, maar fier in zijn eenvoud.",
    image: '/images/gehuchten/placeholder-landmark.jpg', // Placeholder
  },
  {
    id: 4,
    name: 'Kleinderbeek',
    description: 'Een vergeten stukje tussen dorp en snelweg. De straat Kleinderbeek houdt de naam levend. In het noorden, goed weggestopt, ligt het kerkhof.',
    image: '/images/gehuchten/placeholder-landmark.jpg', // Placeholder
  },
  {
    id: 5,
    name: 'Dorp',
    description: "Niet het centrum, maar wel het hart. Zelfs de straat heet hier 'Nieuwerkerken Dorp'. Onder het waakzame oog van de Onze-Lieve-Vrouw-Hemelvaartkerk vindt elke woensdagvoormiddag nog een markt plaats.",
    image: '/images/gehuchten/placeholder-landmark.jpg', // Placeholder
  },
  {
    id: 6,
    name: 'Kraaiwinkel',
    description: 'Groen, uitgestrekt, en gedeeld met Haaltert. Hier slingeren wandelwegen tussen bossen en velden. De Kraaiwinkel is het grootste natuurgebied van Nieuwerkerken – een plek waar stilte nog klinkt.',
    image: '/images/gehuchten/placeholder-landmark.jpg', // Placeholder
  },
  {
    id: 7,
    name: 'Bremt',
    description: 'Langgerekt en licht glooiend, van de brug naar Mere tot diep in de Huystraat. Hier tref je veel groen én het hoogste punt van Nieuwerkerken – ergens rond huisnummer 2 van de Bremtstraat.',
    image: '/images/gehuchten/placeholder-landmark.jpg', // Placeholder
  },
  {
    id: 8,
    name: 'Edixvelde',
    description: 'Het meest zelfstandige gehucht, met een eigen kern, een kleuterschool en de markante Sint-Jozefskerk uit 1960. De losstaande klokkentoren maakt het plaatje compleet.',
    image: '/images/gehuchten/placeholder-landmark.jpg', // Placeholder
  },
  {
    id: 9,
    name: 'Maal',
    description: 'Ruim en groen. Maal verbindt je met de Siesegemkouter en de Erpekouter. In het midden van het gehucht staat de Sint-Annakapel. En een bushalte.',
    image: '/images/gehuchten/placeholder-landmark.jpg', // Placeholder
  },
  {
    id: 10,
    name: 'Regelsbrugge',
    description: 'Hier ligt de grens met Aalst, bewaakt door het domein van kasteel Regelsbrugge. Ook de Odisee Hogeschool staat nog net op Nieuwerkerks grondgebied. Aan het einde van de dreef, bij het sluisje, stoppen de kasseien. De betonweg is Aalst – alles ervoor is van ons.',
    image: '/images/gehuchten/placeholder-landmark.jpg', // Placeholder
  },
  {
    id: 11,
    name: 'Berg',
    description: 'Een naam die zichzelf bewijst. Via de Bergstraat klim je richting station van Ede. In het Spechtgat – de Spechtmeerstraat – loop je van Berg naar Bremt, waar hellingen en vergezichten elkaar afwisselen.',
    image: '/images/gehuchten/placeholder-landmark.jpg', // Placeholder
  },
  {
    id: 12,
    name: 'Zurendries',
    description: 'Wie de brug over de E40 oversteekt richting Aalst, komt op de Zurendries. Een weg met vaart, tot aan het Siesegemkruispunt. Hier staat geen kapel, maar wel het legendarische café Pros – beroemd geworden in de film De Helaasheid der Dingen.',
    image: '/images/gehuchten/zurendries-landmark.jpg', // Specifieke afbeelding voor Zurendries
  },
  {
    id: 13,
    name: 'Restert',
    description: 'Dicht bij het centrum en inmiddels stevig bebouwd. Maar wie doorloopt tot Restert 10, ontdekt een imposant hof met wortels in de 18e eeuw. Een stukje geschiedenis in een modern jasje.',
    image: '/images/gehuchten/placeholder-landmark.jpg', // Placeholder
  },
  {
    id: 14,
    name: 'Hoezekouter',
    description: 'Misschien wel het minst betreden gehucht. Vroeger een open vlakte, nu met een reusachtige windmolen als baken. Voor velen een reden om om te keren, maar wie zoekt via nog wel het mooie voetpad naar de Restert.',
    image: '/images/gehuchten/placeholder-landmark.jpg', // Placeholder
  },
  {
    id: 15,
    name: 'Dries',
    description: 'De uitvalsweg naar Terjoden slingert via Dries. In de laatste bocht ligt de Mandjesvijver – het enige publiek toegankelijke plas water van Nieuwerkerken. Pootje baden is af te raden, maar de plek nodigt uit tot stilstand.',
    image: '/images/gehuchten/placeholder-landmark.jpg', // Placeholder
  },
]

export default function OverNieuwerkerkenPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-sage-dark mb-6 tracking-wide leading-tight title-font">
            Over Nieuwerkerken en zijn gehuchten
          </h1>
          <p className="text-lg sm:text-xl text-sage max-w-2xl mx-auto leading-relaxed font-light">
            Nieuwerkerken is meer dan alleen een dorp; het is een mozaïek van unieke gehuchten, elk met zijn eigen karakter en verborgen pareltjes. Ontdek de verhalen achter de namen en laat je verrassen door de diversiteit van onze gemeente.
          </p>
        </div>

        <div className="mb-12 flex justify-center">
          <Image
            src="/images/nieuwerkerken-gehuchten-map.jpg"
            alt="Kaart van Nieuwerkerken met gehuchten"
            width={800}
            height={600}
            className="rounded-lg shadow-lg border-2 border-beige"
            priority
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gehuchtenData.map((gehucht) => (
            <Card key={gehucht.id} className="border-2 border-beige bg-white shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="relative w-full h-24 bg-gray-200 overflow-hidden">
                <Image
                  src={gehucht.image || "/placeholder.svg"}
                  alt={`Landmark van ${gehucht.name}`}
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-full"
                />
              </div>
              <CardHeader className="relative pb-2">
                <div className="absolute -top-10 left-4 bg-sage-light text-white text-lg font-bold px-3 py-1 rounded-md shadow-md">
                  {gehucht.id}
                </div>
                <CardTitle className="text-sage-dark text-xl title-font pt-6">
                  {gehucht.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-sage text-sm leading-relaxed font-light">{gehucht.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/" passHref>
            <Button className="bg-sage hover:bg-sage-dark text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-300 text-base">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Terug naar overzicht
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
