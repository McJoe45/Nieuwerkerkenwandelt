# Nieuwerkerken Wandelt

Dit is een Next.js applicatie voor het beheren en weergeven van wandelroutes in en rond Nieuwerkerken.

## Features

- Overzicht van wandelroutes
- Sorteer routes op naam en afstand
- Gedetailleerde routepagina's met kaartweergave
- Admin paneel voor het aanmaken, bewerken en verwijderen van routes
- Informatiepagina's over Nieuwerkerken en wandelen

## Technologieën

- Next.js (App Router)
- React
- Tailwind CSS
- Shadcn/ui
- Leaflet (voor kaarten)
- Supabase (voor database en authenticatie)

## Installatie

1.  **Kloon de repository:**
    \`\`\`bash
    git clone [jouw-repo-url]
    cd nieuwerkerken-wandelt
    \`\`\`

2.  **Installeer afhankelijkheden:**
    \`\`\`bash
    npm install
    # of
    yarn install
    \`\`\`

3.  **Supabase Setup:**
    -   Maak een nieuw project aan op [Supabase](https://supabase.com/).
    -   Ga naar `Table Editor` en maak een nieuwe tabel genaamd `routes` met de volgende kolommen:
        -   `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
        -   `name` (text)
        -   `gehuchten` (text[], array van strings)
        -   `distance` (real)
        -   `muddy` (boolean)
        -   `description` (text)
        -   `coordinates` (jsonb, array van [latitude, longitude] paren)
        -   `difficulty` (text)
        -   `duration` (text)
        -   `highlights` (text[], array van strings)
        -   `created_at` (timestamp with time zone, Default: `now()`)
        -   `updated_at` (timestamp with time zone, Default: `now()`, Update: `now()`)
    -   Ga naar `API Settings` en kopieer je `Project URL` en `anon public` sleutel.

4.  **Omgevingsvariabelen:**
    -   Maak een `.env.local` bestand aan in de root van je project en voeg de volgende variabelen toe:
