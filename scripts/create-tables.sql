-- Create routes table
CREATE TABLE IF NOT EXISTS routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  gehuchten TEXT[] NOT NULL DEFAULT '{}',
  distance DECIMAL(5,2) NOT NULL,
  muddy BOOLEAN NOT NULL DEFAULT false,
  description TEXT NOT NULL,
  coordinates JSONB NOT NULL DEFAULT '[]',
  difficulty TEXT,
  duration TEXT,
  highlights TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (for future authentication)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert demo user
INSERT INTO users (username, password_hash) 
VALUES ('admin', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9QO') -- This would be a proper hash in production
ON CONFLICT (username) DO NOTHING;

-- Insert demo routes with proper UUIDs
INSERT INTO routes (id, name, gehuchten, distance, muddy, description, coordinates, difficulty, duration, highlights) VALUES
(
  gen_random_uuid(),
  'Dendervallei Wandeling',
  ARRAY['Centrum', 'Bosstraat', 'Molenveld'],
  5.2,
  true,
  'Een prachtige wandeling langs de Dender met zicht op historische molens en natuurgebieden. De route voert je door het hart van Nieuwerkerken en biedt adembenemende uitzichten op de vallei.',
  '[[50.9167, 4.0333], [50.92, 4.04], [50.915, 4.045], [50.9167, 4.0333]]'::jsonb,
  'Gemakkelijk',
  '1u 15min',
  ARRAY['Historische watermolen', 'Dendervallei uitzicht', 'Oude kerk van Nieuwerkerken']
),
(
  gen_random_uuid(),
  'Bospaden Route',
  ARRAY['Nieuwbos', 'Kapelleberg'],
  3.8,
  false,
  'Een rustige boswandeling perfect voor families. Deze route neemt je mee door dichte bossen en open velden met veel mogelijkheden om wilde dieren te spotten.',
  '[[50.91, 4.03], [50.913, 4.035], [50.908, 4.038], [50.91, 4.03]]'::jsonb,
  'Gemakkelijk',
  '50min',
  ARRAY['Eeuwenoude eikenbomen', 'Vogelkijkhut', 'Picknickplaats']
),
(
  gen_random_uuid(),
  'Heuvelland Tocht',
  ARRAY['Hoogstraat', 'Bergveld', 'Panorama'],
  8.1,
  true,
  'Een uitdagende wandeling voor ervaren wandelaars. Deze route biedt spectaculaire panoramische uitzichten over de hele regio en voert langs verschillende historische bezienswaardigheden.',
  '[[50.92, 4.025], [50.925, 4.03], [50.928, 4.035], [50.92, 4.04], [50.92, 4.025]]'::jsonb,
  'Moeilijk',
  '2u 30min',
  ARRAY['Hoogste punt van Nieuwerkerken', 'Kasteel ruïne', 'Panoramisch uitzicht', 'Historische kapel']
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON routes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
