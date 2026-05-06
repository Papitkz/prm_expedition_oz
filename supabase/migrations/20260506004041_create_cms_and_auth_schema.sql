/*
  # Create CMS and Auth Schema for Expedition OZ

  1. New Tables
    - `admin_users` — Maps Supabase auth users to admin roles (owner/admin/user)
    - `admin_grants` — Pending admin access grants for users who haven't signed in yet
    - `cms_sections` — Editable sections with default image/video URLs
    - `cms_section_images` — Uploaded images per section (one active per section)
    - `cms_trips` — Expedition trip data (Sylvia, Millenium)
    - `cms_trip_features` — Feature list per trip
    - `cms_trip_itinerary` — Day-by-day itinerary per trip
    - `cms_blogs` — Blog posts
    - `cms_settings` — Key-value settings (Rezdy, contact info, etc.)

  2. Security
    - RLS enabled on ALL tables
    - Public read access for published content (sections, trips, blogs, settings)
    - Only admin/owner users can write/update/delete
    - admin_users and admin_grants restricted to owner only (except own row)

  3. Important Notes
    - The `admin_users` table uses the Supabase auth.uid() to link to auth.users
    - New registrations default to 'user' role
    - Only the owner (hardcoded email check) can promote users to admin
    - CMS sections retain default URLs when no custom image is uploaded
*/

-- ============================================
-- ADMIN USER MANAGEMENT
-- ============================================

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uid uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  display_name text DEFAULT '',
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('owner', 'admin', 'user')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read their own row
CREATE POLICY "Users can read own admin record"
  ON admin_users FOR SELECT
  TO authenticated
  USING (auth.uid() = uid);

-- Only the owner can insert new admin user records
CREATE POLICY "Only owner can insert admin users"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role = 'owner'
    )
  );

-- Only the owner can update admin user records (to change roles)
CREATE POLICY "Only owner can update admin users"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role = 'owner'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role = 'owner'
    )
  );

-- ============================================
-- ADMIN GRANTS (pending access for not-yet-registered users)
-- ============================================

CREATE TABLE IF NOT EXISTS admin_grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  granted_by uuid REFERENCES auth.users(id),
  role text NOT NULL DEFAULT 'admin',
  granted_at timestamptz DEFAULT now()
);

ALTER TABLE admin_grants ENABLE ROW LEVEL SECURITY;

-- Only owner can manage grants
CREATE POLICY "Only owner can read grants"
  ON admin_grants FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role = 'owner'
    )
  );

CREATE POLICY "Only owner can insert grants"
  ON admin_grants FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role = 'owner'
    )
  );

CREATE POLICY "Only owner can delete grants"
  ON admin_grants FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role = 'owner'
    )
  );

-- ============================================
-- CMS SECTIONS (editable images/videos per page section)
-- ============================================

CREATE TABLE IF NOT EXISTS cms_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text UNIQUE NOT NULL,
  page text NOT NULL,
  label text NOT NULL,
  description text DEFAULT '',
  default_image_url text DEFAULT '',
  default_video_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cms_sections ENABLE ROW LEVEL SECURITY;

-- Public can read sections
CREATE POLICY "Public can read sections"
  ON cms_sections FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only admins can modify sections
CREATE POLICY "Admins can insert sections"
  ON cms_sections FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admins can update sections"
  ON cms_sections FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admins can delete sections"
  ON cms_sections FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- ============================================
-- CMS SECTION IMAGES (uploaded images per section)
-- ============================================

CREATE TABLE IF NOT EXISTS cms_section_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES cms_sections(id) ON DELETE CASCADE,
  section_key text NOT NULL,
  image_url text NOT NULL,
  file_path text DEFAULT '',
  alt_text text DEFAULT '',
  is_active boolean DEFAULT false,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cms_section_images ENABLE ROW LEVEL SECURITY;

-- Public can read section images
CREATE POLICY "Public can read section images"
  ON cms_section_images FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only admins can modify section images
CREATE POLICY "Admins can insert section images"
  ON cms_section_images FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admins can update section images"
  ON cms_section_images FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admins can delete section images"
  ON cms_section_images FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- ============================================
-- CMS TRIPS
-- ============================================

CREATE TABLE IF NOT EXISTS cms_trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  vessel_name text NOT NULL,
  title text NOT NULL,
  subtitle text DEFAULT '',
  duration_days int NOT NULL DEFAULT 4,
  max_guests int NOT NULL DEFAULT 12,
  price_aud numeric(10,2) NOT NULL DEFAULT 0,
  price_label text DEFAULT '',
  description text DEFAULT '',
  short_description text DEFAULT '',
  hero_image_url text DEFAULT '',
  hero_video_url text DEFAULT '',
  is_published boolean DEFAULT true,
  sort_order int DEFAULT 0,
  rezdy_product_id text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cms_trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published trips"
  ON cms_trips FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert trips"
  ON cms_trips FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admins can update trips"
  ON cms_trips FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admins can delete trips"
  ON cms_trips FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- ============================================
-- CMS TRIP FEATURES
-- ============================================

CREATE TABLE IF NOT EXISTS cms_trip_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES cms_trips(id) ON DELETE CASCADE,
  feature_text text NOT NULL,
  sort_order int DEFAULT 0
);

ALTER TABLE cms_trip_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read trip features"
  ON cms_trip_features FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert trip features"
  ON cms_trip_features FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admins can update trip features"
  ON cms_trip_features FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admins can delete trip features"
  ON cms_trip_features FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- ============================================
-- CMS TRIP ITINERARY
-- ============================================

CREATE TABLE IF NOT EXISTS cms_trip_itinerary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES cms_trips(id) ON DELETE CASCADE,
  day_number int NOT NULL DEFAULT 1,
  title text NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  activity_label text DEFAULT '',
  meals_label text DEFAULT ''
);

ALTER TABLE cms_trip_itinerary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read trip itinerary"
  ON cms_trip_itinerary FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert trip itinerary"
  ON cms_trip_itinerary FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admins can update trip itinerary"
  ON cms_trip_itinerary FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admins can delete trip itinerary"
  ON cms_trip_itinerary FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- ============================================
-- CMS BLOGS
-- ============================================

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
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cms_blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published blogs"
  ON cms_blogs FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert blogs"
  ON cms_blogs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admins can update blogs"
  ON cms_blogs FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admins can delete blogs"
  ON cms_blogs FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- ============================================
-- CMS SETTINGS (key-value store)
-- ============================================

CREATE TABLE IF NOT EXISTS cms_settings (
  key text PRIMARY KEY,
  value text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cms_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read settings"
  ON cms_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert settings"
  ON cms_settings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admins can update settings"
  ON cms_settings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE uid = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_admin_users_uid ON admin_users(uid);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_cms_sections_key ON cms_sections(section_key);
CREATE INDEX IF NOT EXISTS idx_cms_section_images_section_id ON cms_section_images(section_id);
CREATE INDEX IF NOT EXISTS idx_cms_section_images_active ON cms_section_images(section_id, is_active);
CREATE INDEX IF NOT EXISTS idx_cms_trips_slug ON cms_trips(slug);
CREATE INDEX IF NOT EXISTS idx_cms_trip_features_trip_id ON cms_trip_features(trip_id);
CREATE INDEX IF NOT EXISTS idx_cms_trip_itinerary_trip_id ON cms_trip_itinerary(trip_id);
CREATE INDEX IF NOT EXISTS idx_cms_blogs_slug ON cms_blogs(slug);
CREATE INDEX IF NOT EXISTS idx_admin_grants_email ON admin_grants(email);
