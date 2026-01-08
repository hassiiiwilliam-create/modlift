-- ============================================================================
-- ModLift Products Table Enhancement Migration
-- Adds comprehensive columns for filtering wheels, tires, suspension, and more
-- ============================================================================

-- ============================================================================
-- SECTION 1: CORE PRODUCT FIELDS
-- ============================================================================

-- Product identification
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sku text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS brand text;

-- Pricing and availability
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS msrp numeric(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sale_price numeric(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS on_sale boolean DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS free_shipping boolean DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS in_stock boolean DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_quantity int DEFAULT 0;

-- Product organization
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS subcategory text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS product_tags text[] DEFAULT '{}';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS warehouse_location text;

-- ============================================================================
-- SECTION 2: WHEEL-SPECIFIC COLUMNS
-- ============================================================================

-- Core wheel specifications
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS wheel_diameter int;          -- 17, 18, 20, 22, 24
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS wheel_width numeric(4,1);    -- 8.5, 9, 10, 12
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "offset" int;                 -- -44, -12, 0, +15
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS bolt_pattern text;           -- 6x135, 8x170

-- Wheel branding and styling
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS wheel_brand text;            -- Fuel, Method, KMC
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS wheel_model text;            -- Rebel, Runner, Grenade
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS wheel_finish text;           -- Matte Black, Machined, Bronze
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS wheel_color text;            -- Black, Bronze, Gunmetal

-- Wheel materials and specs
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS material text;               -- Aluminum, Steel, Forged
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS weight numeric(5,2);         -- Weight in lbs
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS load_rating int;             -- Load rating in lbs
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS backspacing numeric(4,2);    -- Backspacing in inches
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS center_bore numeric(5,2);    -- Hub bore in mm

-- ============================================================================
-- SECTION 3: TIRE-SPECIFIC COLUMNS
-- ============================================================================

-- Core tire specifications
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tire_size text;              -- 35x12.50R20, 285/70R17
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tire_width int;              -- Width in mm (285, 315)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS aspect_ratio int;            -- Aspect ratio (70, 65)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS rim_diameter int;            -- Rim size (17, 18, 20)

-- Tire classification
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tire_type text;              -- all_season, all_terrain, mud_terrain, hybrid
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tire_brand text;             -- BFGoodrich, Nitto, Toyo
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tire_model text;             -- KO2, Trail Grappler
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS season text;                 -- all_season, summer, winter

-- Tire performance specs
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS load_index int;              -- 121, 126
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS speed_rating text;           -- Q, R, S, T
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS ply_rating int;              -- 10-ply, 12-ply
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tread_depth numeric(4,2);    -- Tread depth in 32nds
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sidewall text;               -- Blackwall, White Letter

-- ============================================================================
-- SECTION 4: SUSPENSION/LIFT KIT COLUMNS
-- ============================================================================

-- Core suspension specifications
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS suspension_type text;        -- lift_kits, leveling, coilovers, air_suspension, body_lift, lowering, shocks_struts
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS lift_height numeric(4,2);    -- 0, 2, 3, 4, 6, 8 (inches)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS lift_brand text;             -- BDS, Rough Country, Fox, Icon

-- Suspension compatibility
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS suspension_position text;    -- front, rear, full
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS suspension_travel numeric(4,2); -- Wheel travel in inches
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS coil_spring_rate int;        -- Spring rate in lbs/in
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS shock_length numeric(5,2);   -- Extended length

-- Kit components
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS includes_shocks boolean DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS includes_control_arms boolean DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS includes_hardware boolean DEFAULT true;

-- ============================================================================
-- SECTION 5: ACCESSORY COLUMNS
-- ============================================================================

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS accessory_type text;         -- bumper, lighting, armor, fender_flares
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS color text;                   -- General color field

-- ============================================================================
-- SECTION 6: VEHICLE COMPATIBILITY (JSONB for flexible matching)
-- ============================================================================

-- Vehicle compatibility as JSONB for flexible querying
-- Example: {"year": 2022, "make": "RAM", "model": "1500", "trim": "Sport", "drivetrain": "4WD"}
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS vehicle_compatibility jsonb DEFAULT '{}';

-- Multiple images support
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS thumbnail_url text;

-- ============================================================================
-- SECTION 7: COMBO/PACKAGE FIELDS
-- ============================================================================

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_combo boolean DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS combo_components jsonb;        -- [{product_id, quantity}]
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS combo_savings numeric(10,2);   -- Total savings

-- ============================================================================
-- SECTION 8: SEO AND METADATA
-- ============================================================================

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS meta_title text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS meta_description text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- ============================================================================
-- SECTION 9: INDEXES FOR FILTER PERFORMANCE
-- ============================================================================

-- Category and type indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON public.products(subcategory);
CREATE INDEX IF NOT EXISTS idx_products_suspension_type ON public.products(suspension_type);
CREATE INDEX IF NOT EXISTS idx_products_tire_type ON public.products(tire_type);

-- Brand indexes
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_wheel_brand ON public.products(wheel_brand);
CREATE INDEX IF NOT EXISTS idx_products_tire_brand ON public.products(tire_brand);
CREATE INDEX IF NOT EXISTS idx_products_lift_brand ON public.products(lift_brand);

-- Wheel specification indexes
CREATE INDEX IF NOT EXISTS idx_products_wheel_diameter ON public.products(wheel_diameter);
CREATE INDEX IF NOT EXISTS idx_products_wheel_width ON public.products(wheel_width);
CREATE INDEX IF NOT EXISTS idx_products_offset ON public.products("offset");
CREATE INDEX IF NOT EXISTS idx_products_bolt_pattern ON public.products(bolt_pattern);
CREATE INDEX IF NOT EXISTS idx_products_wheel_finish ON public.products(wheel_finish);
CREATE INDEX IF NOT EXISTS idx_products_material ON public.products(material);
CREATE INDEX IF NOT EXISTS idx_products_weight ON public.products(weight);

-- Tire specification indexes
CREATE INDEX IF NOT EXISTS idx_products_tire_size ON public.products(tire_size);
CREATE INDEX IF NOT EXISTS idx_products_rim_diameter ON public.products(rim_diameter);

-- Suspension indexes
CREATE INDEX IF NOT EXISTS idx_products_lift_height ON public.products(lift_height);

-- Price and availability indexes
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_on_sale ON public.products(on_sale) WHERE on_sale = true;
CREATE INDEX IF NOT EXISTS idx_products_free_shipping ON public.products(free_shipping) WHERE free_shipping = true;

-- SKU and search indexes
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);

-- GIN index for JSONB vehicle compatibility (for contains queries)
CREATE INDEX IF NOT EXISTS idx_products_vehicle_compatibility ON public.products USING gin(vehicle_compatibility);

-- GIN index for product tags array
CREATE INDEX IF NOT EXISTS idx_products_tags ON public.products USING gin(product_tags);

-- Text search index for keyword search
CREATE INDEX IF NOT EXISTS idx_products_title_search ON public.products USING gin(to_tsvector('english', coalesce(title, '')));
CREATE INDEX IF NOT EXISTS idx_products_name_search ON public.products USING gin(to_tsvector('english', coalesce(name, '')));

-- Composite indexes for common filter combinations
CREATE INDEX IF NOT EXISTS idx_products_category_brand ON public.products(category, brand);
CREATE INDEX IF NOT EXISTS idx_products_wheel_specs ON public.products(wheel_diameter, wheel_width, bolt_pattern);
CREATE INDEX IF NOT EXISTS idx_products_category_price ON public.products(category, price);

-- ============================================================================
-- SECTION 10: TRIGGER FOR updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at_trigger ON public.products;
CREATE TRIGGER products_updated_at_trigger
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_products_updated_at();

-- ============================================================================
-- SECTION 11: FITMENT PREFERENCES TABLE (for offset range lookups)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.fitment_preferences (
  id text PRIMARY KEY,
  label text NOT NULL,
  description text,
  offset_min int,
  offset_max int,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Insert default fitment preferences
INSERT INTO public.fitment_preferences (id, label, description, offset_min, offset_max, display_order)
VALUES
  ('flush', 'Flush', 'Wheels sit flush with fender line', -12, 0, 1),
  ('mild_poke', 'Mild Poke', 'Slight wheel protrusion past fenders', -24, -12, 2),
  ('aggressive_poke', 'Aggressive Poke', 'Significant wheel poke for aggressive stance', -44, -24, 3),
  ('tucked', 'Tucked', 'Wheels tucked inside fenders for clean look', 0, 20, 4),
  ('factory', 'Factory/OEM', 'Factory offset range', 15, 45, 5)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  offset_min = EXCLUDED.offset_min,
  offset_max = EXCLUDED.offset_max,
  display_order = EXCLUDED.display_order;

-- Enable RLS on fitment_preferences
ALTER TABLE public.fitment_preferences ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read fitment preferences
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies p
    WHERE p.schemaname='public'
    AND p.tablename='fitment_preferences'
    AND p.policyname='Fitment preferences select anon'
  ) THEN
    CREATE POLICY "Fitment preferences select anon" ON public.fitment_preferences
      FOR SELECT USING (true);
  END IF;
END $$;

-- ============================================================================
-- SECTION 12: HELPER VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View for wheel products with formatted specs
CREATE OR REPLACE VIEW public.v_wheel_products AS
SELECT
  id,
  title,
  name,
  sku,
  brand,
  wheel_brand,
  wheel_model,
  wheel_diameter,
  wheel_width,
  "offset",
  bolt_pattern,
  wheel_finish,
  material,
  weight,
  price,
  sale_price,
  on_sale,
  image_url,
  images,
  vehicle_compatibility,
  -- Formatted display string
  CONCAT(
    wheel_diameter, 'x', wheel_width,
    ' ', bolt_pattern,
    ' ', "offset", 'mm offset'
  ) as wheel_spec_display
FROM public.products
WHERE category = 'wheels';

-- View for tire products with parsed size
CREATE OR REPLACE VIEW public.v_tire_products AS
SELECT
  id,
  title,
  name,
  sku,
  brand,
  tire_brand,
  tire_model,
  tire_size,
  tire_width,
  aspect_ratio,
  rim_diameter,
  tire_type,
  season,
  load_index,
  speed_rating,
  ply_rating,
  price,
  sale_price,
  on_sale,
  image_url,
  images,
  vehicle_compatibility
FROM public.products
WHERE category = 'tires';

-- View for suspension products
CREATE OR REPLACE VIEW public.v_suspension_products AS
SELECT
  id,
  title,
  name,
  sku,
  brand,
  lift_brand,
  suspension_type,
  lift_height,
  suspension_position,
  includes_shocks,
  includes_control_arms,
  price,
  sale_price,
  on_sale,
  image_url,
  images,
  vehicle_compatibility,
  -- Formatted display
  CASE
    WHEN lift_height = 0 THEN 'Leveling Kit'
    ELSE CONCAT(lift_height, '" Lift Kit')
  END as lift_display
FROM public.products
WHERE category = 'suspension';

-- ============================================================================
-- DONE
-- ============================================================================

COMMENT ON TABLE public.products IS 'Main products table with comprehensive columns for wheels, tires, suspension, and accessories filtering';
