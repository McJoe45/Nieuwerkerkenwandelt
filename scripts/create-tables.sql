CREATE TABLE IF NOT EXISTS routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  distance NUMERIC(10, 2),
  coordinates JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to read all routes
CREATE POLICY "Allow authenticated users to read all routes"
ON routes FOR SELECT
TO authenticated
USING (true);

-- Policy for authenticated users to insert their own routes
CREATE POLICY "Allow authenticated users to insert their own routes"
ON routes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = (SELECT id FROM auth.users WHERE auth.uid() = id));

-- Policy for authenticated users to update their own routes
CREATE POLICY "Allow authenticated users to update their own routes"
ON routes FOR UPDATE
TO authenticated
USING (auth.uid() = (SELECT id FROM auth.users WHERE auth.uid() = id));

-- Policy for authenticated users to delete their own routes
CREATE POLICY "Allow authenticated users to delete their own routes"
ON routes FOR DELETE
TO authenticated
USING (auth.uid() = (SELECT id FROM auth.users WHERE auth.uid() = id));

-- Policy for public users to read all routes (if you want public access)
CREATE POLICY "Allow public users to read all routes"
ON routes FOR SELECT
TO public
USING (true);

-- Create a table for user profiles (optional, but good for user management)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own profile
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy for users to update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Function to create a new profile when a new user signs up
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, NEW.email); -- Or a default username, or prompt for it later
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function after a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
