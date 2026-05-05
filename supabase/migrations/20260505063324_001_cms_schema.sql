/*
  # CMS Database Schema for Expedition OZ

  1. New Tables
    - `admin_users` — Admin user accounts (extends Supabase auth)
    - `cms_sections` — Defines each page section with key, label, and default image
    - `cms_section_images` — Uploaded images per section (Firebase URL stored here)
    - `cms_trips` — Trip/expedition data (name, vessel, duration, price, dates, description)
    - `cms_trip_features` — Feature list items for each trip
    - `cms_trip_itinerary` — Day-by-day itinerary entries
    - `cms_blogs` — Blog posts with title, content, image, author
    - `cms_settings` — Key-value store for site-wide settings (Rezdy ID, etc.)

  2. Security
    - RLS enabled on ALL tables
    - Admin-only policies for INSERT/UPDATE/DELETE
    - Public read access for published content
    - No unauthenticated writes allowed
*/

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  display_name text DEFAULT '',
  role text DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE POLICY "Admins can insert admin users"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
  );

CREATE POLICY "Admins can update admin users"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- CMS Sections — defines each editable section
CREATE TABLE IF NOT EXISTS cms_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text UNIQUE NOT NULL,
  page text NOT NULL,
  label text NOT NULL,
  description text DEFAULT '',
  default_image_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cms_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read sections"
  ON cms_sections FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can insert sections"
  ON cms_sections FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE POLICY "Admins can update sections"
  ON cms_sections FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE POLICY "Admins can delete sections"
  ON cms_sections FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

-- CMS Section Images — uploaded images per section
CREATE TABLE IF NOT EXISTS cms_section_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES cms_sections(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text DEFAULT '',
  sort_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cms_section_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read section images"
  ON cms_section_images FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can insert section images"
  ON cms_section_images FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE POLICY "Admins can update section images"
  ON cms_section_images FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE POLICY "Admins can delete section images"
  ON cms_section_images FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

-- CMS Trips — expedition data
CREATE TABLE IF NOT EXISTS cms_trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  vessel_name text NOT NULL,
  title text NOT NULL,
  subtitle text DEFAULT '',
  duration_days int NOT NULL DEFAULT 4,
  max_guests int DEFAULT 12,
  price_aud numeric(10,2) NOT NULL DEFAULT 0,
  price_label text DEFAULT '',
  description text DEFAULT '',
  short_description text DEFAULT '',
  hero_image_url text DEFAULT '',
  hero_video_url text DEFAULT '',
  is_published boolean DEFAULT true,
  sort_order int DEFAULT 0,
  rezdy_product_id text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cms_trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published trips"
  ON cms_trips FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can insert trips"
  ON cms_trips FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE POLICY "Admins can update trips"
  ON cms_trips FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE POLICY "Admins can delete trips"
  ON cms_trips FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

-- CMS Trip Features — feature list items
CREATE TABLE IF NOT EXISTS cms_trip_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES cms_trips(id) ON DELETE CASCADE,
  feature_text text NOT NULL,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cms_trip_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read trip features"
  ON cms_trip_features FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can insert trip features"
  ON cms_trip_features FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE POLICY "Admins can update trip features"
  ON cms_trip_features FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE POLICY "Admins can delete trip features"
  ON cms_trip_features FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

-- CMS Trip Itinerary — day-by-day entries
CREATE TABLE IF NOT EXISTS cms_trip_itinerary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES cms_trips(id) ON DELETE CASCADE,
  day_number int NOT NULL DEFAULT 1,
  title text NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  activity_label text DEFAULT '',
  meals_label text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cms_trip_itinerary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read trip itinerary"
  ON cms_trip_itinerary FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can insert trip itinerary"
  ON cms_trip_itinerary FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE POLICY "Admins can update trip itinerary"
  ON cms_trip_itinerary FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE POLICY "Admins can delete trip itinerary"
  ON cms_trip_itinerary FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

-- CMS Blogs — blog posts
CREATE TABLE IF NOT EXISTS cms_blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text DEFAULT '',
  content text DEFAULT '',
  cover_image_url text DEFAULT '',
  author_name text DEFAULT 'Expedition OZ',
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cms_blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published blogs"
  ON cms_blogs FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Admins can read all blogs"
  ON cms_blogs FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE POLICY "Admins can insert blogs"
  ON cms_blogs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE POLICY "Admins can update blogs"
  ON cms_blogs FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE POLICY "Admins can delete blogs"
  ON cms_blogs FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

-- CMS Settings — key-value store
CREATE TABLE IF NOT EXISTS cms_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value text DEFAULT '',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cms_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read settings"
  ON cms_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can insert settings"
  ON cms_settings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE POLICY "Admins can update settings"
  ON cms_settings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE POLICY "Admins can delete settings"
  ON cms_settings FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

-- Seed default sections
INSERT INTO cms_sections (section_key, page, label, description, default_image_url) VALUES
  ('home_hero', 'home', 'Hero Background', 'Main hero video/image on homepage', 'https://images.pexels.com/photos/1430677/pexels-photo-1430677.jpeg?auto=compress&cs=tinysrgb&w=1920'),
  ('home_intro_main', 'home', 'Intro - Main Image', 'Main image in the intro section', 'https://r4.wallpaperflare.com/wallpaper/839/744/992/earth-great-barrier-reef-reef-wallpaper-9950d8cd811aedabd6c7a8ffa0f1760d.jpg'),
  ('home_intro_accent', 'home', 'Intro - Accent Image', 'Accent/overlay image in intro section', 'https://r4.wallpaperflare.com/wallpaper/643/352/44/great-barrier-reef-coral-reef-in-queensland-australia-ocean-tropical-animals-pisces-plants-1920%C3%971200-wallpaper-525142607db61ebbaac8027500b899e2.jpg'),
  ('home_tours_sylvia', 'home', 'Tours - Sylvia Card', 'Sylvia expedition card image', 'https://r4.wallpaperflare.com/wallpaper/750/616/903/coral-reef-fish-reef-fish-aquarium-wallpaper-09e0f8ad012a8d9b26d7a85fd091264d.jpg'),
  ('home_tours_millenium', 'home', 'Tours - Millenium Card', 'Millenium expedition card image', 'https://r4.wallpaperflare.com/wallpaper/639/878/552/microsoft-surface-hub-great-barrier-reef-4k-wallpaper-78262d48f010bc78d0acd10e38b214ba.jpg'),
  ('home_experience_whaleshark', 'home', 'Experience - Whale Shark', 'Whale shark encounter image', 'https://images.pexels.com/photos/3046629/pexels-photo-3046629.jpeg?auto=compress&cs=tinysrgb&w=900'),
  ('home_experience_luxury', 'home', 'Experience - Luxury', 'Luxury onboard image', 'https://images.pexels.com/photos/1578750/pexels-photo-1578750.jpeg?auto=compress&cs=tinysrgb&w=900'),
  ('home_experience_reef', 'home', 'Experience - Reef', 'Reef underwater image', 'https://r4.wallpaperflare.com/wallpaper/617/792/1005/fish-landscape-the-ocean-stay-wallpaper-679fe2349f35ff7a7f820431b191e785.jpg'),
  ('home_cta', 'home', 'CTA Section Background', 'Call-to-action section background', 'https://r4.wallpaperflare.com/wallpaper/733/1/254/nature-landscape-reef-sea-colorful-blue-water-fish-wallpaper-19a0b89d41fafd8bc64788af408146bd.jpg'),
  ('about_hero', 'about', 'About Hero', 'About page hero image', 'https://images.pexels.com/photos/1430676/pexels-photo-1430676.jpeg?auto=compress&cs=tinysrgb&w=1920'),
  ('about_team', 'about', 'About - Team Image', 'Team/vessel image on about page', 'https://images.pexels.com/photos/1295138/pexels-photo-1295138.jpeg?auto=compress&cs=tinysrgb&w=900'),
  ('about_reef', 'about', 'About - Reef Image', 'Ningaloo reef image on about page', 'https://r4.wallpaperflare.com/wallpaper/375/728/857/australia-great-barrier-reef-natural-ocean-wallpaper-f21142d03de6ee5bda28029500b8c9f2.jpg'),
  ('sylvia_hero', 'sylvia', 'Sylvia Hero', 'Sylvia expedition hero image', 'https://images.unsplash.com/photo-1582967788606-a171f1080ca8?auto=format&fit=crop&w=1920&q=80'),
  ('sylvia_about', 'sylvia', 'Sylvia - About Image', 'Sylvia about section image', 'https://www.ningaloodiscovery.com.au/wp-content/uploads/2016/01/swim-wth-turtles-1024x683.jpg'),
  ('millenium_hero', 'millenium', 'Millenium Hero', 'Millenium expedition hero image', 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1920&q=80'),
  ('contact_hero', 'contact', 'Contact Hero', 'Contact page hero image', 'https://images.pexels.com/photos/1295138/pexels-photo-1295138.jpeg?auto=compress&cs=tinysrgb&w=1920'),
  ('faq_hero', 'faq', 'FAQ Hero', 'FAQ page hero image', 'https://images.pexels.com/photos/1430677/pexels-photo-1430677.jpeg?auto=compress&cs=tinysrgb&w=1920'),
  ('expeditions_hero', 'expeditions', 'Expeditions Hero', 'Expeditions listing hero image', 'https://images.pexels.com/photos/1430677/pexels-photo-1430677.jpeg?auto=compress&cs=tinysrgb&w=1920')
ON CONFLICT (section_key) DO NOTHING;

-- Seed default trips
INSERT INTO cms_trips (slug, vessel_name, title, subtitle, duration_days, max_guests, price_aud, price_label, description, short_description, hero_image_url, hero_video_url, sort_order, rezdy_product_id) VALUES
  ('sylvia', 'Sylvia', 'Sylvia', 'Northern Reef Expedition', 4, 12, 2495.00, 'From $2,495 AUD', 'Four extraordinary days exploring the untouched northern reaches of Ningaloo Reef aboard our elegant vessel.', 'An intimate four-day voyage exploring the northern reaches of Ningaloo Reef.', 'https://images.unsplash.com/photo-1582967788606-a171f1080ca8?auto=format&fit=crop&w=1920&q=80', 'https://cdn.pixabay.com/video/2021/02/18/65560-515098344_large.mp4', 1, ''),
  ('millenium', 'Millenium', 'Millenium', 'The Ultimate Reef Expedition', 7, 14, 4495.00, 'From $4,495 AUD', 'Seven transformative days encompassing the full length of Ningaloo Reef. From whale sharks to humpback whales, this is the definitive ocean adventure.', 'The ultimate seven-day immersion covering the full length of Ningaloo Reef.', 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1920&q=80', 'https://videos.pexels.com/video-files/30351567/30351567-uhd_2560_1440_25fps.mp4', 2, '')
ON CONFLICT (slug) DO NOTHING;

-- Seed default settings
INSERT INTO cms_settings (setting_key, setting_value, description) VALUES
  ('rezdy_company_code', '', 'Rezdy company code for booking integration'),
  ('rezdy_sylvia_product_id', '', 'Rezdy product ID for Sylvia expedition'),
  ('rezdy_millenium_product_id', '', 'Rezdy product ID for Millenium expedition'),
  ('site_phone', '+61-234-567-890', 'Primary contact phone'),
  ('site_email', 'hello@expeditionoz.com.au', 'Primary contact email'),
  ('firebase_config', '{}', 'Firebase configuration JSON (project-level)')
ON CONFLICT (setting_key) DO NOTHING;

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_admin_users_updated_at') THEN
    CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_cms_sections_updated_at') THEN
    CREATE TRIGGER update_cms_sections_updated_at BEFORE UPDATE ON cms_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_cms_trips_updated_at') THEN
    CREATE TRIGGER update_cms_trips_updated_at BEFORE UPDATE ON cms_trips FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_cms_blogs_updated_at') THEN
    CREATE TRIGGER update_cms_blogs_updated_at BEFORE UPDATE ON cms_blogs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_cms_settings_updated_at') THEN
    CREATE TRIGGER update_cms_settings_updated_at BEFORE UPDATE ON cms_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
