-- ============================================================================
-- ModLift Products Table Enhancement Migration (V2)
-- Adds columns needed for filtering - compatible with existing schema
-- ============================================================================

-- ============================================================================
-- SECTION 1: ADD MISSING CORE COLUMNS
-- ============================================================================

-- Add category as text (for direct filtering, in addition to category_id)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS subcategory text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS brand text;

-- Pricing columns
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS msrp numeric(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sale_price numeric(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_quantity int DEFAULT 0;

-- Tags array
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS product_tags text[] DEFAULT '{}';

-- ============================================================================
-- SECTION 2: WHEEL-SPECIFIC COLUMNS
-- ============================================================================

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS wheel_diameter int;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS wheel_width numeric(4,1);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS wheel_offset int;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS bolt_pattern text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS wheel_brand text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS wheel_model text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS wheel_finish text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS wheel_color text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS material text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS weight numeric(5,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS load_rating int;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS backspacing numeric(4,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS center_bore numeric(5,2);

-- ============================================================================
-- SECTION 3: TIRE-SPECIFIC COLUMNS
-- ============================================================================

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tire_size text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tire_width int;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS aspect_ratio int;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS rim_diameter int;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tire_type text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tire_brand text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tire_model text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS season text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS load_index int;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS speed_rating text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS ply_rating int;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tread_depth numeric(4,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sidewall text;

-- ============================================================================
-- SECTION 4: SUSPENSION/LIFT KIT COLUMNS
-- ============================================================================

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS suspension_type text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS lift_height numeric(4,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS lift_brand text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS suspension_position text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS suspension_travel numeric(4,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS coil_spring_rate int;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS shock_length numeric(5,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS includes_shocks boolean DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS includes_control_arms boolean DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS includes_hardware boolean DEFAULT true;

-- ============================================================================
-- SECTION 5: ACCESSORY AND OTHER COLUMNS
-- ============================================================================

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS accessory_type text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS color text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_combo boolean DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS combo_components jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS combo_savings numeric(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS thumbnail_url text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS meta_title text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS meta_description text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS priority int DEFAULT 999;

-- ============================================================================
-- SECTION 6: INDEXES FOR FILTER PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON public.products(subcategory);
CREATE INDEX IF NOT EXISTS idx_products_suspension_type ON public.products(suspension_type);
CREATE INDEX IF NOT EXISTS idx_products_tire_type ON public.products(tire_type);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_wheel_brand ON public.products(wheel_brand);
CREATE INDEX IF NOT EXISTS idx_products_tire_brand ON public.products(tire_brand);
CREATE INDEX IF NOT EXISTS idx_products_lift_brand ON public.products(lift_brand);
CREATE INDEX IF NOT EXISTS idx_products_wheel_diameter ON public.products(wheel_diameter);
CREATE INDEX IF NOT EXISTS idx_products_wheel_width ON public.products(wheel_width);
CREATE INDEX IF NOT EXISTS idx_products_wheel_offset ON public.products(wheel_offset);
CREATE INDEX IF NOT EXISTS idx_products_bolt_pattern ON public.products(bolt_pattern);
CREATE INDEX IF NOT EXISTS idx_products_wheel_finish ON public.products(wheel_finish);
CREATE INDEX IF NOT EXISTS idx_products_material ON public.products(material);
CREATE INDEX IF NOT EXISTS idx_products_weight ON public.products(weight);
CREATE INDEX IF NOT EXISTS idx_products_tire_size ON public.products(tire_size);
CREATE INDEX IF NOT EXISTS idx_products_rim_diameter ON public.products(rim_diameter);
CREATE INDEX IF NOT EXISTS idx_products_lift_height ON public.products(lift_height);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_on_sale ON public.products(on_sale) WHERE on_sale = true;
CREATE INDEX IF NOT EXISTS idx_products_free_shipping ON public.products(free_shipping) WHERE free_shipping = true;
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_vehicle_compatibility ON public.products USING gin(vehicle_compatibility);
CREATE INDEX IF NOT EXISTS idx_products_tags ON public.products USING gin(product_tags);
CREATE INDEX IF NOT EXISTS idx_products_category_brand ON public.products(category, brand);
CREATE INDEX IF NOT EXISTS idx_products_wheel_specs ON public.products(wheel_diameter, wheel_width, bolt_pattern);
CREATE INDEX IF NOT EXISTS idx_products_category_price ON public.products(category, price);

-- ============================================================================
-- SECTION 7: FITMENT PREFERENCES TABLE
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

ALTER TABLE public.fitment_preferences ENABLE ROW LEVEL SECURITY;

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
-- DONE
-- ============================================================================

COMMENT ON TABLE public.products IS 'Products table with comprehensive columns for wheels, tires, suspension filtering';
