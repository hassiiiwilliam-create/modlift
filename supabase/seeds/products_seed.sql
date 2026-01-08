-- ============================================================================
-- ModLift Products Seed Data
-- Real product data for wheels, tires, suspension, and accessories
-- ============================================================================

-- Clear existing products (optional - comment out if you want to keep existing)
-- TRUNCATE public.products RESTART IDENTITY CASCADE;

-- ============================================================================
-- WHEELS - Premium Aftermarket Wheels
-- ============================================================================

INSERT INTO public.products (
  title, name, sku, category, brand, wheel_brand, wheel_model,
  wheel_diameter, wheel_width, "offset", bolt_pattern,
  wheel_finish, material, weight, load_rating, center_bore,
  price, msrp, on_sale, free_shipping, in_stock, stock_quantity,
  image_url, description, product_tags, vehicle_compatibility
) VALUES

-- Fuel Off-Road Wheels
('Fuel Rebel D680 20x9 Matte Black', 'Rebel D680', 'FUEL-D680-2090-6135-1', 'wheels', 'Fuel Off-Road', 'Fuel', 'Rebel D680',
  20, 9.0, 1, '6x135',
  'Matte Black', 'Aluminum', 32.5, 3500, 87.1,
  289.00, 329.00, true, true, true, 24,
  'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=800',
  'The Fuel Rebel D680 features a bold 8-spoke design with aggressive styling perfect for lifted trucks.',
  ARRAY['bestseller', 'new'],
  '{"make": "Ford", "model": "F-150", "year_start": 2015, "year_end": 2024}'::jsonb
),

('Fuel Rebel D680 20x10 Bronze', 'Rebel D680', 'FUEL-D680-2010-6139-12', 'wheels', 'Fuel Off-Road', 'Fuel', 'Rebel D680',
  20, 10.0, -12, '6x139.7',
  'Matte Bronze', 'Aluminum', 34.2, 3500, 106.1,
  309.00, 349.00, true, true, true, 18,
  'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=800',
  'The Fuel Rebel D680 in stunning matte bronze finish for GM trucks.',
  ARRAY['featured'],
  '{"make": "Chevrolet", "model": "Silverado 1500", "year_start": 2019, "year_end": 2024, "drivetrain": "4WD"}'::jsonb
),

('Fuel Maverick D538 22x10 Black Milled', 'Maverick D538', 'FUEL-D538-2210-8170-44', 'wheels', 'Fuel Off-Road', 'Fuel', 'Maverick D538',
  22, 10.0, -44, '8x170',
  'Black Milled', 'Aluminum', 38.5, 3750, 125.1,
  359.00, 399.00, true, true, true, 12,
  'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=800',
  'Aggressive 8-spoke design with milled accents. Perfect for Super Duty trucks.',
  ARRAY['bestseller'],
  '{"make": "Ford", "model": "F-250", "year_start": 2017, "year_end": 2024}'::jsonb
),

('Fuel Triton D609 18x9 Gunmetal', 'Triton D609', 'FUEL-D609-1809-5150-12', 'wheels', 'Fuel Off-Road', 'Fuel', 'Triton D609',
  18, 9.0, -12, '5x150',
  'Gunmetal', 'Aluminum', 28.8, 3500, 110.1,
  269.00, 299.00, true, false, true, 32,
  'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=800',
  'Classic 6-spoke design in gunmetal finish for Toyota trucks.',
  ARRAY['value'],
  '{"make": "Toyota", "model": "Tundra", "year_start": 2014, "year_end": 2024}'::jsonb
),

-- Method Race Wheels
('Method 305 NV 17x8.5 Matte Black', '305 NV', 'MRW-305-1785-6139-0', 'wheels', 'Method Race Wheels', 'Method', '305 NV',
  17, 8.5, 0, '6x139.7',
  'Matte Black', 'Aluminum', 25.5, 3200, 106.1,
  249.00, 279.00, true, true, true, 48,
  'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=800',
  'Race-proven design from Method Race Wheels. Lightweight and durable.',
  ARRAY['bestseller', 'featured'],
  '{"make": "Toyota", "model": "Tacoma", "year_start": 2016, "year_end": 2024}'::jsonb
),

('Method 701 Trail 17x8.5 Bronze', '701 Trail', 'MRW-701-1785-5127-30', 'wheels', 'Method Race Wheels', 'Method', '701 Trail',
  17, 8.5, -30, '5x127',
  'Satin Bronze', 'Aluminum', 24.8, 2800, 71.5,
  279.00, 319.00, true, true, true, 28,
  'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=800',
  'Classic beadlock styling with street-legal design for Jeep Wrangler.',
  ARRAY['new'],
  '{"make": "Jeep", "model": "Wrangler", "year_start": 2018, "year_end": 2024, "drivetrain": "4WD"}'::jsonb
),

('Method 312 20x9 Machined', '312', 'MRW-312-2009-6135-18', 'wheels', 'Method Race Wheels', 'Method', '312',
  20, 9.0, 18, '6x135',
  'Machined Black', 'Aluminum', 31.2, 3500, 87.1,
  329.00, 369.00, true, true, true, 16,
  'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=800',
  'Clean mesh design with machined lip and black center.',
  ARRAY['featured'],
  '{"make": "Ford", "model": "F-150", "year_start": 2015, "year_end": 2024}'::jsonb
),

-- KMC Wheels
('KMC XD820 Grenade 20x10 Satin Black', 'XD820 Grenade', 'KMC-XD820-2010-6139-24', 'wheels', 'KMC', 'KMC', 'XD820 Grenade',
  20, 10.0, -24, '6x139.7',
  'Satin Black', 'Aluminum', 35.0, 3500, 106.1,
  299.00, 339.00, true, true, true, 20,
  'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=800',
  'Aggressive split-spoke design inspired by military equipment.',
  ARRAY['bestseller'],
  '{"make": "RAM", "model": "1500", "year_start": 2019, "year_end": 2024}'::jsonb
),

('KMC XD827 Rockstar III 18x9 Black', 'XD827 Rockstar III', 'KMC-XD827-1809-6120-12', 'wheels', 'KMC', 'KMC', 'XD827 Rockstar III',
  18, 9.0, -12, '6x120',
  'Satin Black', 'Aluminum', 29.5, 3200, 66.9,
  279.00, 309.00, true, false, true, 22,
  'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=800',
  'The iconic Rockstar design, now in its third generation.',
  ARRAY['featured'],
  '{"make": "Chevrolet", "model": "Colorado", "year_start": 2015, "year_end": 2024}'::jsonb
),

-- Vision Wheels
('Vision 361 Spyder 17x9 Matte Black', '361 Spyder', 'VIS-361-1709-5139-12', 'wheels', 'Vision', 'Vision', '361 Spyder',
  17, 9.0, -12, '5x139.7',
  'Matte Black', 'Aluminum', 27.0, 3000, 108.0,
  169.00, 199.00, true, false, true, 36,
  'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=800',
  'Budget-friendly wheel with aggressive off-road styling.',
  ARRAY['value', 'bestseller'],
  '{"make": "RAM", "model": "1500", "year_start": 2012, "year_end": 2018}'::jsonb
),

('Vision 399 Fury 20x9 Gloss Black', '399 Fury', 'VIS-399-2009-6135-12', 'wheels', 'Vision', 'Vision', '399 Fury',
  20, 9.0, -12, '6x135',
  'Gloss Black Machined', 'Aluminum', 32.0, 3400, 87.1,
  189.00, 229.00, true, true, true, 28,
  'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=800',
  'Stylish split-spoke design at an affordable price.',
  ARRAY['value'],
  '{"make": "Ford", "model": "F-150", "year_start": 2015, "year_end": 2024}'::jsonb
),

-- Moto Metal Wheels
('Moto Metal MO970 22x10 Black Milled', 'MO970', 'MM-MO970-2210-8165-18', 'wheels', 'Moto Metal', 'Moto Metal', 'MO970',
  22, 10.0, -18, '8x165.1',
  'Gloss Black Milled', 'Aluminum', 39.0, 3750, 125.1,
  319.00, 369.00, true, true, true, 14,
  'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=800',
  'Bold 8-spoke design for heavy-duty trucks.',
  ARRAY['featured'],
  '{"make": "RAM", "model": "2500", "year_start": 2014, "year_end": 2024}'::jsonb
),

('Moto Metal MO962 20x12 Chrome', 'MO962', 'MM-MO962-2012-6139-44', 'wheels', 'Moto Metal', 'Moto Metal', 'MO962',
  20, 12.0, -44, '6x139.7',
  'Chrome', 'Aluminum', 42.0, 3500, 106.1,
  449.00, 499.00, false, true, true, 8,
  'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=800',
  'Deep lip chrome wheel for maximum bling.',
  ARRAY['new'],
  '{"make": "Chevrolet", "model": "Silverado 1500", "year_start": 2019, "year_end": 2024}'::jsonb
),

-- American Force Wheels (Forged)
('American Force Blade SS8 22x12 Polished', 'Blade SS8', 'AF-BLADE-2212-8170-40', 'wheels', 'American Force', 'American Force', 'Blade SS8',
  22, 12.0, -40, '8x170',
  'Polished', 'Forged Aluminum', 28.5, 4500, 125.1,
  899.00, 999.00, true, true, true, 6,
  'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=800',
  'Premium forged wheel, lightweight and strong.',
  ARRAY['premium', 'featured'],
  '{"make": "Ford", "model": "F-350", "year_start": 2017, "year_end": 2024}'::jsonb
),

-- ============================================================================
-- TIRES - Premium Off-Road and All-Terrain
-- ============================================================================

-- BFGoodrich
('BFGoodrich KO2 All-Terrain 285/70R17', 'KO2 All-Terrain', 'BFG-KO2-2857017', 'tires', 'BFGoodrich', 'BFGoodrich', 'KO2 All-Terrain',
  NULL, NULL, NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  289.00, 329.00, true, true, true, 40,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  'The legendary BFGoodrich KO2 All-Terrain T/A - built for adventure.',
  ARRAY['bestseller', 'featured'],
  '{"year_start": 2010, "year_end": 2024}'::jsonb
)
ON CONFLICT DO NOTHING;

UPDATE public.products SET
  tire_size = '285/70R17',
  tire_width = 285,
  aspect_ratio = 70,
  rim_diameter = 17,
  tire_type = 'all_terrain',
  tire_brand = 'BFGoodrich',
  tire_model = 'KO2',
  load_index = 121,
  speed_rating = 'S',
  ply_rating = 10,
  season = 'all_season',
  sidewall = 'Black Letter'
WHERE sku = 'BFG-KO2-2857017';

INSERT INTO public.products (
  title, name, sku, category, brand, price, msrp, on_sale, free_shipping, in_stock, stock_quantity,
  tire_size, tire_width, aspect_ratio, rim_diameter, tire_type, tire_brand, tire_model,
  load_index, speed_rating, ply_rating, season, sidewall,
  image_url, description, product_tags, vehicle_compatibility
) VALUES

('BFGoodrich KO2 All-Terrain 35x12.50R20', 'KO2 All-Terrain', 'BFG-KO2-35125020', 'tires', 'BFGoodrich',
  349.00, 389.00, true, true, true, 32,
  '35x12.50R20', 318, 70, 20, 'all_terrain', 'BFGoodrich', 'KO2',
  121, 'S', 10, 'all_season', 'Black Letter',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  '35-inch KO2 for lifted trucks. Aggressive tread, quiet on-road.',
  ARRAY['bestseller'],
  '{"year_start": 2010, "year_end": 2024}'::jsonb
),

('BFGoodrich KO2 All-Terrain 315/70R17', 'KO2 All-Terrain', 'BFG-KO2-3157017', 'tires', 'BFGoodrich',
  309.00, 349.00, true, true, true, 28,
  '315/70R17', 315, 70, 17, 'all_terrain', 'BFGoodrich', 'KO2',
  121, 'S', 10, 'all_season', 'Black Letter',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  '34-inch equivalent size for aggressive stance without big lift.',
  ARRAY['featured'],
  '{"year_start": 2010, "year_end": 2024}'::jsonb
),

-- Nitto Tires
('Nitto Ridge Grappler 33x12.50R20', 'Ridge Grappler', 'NITTO-RG-33125020', 'tires', 'Nitto',
  329.00, 369.00, true, true, true, 36,
  '33x12.50R20', 318, 65, 20, 'hybrid', 'Nitto', 'Ridge Grappler',
  119, 'S', 10, 'all_season', 'Black Letter',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  'Hybrid all-terrain/mud-terrain. Best of both worlds.',
  ARRAY['bestseller', 'featured'],
  '{"year_start": 2010, "year_end": 2024}'::jsonb
),

('Nitto Ridge Grappler 35x12.50R22', 'Ridge Grappler', 'NITTO-RG-35125022', 'tires', 'Nitto',
  399.00, 449.00, true, true, true, 24,
  '35x12.50R22', 318, 65, 22, 'hybrid', 'Nitto', 'Ridge Grappler',
  121, 'S', 10, 'all_season', 'Black Letter',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  '35x22 for the big wheel crowd. Aggressive looks, smooth ride.',
  ARRAY['new'],
  '{"year_start": 2010, "year_end": 2024}'::jsonb
),

('Nitto Trail Grappler M/T 37x12.50R17', 'Trail Grappler', 'NITTO-TG-37125017', 'tires', 'Nitto',
  429.00, 479.00, true, true, true, 16,
  '37x12.50R17', 318, 70, 17, 'mud_terrain', 'Nitto', 'Trail Grappler',
  124, 'Q', 10, 'all_season', 'Black Letter',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  'The ultimate mud terrain. Aggressive tread, street manners.',
  ARRAY['featured'],
  '{"year_start": 2010, "year_end": 2024}'::jsonb
),

-- Toyo Tires
('Toyo Open Country A/T III 265/70R17', 'Open Country A/T III', 'TOYO-ATIII-2657017', 'tires', 'Toyo',
  219.00, 249.00, true, true, true, 48,
  '265/70R17', 265, 70, 17, 'all_terrain', 'Toyo', 'Open Country A/T III',
  115, 'T', 10, 'all_season', 'Black Letter',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  'All-weather capable all-terrain with 3-peak mountain snowflake rating.',
  ARRAY['value', 'bestseller'],
  '{"year_start": 2010, "year_end": 2024}'::jsonb
),

('Toyo Open Country M/T 35x12.50R18', 'Open Country M/T', 'TOYO-MT-35125018', 'tires', 'Toyo',
  369.00, 409.00, true, true, true, 20,
  '35x12.50R18', 318, 70, 18, 'mud_terrain', 'Toyo', 'Open Country M/T',
  121, 'Q', 10, 'all_season', 'Black Letter',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  'Aggressive mud terrain for serious off-roaders.',
  ARRAY['featured'],
  '{"year_start": 2010, "year_end": 2024}'::jsonb
),

-- Falken Tires
('Falken Wildpeak A/T3W 275/70R18', 'Wildpeak A/T3W', 'FALKEN-AT3W-2757018', 'tires', 'Falken',
  199.00, 229.00, true, true, true, 52,
  '275/70R18', 275, 70, 18, 'all_terrain', 'Falken', 'Wildpeak A/T3W',
  116, 'T', 10, 'all_season', 'Black Letter',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  'Excellent value all-terrain with great wet and snow performance.',
  ARRAY['value', 'bestseller'],
  '{"year_start": 2010, "year_end": 2024}'::jsonb
),

-- Cooper Tires
('Cooper Discoverer STT Pro 35x12.50R17', 'Discoverer STT Pro', 'COOPER-STT-35125017', 'tires', 'Cooper',
  339.00, 379.00, true, true, true, 24,
  '35x12.50R17', 318, 70, 17, 'mud_terrain', 'Cooper', 'Discoverer STT Pro',
  121, 'Q', 10, 'all_season', 'Black Letter',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  'Armor-Tek3 construction for extreme durability.',
  ARRAY['featured'],
  '{"year_start": 2010, "year_end": 2024}'::jsonb
),

-- Mickey Thompson
('Mickey Thompson Baja Boss A/T 33x12.50R20', 'Baja Boss A/T', 'MT-BAJAAT-33125020', 'tires', 'Mickey Thompson',
  359.00, 399.00, true, true, true, 18,
  '33x12.50R20', 318, 65, 20, 'all_terrain', 'Mickey Thompson', 'Baja Boss A/T',
  119, 'S', 10, 'all_season', 'Black Letter',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  'Race-proven technology in an all-terrain package.',
  ARRAY['premium', 'new'],
  '{"year_start": 2010, "year_end": 2024}'::jsonb
),

-- ============================================================================
-- SUSPENSION - Lift Kits, Leveling, Coilovers
-- ============================================================================

-- Rough Country
('Rough Country 6" Lift Kit RAM 1500', '6" Suspension Lift', 'RC-33430-RAM', 'suspension', 'Rough Country', 'Rough Country', NULL,
  NULL, NULL, NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  1299.00, 1499.00, true, true, true, 8,
  'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800',
  'Complete 6-inch suspension lift with N3 shocks. Fits 2019-2024 RAM 1500.',
  ARRAY['bestseller', 'featured'],
  '{"make": "RAM", "model": "1500", "year_start": 2019, "year_end": 2024, "drivetrain": "4WD"}'::jsonb
)
ON CONFLICT DO NOTHING;

UPDATE public.products SET
  suspension_type = 'lift_kits',
  lift_height = 6.0,
  lift_brand = 'Rough Country',
  suspension_position = 'full',
  includes_shocks = true,
  includes_control_arms = true,
  includes_hardware = true
WHERE sku = 'RC-33430-RAM';

INSERT INTO public.products (
  title, name, sku, category, brand, price, msrp, on_sale, free_shipping, in_stock, stock_quantity,
  suspension_type, lift_height, lift_brand, suspension_position,
  includes_shocks, includes_control_arms, includes_hardware,
  image_url, description, product_tags, vehicle_compatibility
) VALUES

('Rough Country 4" Lift Kit Silverado', '4" Suspension Lift', 'RC-27531-SILV', 'suspension', 'Rough Country',
  999.00, 1199.00, true, true, true, 12,
  'lift_kits', 4.0, 'Rough Country', 'full',
  true, false, true,
  'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800',
  'Complete 4-inch lift with N3 shocks for Silverado 1500.',
  ARRAY['bestseller'],
  '{"make": "Chevrolet", "model": "Silverado 1500", "year_start": 2019, "year_end": 2024, "drivetrain": "4WD"}'::jsonb
),

('Rough Country 2.5" Leveling Kit F-150', '2.5" Leveling Kit', 'RC-52230-F150', 'suspension', 'Rough Country',
  149.00, 179.00, true, false, true, 24,
  'leveling', 2.5, 'Rough Country', 'front',
  false, false, true,
  'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800',
  'Simple strut spacer leveling kit. Level front to match rear.',
  ARRAY['value', 'bestseller'],
  '{"make": "Ford", "model": "F-150", "year_start": 2015, "year_end": 2024}'::jsonb
),

-- BDS Suspension
('BDS 6" Suspension Lift F-250 Super Duty', '6" Suspension Lift', 'BDS-1527H-F250', 'suspension', 'BDS Suspension',
  2499.00, 2799.00, true, true, true, 6,
  'lift_kits', 6.0, 'BDS', 'full',
  true, true, true,
  'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800',
  'Premium BDS lift with Fox 2.0 shocks. Built for Super Duty.',
  ARRAY['premium', 'featured'],
  '{"make": "Ford", "model": "F-250", "year_start": 2017, "year_end": 2024, "drivetrain": "4WD"}'::jsonb
),

('BDS 4" Lift Kit Tacoma', '4" Suspension Lift', 'BDS-815H-TAC', 'suspension', 'BDS Suspension',
  1799.00, 1999.00, true, true, true, 8,
  'lift_kits', 4.0, 'BDS', 'full',
  true, true, true,
  'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800',
  'Complete BDS lift for Toyota Tacoma with NX2 shocks.',
  ARRAY['featured'],
  '{"make": "Toyota", "model": "Tacoma", "year_start": 2016, "year_end": 2024, "drivetrain": "4WD"}'::jsonb
),

-- Fox Shocks/Coilovers
('Fox 2.5 Factory Race Series Coilovers Tacoma', '2.5 Factory Race Coilovers', 'FOX-883-02-121-TAC', 'suspension', 'Fox',
  1899.00, 2099.00, true, true, true, 6,
  'coilovers', 2.5, 'Fox', 'front',
  true, false, true,
  'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800',
  'Factory Race Series coilovers with remote reservoir. 0-3" lift.',
  ARRAY['premium', 'featured'],
  '{"make": "Toyota", "model": "Tacoma", "year_start": 2016, "year_end": 2024}'::jsonb
),

('Fox 2.0 Performance Series IFP Shocks F-150', '2.0 Performance IFP', 'FOX-985-24-185-F150', 'suspension', 'Fox',
  649.00, 749.00, true, true, true, 16,
  'shocks_struts', 0, 'Fox', 'full',
  true, false, false,
  'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800',
  'Set of 4 Fox 2.0 IFP shocks for stock height or 0-2" lift.',
  ARRAY['bestseller'],
  '{"make": "Ford", "model": "F-150", "year_start": 2015, "year_end": 2024}'::jsonb
),

-- Icon Vehicle Dynamics
('Icon Stage 2 Suspension System 4Runner', 'Stage 2 Suspension', 'ICON-K53172-4RUN', 'suspension', 'Icon Vehicle Dynamics',
  2899.00, 3199.00, true, true, true, 4,
  'coilovers', 3.0, 'Icon', 'full',
  true, true, true,
  'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800',
  'Complete Stage 2 system with extended travel coilovers and rear shocks.',
  ARRAY['premium', 'featured'],
  '{"make": "Toyota", "model": "4Runner", "year_start": 2010, "year_end": 2024}'::jsonb
),

-- Air Lift
('Air Lift LoadLifter 5000 RAM 1500', 'LoadLifter 5000', 'AIRLIFT-57275-RAM', 'suspension', 'Air Lift',
  449.00, 499.00, true, true, true, 14,
  'air_suspension', 0, 'Air Lift', 'rear',
  false, false, true,
  'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800',
  'Adjustable air springs for load leveling and towing support.',
  ARRAY['featured'],
  '{"make": "RAM", "model": "1500", "year_start": 2019, "year_end": 2024}'::jsonb
),

-- Belltech (Lowering)
('Belltech 2"/4" Lowering Kit Silverado', '2/4 Lowering Kit', 'BELL-1019SP-SILV', 'suspension', 'Belltech',
  1099.00, 1299.00, true, true, true, 6,
  'lowering', -3.0, 'Belltech', 'full',
  true, false, true,
  'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800',
  '2" front / 4" rear drop with Street Performance shocks.',
  ARRAY['featured'],
  '{"make": "Chevrolet", "model": "Silverado 1500", "year_start": 2019, "year_end": 2024, "drivetrain": "RWD"}'::jsonb
),

-- Skyjacker
('Skyjacker 3" Body Lift Jeep Wrangler JK', '3" Body Lift', 'SKY-JK30-BODY', 'suspension', 'Skyjacker',
  399.00, 449.00, true, false, true, 10,
  'body_lift', 3.0, 'Skyjacker', 'full',
  false, false, true,
  'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800',
  '3-inch body lift for larger tires without suspension changes.',
  ARRAY['value'],
  '{"make": "Jeep", "model": "Wrangler JK", "year_start": 2007, "year_end": 2018, "drivetrain": "4WD"}'::jsonb
),

-- ============================================================================
-- ACCESSORIES
-- ============================================================================

('Warn VR EVO 10-S Winch', 'VR EVO 10-S', 'WARN-103253', 'accessories', 'Warn',
  649.00, 749.00, true, true, true, 12,
  NULL, NULL, NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800',
  '10,000 lb synthetic rope winch. Waterproof and reliable.',
  ARRAY['bestseller', 'featured'],
  '{}'::jsonb
),

('Rigid Industries 50" E-Series LED Light Bar', 'E-Series 50" LED', 'RIGID-150313', 'accessories', 'Rigid Industries',
  899.00, 999.00, true, true, true, 8,
  NULL, NULL, NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800',
  '50-inch combo beam LED bar. 37,000 lumens of light output.',
  ARRAY['premium', 'featured'],
  '{}'::jsonb
),

('Bushwacker Pocket Style Fender Flares F-150', 'Pocket Style Flares', 'BUSH-20945-02', 'accessories', 'Bushwacker',
  549.00, 599.00, true, true, true, 16,
  NULL, NULL, NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800',
  'OE-style pocket flares for extra tire coverage.',
  ARRAY['bestseller'],
  '{"make": "Ford", "model": "F-150", "year_start": 2015, "year_end": 2020}'::jsonb
),

('Fab Fours Vengeance Front Bumper RAM 1500', 'Vengeance Bumper', 'FABFOURS-DR19-V4952-1', 'accessories', 'Fab Fours',
  1599.00, 1799.00, true, true, true, 4,
  NULL, NULL, NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800',
  'Full-width steel bumper with winch mount and light provisions.',
  ARRAY['featured'],
  '{"make": "RAM", "model": "1500", "year_start": 2019, "year_end": 2024}'::jsonb
);

-- Update accessory types
UPDATE public.products SET accessory_type = 'winch' WHERE sku = 'WARN-103253';
UPDATE public.products SET accessory_type = 'lighting' WHERE sku = 'RIGID-150313';
UPDATE public.products SET accessory_type = 'fender_flares' WHERE sku = 'BUSH-20945-02';
UPDATE public.products SET accessory_type = 'bumper' WHERE sku = 'FABFOURS-DR19-V4952-1';

-- ============================================================================
-- WHEEL + TIRE COMBOS
-- ============================================================================

INSERT INTO public.products (
  title, name, sku, category, brand, price, msrp, on_sale, free_shipping, in_stock, stock_quantity,
  wheel_diameter, wheel_width, "offset", bolt_pattern, wheel_brand, wheel_model, wheel_finish,
  tire_size, tire_type, tire_brand, tire_model,
  is_combo, combo_savings,
  image_url, description, product_tags, vehicle_compatibility
) VALUES

('Fuel Rebel + BFG KO2 20" Combo', 'Rebel + KO2 Combo', 'COMBO-FUEL-BFG-20', 'combo', 'Fuel Off-Road',
  2199.00, 2556.00, true, true, true, 8,
  20, 9.0, 1, '6x135', 'Fuel', 'Rebel D680', 'Matte Black',
  '33x12.50R20', 'all_terrain', 'BFGoodrich', 'KO2',
  true, 357.00,
  'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=800',
  'Complete 20" wheel and tire package. 4 Fuel Rebel wheels + 4 BFG KO2 tires mounted and balanced.',
  ARRAY['combo', 'bestseller', 'featured'],
  '{"make": "Ford", "model": "F-150", "year_start": 2015, "year_end": 2024}'::jsonb
),

('Method 305 + Nitto Ridge Grappler 17" Combo', 'Method 305 + Ridge Grappler', 'COMBO-METHOD-NITTO-17', 'combo', 'Method Race Wheels',
  1899.00, 2156.00, true, true, true, 6,
  17, 8.5, 0, '6x139.7', 'Method', '305 NV', 'Matte Black',
  '285/70R17', 'hybrid', 'Nitto', 'Ridge Grappler',
  true, 257.00,
  'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=800',
  'Complete 17" package for Tacoma/4Runner. Mounted, balanced, ready to bolt on.',
  ARRAY['combo', 'featured'],
  '{"make": "Toyota", "model": "Tacoma", "year_start": 2016, "year_end": 2024}'::jsonb
),

('KMC Grenade + Toyo Open Country 20" Combo', 'Grenade + Open Country', 'COMBO-KMC-TOYO-20', 'combo', 'KMC',
  1699.00, 1996.00, true, true, true, 10,
  20, 10.0, -24, '6x139.7', 'KMC', 'XD820 Grenade', 'Satin Black',
  '33x12.50R20', 'all_terrain', 'Toyo', 'Open Country A/T III',
  true, 297.00,
  'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=800',
  'Aggressive stance with reliable performance. 4 wheels + 4 tires.',
  ARRAY['combo', 'value', 'bestseller'],
  '{"make": "RAM", "model": "1500", "year_start": 2019, "year_end": 2024}'::jsonb
);

-- ============================================================================
-- Update timestamps
-- ============================================================================

UPDATE public.products SET updated_at = now() WHERE updated_at IS NULL;

-- ============================================================================
-- DONE - Verify the data
-- ============================================================================

-- SELECT category, count(*) FROM public.products GROUP BY category;
