CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  gehuchten TEXT[],
  distance REAL,
  muddy BOOLEAN,
  description TEXT,
  coordinates JSONB, -- Store as JSONB array of [lat, lng]
  difficulty TEXT,
  duration TEXT,
  highlights TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

-- Create a policy for anonymous users to read routes
CREATE POLICY "Allow public read access" ON routes
FOR SELECT USING (TRUE);

-- Create a policy for authenticated users to insert, update, and delete routes
CREATE POLICY "Allow authenticated users to manage routes" ON routes
FOR ALL USING (auth.role() = 'authenticated');
