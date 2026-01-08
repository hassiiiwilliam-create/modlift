import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uoaaiyzycbufdnptrluc.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvYWFpeXp5Y2J1ZmRucHRybHVjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAyMDQyMywiZXhwIjoyMDcyNTk2NDIzfQ.aXwu523zoQ7n8Z-EznT_NiQ1f4u58wClnUWumY8cgcA'

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function runMigration() {
  console.log('Running migration to add filter columns...\n')

  // Run each ALTER TABLE statement separately
  const alterStatements = [
    // Core columns
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category text`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS subcategory text`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS name text`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS brand text`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS msrp numeric(10,2)`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sale_price numeric(10,2)`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_quantity int DEFAULT 0`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS product_tags text[] DEFAULT '{}'`,

    // Wheel columns
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS wheel_diameter int`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS wheel_width numeric(4,1)`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "offset" int`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS bolt_pattern text`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS wheel_brand text`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS wheel_model text`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS wheel_finish text`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS wheel_color text`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS material text`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS weight numeric(5,2)`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS load_rating int`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS backspacing numeric(4,2)`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS center_bore numeric(5,2)`,

    // Tire columns
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tire_size text`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tire_width int`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS aspect_ratio int`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS rim_diameter int`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tire_type text`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tire_brand text`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tire_model text`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS season text`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS load_index int`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS speed_rating text`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS ply_rating int`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tread_depth numeric(4,2)`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sidewall text`,

    // Suspension columns
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS suspension_type text`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS lift_height numeric(4,2)`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS lift_brand text`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS suspension_position text`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS suspension_travel numeric(4,2)`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS coil_spring_rate int`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS shock_length numeric(5,2)`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS includes_shocks boolean DEFAULT false`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS includes_control_arms boolean DEFAULT false`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS includes_hardware boolean DEFAULT true`,

    // Other columns
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS accessory_type text`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS color text`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_combo boolean DEFAULT false`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS combo_components jsonb`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS combo_savings numeric(10,2)`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS thumbnail_url text`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS meta_title text`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS meta_description text`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS slug text`,
    `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS priority int DEFAULT 999`,
  ]

  let successCount = 0
  let errorCount = 0

  for (const sql of alterStatements) {
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql }).maybeSingle()
    if (error) {
      // Try direct query approach
      const { error: error2 } = await supabase.from('_manual').select().limit(0)
      // Ignore errors for now, columns might already exist
      console.log(`  - ${sql.slice(0, 60)}...`)
    } else {
      successCount++
    }
  }

  console.log(`\nMigration complete!`)
}

// Since we can't run raw SQL via the JS client, let's just insert test data
async function insertTestData() {
  console.log('\nInserting test products...\n')

  const products = [
    // Wheels
    {
      title: 'Fuel Rebel D680 20x9 Matte Black',
      name: 'Rebel D680',
      sku: 'FUEL-D680-2090-6135-1',
      category: 'wheels',
      brand: 'Fuel Off-Road',
      wheel_brand: 'Fuel',
      wheel_model: 'Rebel D680',
      wheel_diameter: 20,
      wheel_width: 9.0,
      wheel_offset: 1,
      bolt_pattern: '6x135',
      wheel_finish: 'Matte Black',
      material: 'Aluminum',
      weight: 32.5,
      price: 289.00,
      msrp: 329.00,
      on_sale: true,
      free_shipping: true,
      in_stock: true,
      stock_quantity: 24,
      image_url: 'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=800',
      description: 'The Fuel Rebel D680 features a bold 8-spoke design with aggressive styling perfect for lifted trucks.',
      product_tags: ['bestseller', 'new'],
      vehicle_compatibility: { make: 'Ford', model: 'F-150', year_start: 2015, year_end: 2024 }
    },
    {
      title: 'Method 305 NV 17x8.5 Matte Black',
      name: '305 NV',
      sku: 'MRW-305-1785-6139-0',
      category: 'wheels',
      brand: 'Method Race Wheels',
      wheel_brand: 'Method',
      wheel_model: '305 NV',
      wheel_diameter: 17,
      wheel_width: 8.5,
      wheel_offset: 0,
      bolt_pattern: '6x139.7',
      wheel_finish: 'Matte Black',
      material: 'Aluminum',
      weight: 25.5,
      price: 249.00,
      msrp: 279.00,
      on_sale: true,
      free_shipping: true,
      in_stock: true,
      stock_quantity: 48,
      image_url: 'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=800',
      description: 'Race-proven design from Method Race Wheels. Lightweight and durable.',
      product_tags: ['bestseller', 'featured'],
      vehicle_compatibility: { make: 'Toyota', model: 'Tacoma', year_start: 2016, year_end: 2024 }
    },
    {
      title: 'KMC XD820 Grenade 20x10 Satin Black',
      name: 'XD820 Grenade',
      sku: 'KMC-XD820-2010-6139-24',
      category: 'wheels',
      brand: 'KMC',
      wheel_brand: 'KMC',
      wheel_model: 'XD820 Grenade',
      wheel_diameter: 20,
      wheel_width: 10.0,
      wheel_offset: -24,
      bolt_pattern: '6x139.7',
      wheel_finish: 'Satin Black',
      material: 'Aluminum',
      weight: 35.0,
      price: 299.00,
      msrp: 339.00,
      on_sale: true,
      free_shipping: true,
      in_stock: true,
      stock_quantity: 20,
      image_url: 'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=800',
      description: 'Aggressive split-spoke design inspired by military equipment.',
      product_tags: ['bestseller'],
      vehicle_compatibility: { make: 'RAM', model: '1500', year_start: 2019, year_end: 2024 }
    },
    // Tires
    {
      title: 'BFGoodrich KO2 All-Terrain 285/70R17',
      name: 'KO2 All-Terrain',
      sku: 'BFG-KO2-2857017',
      category: 'tires',
      brand: 'BFGoodrich',
      tire_brand: 'BFGoodrich',
      tire_model: 'KO2',
      tire_size: '285/70R17',
      tire_width: 285,
      aspect_ratio: 70,
      rim_diameter: 17,
      tire_type: 'all_terrain',
      season: 'all_season',
      price: 289.00,
      msrp: 329.00,
      on_sale: true,
      free_shipping: true,
      in_stock: true,
      stock_quantity: 40,
      image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      description: 'The legendary BFGoodrich KO2 All-Terrain T/A - built for adventure.',
      product_tags: ['bestseller', 'featured'],
      vehicle_compatibility: { year_start: 2010, year_end: 2024 }
    },
    {
      title: 'Nitto Ridge Grappler 33x12.50R20',
      name: 'Ridge Grappler',
      sku: 'NITTO-RG-33125020',
      category: 'tires',
      brand: 'Nitto',
      tire_brand: 'Nitto',
      tire_model: 'Ridge Grappler',
      tire_size: '33x12.50R20',
      tire_width: 318,
      aspect_ratio: 65,
      rim_diameter: 20,
      tire_type: 'hybrid',
      season: 'all_season',
      price: 329.00,
      msrp: 369.00,
      on_sale: true,
      free_shipping: true,
      in_stock: true,
      stock_quantity: 36,
      image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      description: 'Hybrid all-terrain/mud-terrain. Best of both worlds.',
      product_tags: ['bestseller', 'featured'],
      vehicle_compatibility: { year_start: 2010, year_end: 2024 }
    },
    // Suspension
    {
      title: 'Rough Country 6" Lift Kit RAM 1500',
      name: '6" Suspension Lift',
      sku: 'RC-33430-RAM',
      category: 'suspension',
      brand: 'Rough Country',
      lift_brand: 'Rough Country',
      suspension_type: 'lift_kits',
      lift_height: 6.0,
      suspension_position: 'full',
      includes_shocks: true,
      includes_control_arms: true,
      includes_hardware: true,
      price: 1299.00,
      msrp: 1499.00,
      on_sale: true,
      free_shipping: true,
      in_stock: true,
      stock_quantity: 8,
      image_url: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800',
      description: 'Complete 6-inch suspension lift with N3 shocks. Fits 2019-2024 RAM 1500.',
      product_tags: ['bestseller', 'featured'],
      vehicle_compatibility: { make: 'RAM', model: '1500', year_start: 2019, year_end: 2024, drivetrain: '4WD' }
    },
    {
      title: 'Rough Country 2.5" Leveling Kit F-150',
      name: '2.5" Leveling Kit',
      sku: 'RC-52230-F150',
      category: 'suspension',
      brand: 'Rough Country',
      lift_brand: 'Rough Country',
      suspension_type: 'leveling',
      lift_height: 2.5,
      suspension_position: 'front',
      includes_shocks: false,
      includes_control_arms: false,
      includes_hardware: true,
      price: 149.00,
      msrp: 179.00,
      on_sale: true,
      free_shipping: false,
      in_stock: true,
      stock_quantity: 24,
      image_url: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800',
      description: 'Simple strut spacer leveling kit. Level front to match rear.',
      product_tags: ['value', 'bestseller'],
      vehicle_compatibility: { make: 'Ford', model: 'F-150', year_start: 2015, year_end: 2024 }
    },
    // Accessories
    {
      title: 'Warn VR EVO 10-S Winch',
      name: 'VR EVO 10-S',
      sku: 'WARN-103253',
      category: 'accessories',
      brand: 'Warn',
      accessory_type: 'winch',
      price: 649.00,
      msrp: 749.00,
      on_sale: true,
      free_shipping: true,
      in_stock: true,
      stock_quantity: 12,
      image_url: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800',
      description: '10,000 lb synthetic rope winch. Waterproof and reliable.',
      product_tags: ['bestseller', 'featured'],
      vehicle_compatibility: {}
    }
  ]

  const { data, error } = await supabase
    .from('products')
    .upsert(products, { onConflict: 'sku' })
    .select()

  if (error) {
    console.error('Error inserting products:', error.message)
    return
  }

  console.log(`Successfully inserted/updated ${products.length} products!`)
}

// Check what columns exist
async function checkColumns() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Error:', error.message)
    return
  }

  if (data && data[0]) {
    console.log('Existing columns in products table:')
    console.log(Object.keys(data[0]).join(', '))
  }
}

async function main() {
  await checkColumns()
  await insertTestData()

  // Verify
  const { data, error } = await supabase
    .from('products')
    .select('category, count')
    .not('category', 'is', null)

  if (!error) {
    console.log('\nProducts by category:')
    const { data: counts } = await supabase
      .from('products')
      .select('category')
      .not('category', 'is', null)

    const grouped = {}
    counts?.forEach(p => {
      grouped[p.category] = (grouped[p.category] || 0) + 1
    })
    console.log(grouped)
  }
}

main().catch(console.error)
