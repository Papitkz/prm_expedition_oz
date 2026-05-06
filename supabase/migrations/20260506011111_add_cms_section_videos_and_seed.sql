/*
  # Seed missing CMS sections only
  (cms_section_videos table already exists — skip creation)
*/

-- ============================================
-- SEED MISSING SECTIONS (blog pages, etc.)
-- ============================================

INSERT INTO cms_sections (section_key, page, label, description, default_image_url, default_video_url)
VALUES
  ('blog_hero', 'blog', 'Blog Hero', 'Blog listing page hero image', 'https://images.pexels.com/photos/1430677/pexels-photo-1430677.jpeg?auto=compress&cs=tinysrgb&w=1920', '')
ON CONFLICT (section_key) DO NOTHING;

INSERT INTO cms_sections (section_key, page, label, description, default_image_url, default_video_url)
VALUES
  ('blog_post_hero', 'blog-post', 'Blog Post Hero', 'Individual blog post hero background', 'https://images.pexels.com/photos/1430677/pexels-photo-1430677.jpeg?auto=compress&cs=tinysrgb&w=1920', '')
ON CONFLICT (section_key) DO NOTHING;

-- Sylvia dining
INSERT INTO cms_sections (section_key, page, label, description, default_image_url, default_video_url)
VALUES
  ('sylvia_dining_1', 'sylvia', 'Sylvia - Sunset Dining', 'Sylvia dining experience image 1', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80', ''),
  ('sylvia_dining_2', 'sylvia', 'Sylvia - Exmouth Seafood', 'Sylvia dining experience image 2', 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=600&q=80', ''),
  ('sylvia_dining_3', 'sylvia', 'Sylvia - Premium Cellar', 'Sylvia dining experience image 3', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80', ''),
  ('sylvia_dining_4', 'sylvia', 'Sylvia - Chefs Table', 'Sylvia dining experience image 4', 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=600&q=80', '')
ON CONFLICT (section_key) DO NOTHING;

-- Millenium dining
INSERT INTO cms_sections (section_key, page, label, description, default_image_url, default_video_url)
VALUES
  ('millenium_dining_1', 'millenium', 'Millenium - Sunset Dining', 'Millenium dining experience image 1', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80', ''),
  ('millenium_dining_2', 'millenium', 'Millenium - Exmouth Seafood', 'Millenium dining experience image 2', 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=600&q=80', ''),
  ('millenium_dining_3', 'millenium', 'Millenium - Margaret River Wines', 'Millenium dining experience image 3', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80', ''),
  ('millenium_dining_4', 'millenium', 'Millenium - Beach BBQ', 'Millenium dining experience image 4', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80', ''),
  ('millenium_dining_5', 'millenium', 'Millenium - Champagne Brunch', 'Millenium dining experience image 5', 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=600&q=80', ''),
  ('millenium_dining_6', 'millenium', 'Millenium - Chefs Table', 'Millenium dining experience image 6', 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=600&q=80', '')
ON CONFLICT (section_key) DO NOTHING;

-- Sylvia itinerary
INSERT INTO cms_sections (section_key, page, label, description, default_image_url, default_video_url)
VALUES
  ('sylvia_itinerary_day1', 'sylvia', 'Sylvia - Day 1 Itinerary', 'Day 1 Departure & First Dive', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80', ''),
  ('sylvia_itinerary_day2', 'sylvia', 'Sylvia - Day 2 Itinerary', 'Day 2 Whale Shark Encounter', 'https://images.unsplash.com/photo-1719450589784-c2c36ccf8e5b?q=80&w=1075&auto=format&fit=crop', ''),
  ('sylvia_itinerary_day3', 'sylvia', 'Sylvia - Day 3 Itinerary', 'Day 3 Coral Gardens & Turquoise Bay', 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=1200&q=80', ''),
  ('sylvia_itinerary_day4', 'sylvia', 'Sylvia - Day 4 Itinerary', 'Day 4 Final Morning & Return', 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&w=1200&q=80', '')
ON CONFLICT (section_key) DO NOTHING;

-- Millenium itinerary
INSERT INTO cms_sections (section_key, page, label, description, default_image_url, default_video_url)
VALUES
  ('millenium_itinerary_day1', 'millenium', 'Millenium - Day 1 Itinerary', 'Day 1 Embarkation & Welcome Dinner', 'https://plus.unsplash.com/premium_photo-1682804227999-899fd9011e45?q=80&w=1075&auto=format&fit=crop', ''),
  ('millenium_itinerary_day2', 'millenium', 'Millenium - Day 2 Itinerary', 'Day 2 Whale Shark Encounter', 'https://images.unsplash.com/photo-1576124344805-c47cea66b0db?q=80&w=1112&auto=format&fit=crop', ''),
  ('millenium_itinerary_day3', 'millenium', 'Millenium - Day 3 Itinerary', 'Day 3 Manta Ray Dive & Coral Gardens', 'https://images.unsplash.com/photo-1616464592706-f39e5b192451?q=80&w=1633&auto=format&fit=crop', ''),
  ('millenium_itinerary_day4', 'millenium', 'Millenium - Day 4 Itinerary', 'Day 4 Deep Reef & Night Snorkel', 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=1200&q=80', ''),
  ('millenium_itinerary_day5', 'millenium', 'Millenium - Day 5 Itinerary', 'Day 5 Humpback Whale Watching', 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1200&q=80', ''),
  ('millenium_itinerary_day6', 'millenium', 'Millenium - Day 6 Itinerary', 'Day 6 Coral Bay & Reef Walk', 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&w=1200&q=80', ''),
  ('millenium_itinerary_day7', 'millenium', 'Millenium - Day 7 Itinerary', 'Day 7 Final Morning & Farewell', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80', '')
ON CONFLICT (section_key) DO NOTHING;

-- Route map backgrounds
INSERT INTO cms_sections (section_key, page, label, description, default_image_url, default_video_url)
VALUES
  ('sylvia_route_bg', 'sylvia', 'Sylvia - Route Map Background', 'Background image for Sylvia route map section', 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&w=1920&q=80', ''),
  ('millenium_route_bg', 'millenium', 'Millenium - Route Map Background', 'Background image for Millenium route map section', 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&w=1920&q=80', '')
ON CONFLICT (section_key) DO NOTHING;

-- Sylvia vessel gallery
INSERT INTO cms_sections (section_key, page, label, description, default_image_url, default_video_url)
VALUES
  ('sylvia_vessel_1', 'sylvia', 'Sylvia - Vessel at Anchor', 'Sylvia vessel exterior', 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=800&q=80', ''),
  ('sylvia_vessel_2', 'sylvia', 'Sylvia - Premium Cabin', 'Sylvia cabin accommodation', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', ''),
  ('sylvia_vessel_3', 'sylvia', 'Sylvia - Sun Deck Lounge', 'Sylvia common areas', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80', ''),
  ('sylvia_vessel_4', 'sylvia', 'Sylvia - Master Suite', 'Sylvia master suite', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80', ''),
  ('sylvia_vessel_5', 'sylvia', 'Sylvia - Dive Platform', 'Sylvia dive activities', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80', ''),
  ('sylvia_vessel_6', 'sylvia', 'Sylvia - Dining Salon', 'Sylvia dining area', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80', '')
ON CONFLICT (section_key) DO NOTHING;

-- Millenium vessel gallery
INSERT INTO cms_sections (section_key, page, label, description, default_image_url, default_video_url)
VALUES
  ('millenium_vessel_1', 'millenium', 'Millenium - Vessel at Anchor', 'Millenium vessel exterior', 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=800&q=80', ''),
  ('millenium_vessel_2', 'millenium', 'Millenium - Premium Suite', 'Millenium cabin accommodation', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', ''),
  ('millenium_vessel_3', 'millenium', 'Millenium - Master Cabin', 'Millenium master cabin', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80', ''),
  ('millenium_vessel_4', 'millenium', 'Millenium - Observation Deck', 'Millenium common areas', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80', ''),
  ('millenium_vessel_5', 'millenium', 'Millenium - Dining Salon', 'Millenium dining area', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80', ''),
  ('millenium_vessel_6', 'millenium', 'Millenium - Dive Platform', 'Millenium dive activities', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80', ''),
  ('millenium_vessel_7', 'millenium', 'Millenium - Gourmet Galley', 'Millenium kitchen', 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80', ''),
  ('millenium_vessel_8', 'millenium', 'Millenium - Lounge Area', 'Millenium lounge', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80', '')
ON CONFLICT (section_key) DO NOTHING;

-- About page grid
INSERT INTO cms_sections (section_key, page, label, description, default_image_url, default_video_url)
VALUES
  ('about_grid_1', 'about', 'About - Grid Image 1', 'About page manta ray image', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', ''),
  ('about_grid_2', 'about', 'About - Grid Image 2', 'About page sunset dining image', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80', ''),
  ('about_grid_3', 'about', 'About - Grid Image 3', 'About page turquoise waters image', 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&w=600&q=80', ''),
  ('about_grid_4', 'about', 'About - Grid Image 4', 'About page whale shark image', 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=600&q=80', '')
ON CONFLICT (section_key) DO NOTHING;