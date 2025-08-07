# Nieuwerkerken Wandelt

Dit is een Next.js applicatie voor het beheren en weergeven van wandelroutes in en rond Nieuwerkerken...

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
\`\`\`
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR_SUPABASE_PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR_SUPABASE_ANON_KEY]"
\`\`\`

5.  **Start de ontwikkelserver:**
    \`\`\`bash
    npm run dev
    # of
    yarn dev
    \`\`\`

    De applicatie is nu beschikbaar op `http://localhost:3000`.

## Gebruik

-   **Hoofdpagina (`/`)**: Toont een overzicht van alle wandelroutes.
-   **Route Detail (`/route/[id]`)**: Toont de details van een specifieke route, inclusief een interactieve kaart.
-   **Route Editor (`/route-editor/[id]`)**: Voor het bewerken van bestaande routes (vereist inloggen).
-   **Route Aanmaken (`/create-route`)**: Voor het aanmaken van nieuwe routes (vereist inloggen).
-   **Admin Paneel (`/admin`)**: Een eenvoudig admin paneel (vereist inloggen).
-   **Login (`/login`)**: Inlogpagina voor beheerders.
-   **Over Nieuwerkerken (`/over-nieuwerkerken`)**: Informatie over de gehuchten van Nieuwerkerken.
-   **Over Wandelen (`/over-wandelen`)**: Algemene informatie over wandelen in Nieuwerkerken.

## Authenticatie (Demo)

Voor demo doeleinden is een eenvoudige lokale authenticatie geïmplementeerd:
-   **Gebruikersnaam**: `admin`
-   **Wachtwoord**: `wandelen123`

**Let op**: Dit is *geen* veilige authenticatie voor productieomgevingen. Gebruik in een echte applicatie de ingebouwde authenticatie van Supabase of een andere robuuste oplossing.
\`\`\`

\`\`\`
