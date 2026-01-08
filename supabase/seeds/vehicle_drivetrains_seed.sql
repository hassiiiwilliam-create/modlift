-- Vehicle Drivetrains Seed Data
-- Comprehensive drivetrain data for popular trucks and SUVs
-- Run this after the migration to populate the table

-- Clear existing data (optional, comment out if appending)
-- truncate table public.vehicle_drivetrains restart identity;

-- ============================================================================
-- RAM TRUCKS
-- ============================================================================

-- RAM 1500 (2019-2025) - 5th Gen
insert into public.vehicle_drivetrains (year_start, year_end, make, model, trim, drivetrain, drivetrain_label, is_default) values
-- Base trims available in RWD and 4WD
(2019, 2025, 'RAM', '1500', 'Tradesman', 'RWD', 'RWD (Rear Wheel)', false),
(2019, 2025, 'RAM', '1500', 'Tradesman', '4WD', '4WD (4x4)', true),
(2019, 2025, 'RAM', '1500', 'Big Horn', 'RWD', 'RWD (Rear Wheel)', false),
(2019, 2025, 'RAM', '1500', 'Big Horn', '4WD', '4WD (4x4)', true),
(2019, 2025, 'RAM', '1500', 'Lone Star', 'RWD', 'RWD (Rear Wheel)', false),
(2019, 2025, 'RAM', '1500', 'Lone Star', '4WD', '4WD (4x4)', true),
(2019, 2025, 'RAM', '1500', 'Laramie', 'RWD', 'RWD (Rear Wheel)', false),
(2019, 2025, 'RAM', '1500', 'Laramie', '4WD', '4WD (4x4)', true),
(2019, 2025, 'RAM', '1500', 'Longhorn', 'RWD', 'RWD (Rear Wheel)', false),
(2019, 2025, 'RAM', '1500', 'Longhorn', '4WD', '4WD (4x4)', true),
(2019, 2025, 'RAM', '1500', 'Limited', 'RWD', 'RWD (Rear Wheel)', false),
(2019, 2025, 'RAM', '1500', 'Limited', '4WD', '4WD (4x4)', true),
-- Rebel is 4WD only
(2019, 2025, 'RAM', '1500', 'Rebel', '4WD', '4WD (4x4)', true),
-- TRX is 4WD only (high-performance)
(2021, 2025, 'RAM', '1500', 'TRX', '4WD', '4WD (4x4)', true),
-- Generic RAM 1500 (all trims)
(2019, 2025, 'RAM', '1500', null, 'RWD', 'RWD (Rear Wheel)', false),
(2019, 2025, 'RAM', '1500', null, '4WD', '4WD (4x4)', true),

-- RAM 2500/3500 Heavy Duty
(2019, 2025, 'RAM', '2500', null, 'RWD', 'RWD (Rear Wheel)', false),
(2019, 2025, 'RAM', '2500', null, '4WD', '4WD (4x4)', true),
(2019, 2025, 'RAM', '3500', null, 'RWD', 'RWD (Rear Wheel)', false),
(2019, 2025, 'RAM', '3500', null, '4WD', '4WD (4x4)', true),

-- ============================================================================
-- CHEVROLET TRUCKS
-- ============================================================================

-- Silverado 1500 (2019-2025)
(2019, 2025, 'Chevrolet', 'Silverado 1500', 'Work Truck', 'RWD', 'RWD (Rear Wheel)', false),
(2019, 2025, 'Chevrolet', 'Silverado 1500', 'Work Truck', '4WD', '4WD (4x4)', true),
(2019, 2025, 'Chevrolet', 'Silverado 1500', 'WT', 'RWD', 'RWD (Rear Wheel)', false),
(2019, 2025, 'Chevrolet', 'Silverado 1500', 'WT', '4WD', '4WD (4x4)', true),
(2019, 2025, 'Chevrolet', 'Silverado 1500', 'Custom', 'RWD', 'RWD (Rear Wheel)', false),
(2019, 2025, 'Chevrolet', 'Silverado 1500', 'Custom', '4WD', '4WD (4x4)', true),
(2019, 2025, 'Chevrolet', 'Silverado 1500', 'LT', 'RWD', 'RWD (Rear Wheel)', false),
(2019, 2025, 'Chevrolet', 'Silverado 1500', 'LT', '4WD', '4WD (4x4)', true),
(2019, 2025, 'Chevrolet', 'Silverado 1500', 'RST', 'RWD', 'RWD (Rear Wheel)', false),
(2019, 2025, 'Chevrolet', 'Silverado 1500', 'RST', '4WD', '4WD (4x4)', true),
(2019, 2025, 'Chevrolet', 'Silverado 1500', 'LTZ', 'RWD', 'RWD (Rear Wheel)', false),
(2019, 2025, 'Chevrolet', 'Silverado 1500', 'LTZ', '4WD', '4WD (4x4)', true),
(2019, 2025, 'Chevrolet', 'Silverado 1500', 'High Country', 'RWD', 'RWD (Rear Wheel)', false),
(2019, 2025, 'Chevrolet', 'Silverado 1500', 'High Country', '4WD', '4WD (4x4)', true),
-- Trail Boss trims are 4WD only
(2019, 2025, 'Chevrolet', 'Silverado 1500', 'Custom Trail Boss', '4WD', '4WD (4x4)', true),
(2019, 2025, 'Chevrolet', 'Silverado 1500', 'LT Trail Boss', '4WD', '4WD (4x4)', true),
-- ZR2 is 4WD only
(2022, 2025, 'Chevrolet', 'Silverado 1500', 'ZR2', '4WD', '4WD (4x4)', true),
-- Generic Silverado 1500
(2019, 2025, 'Chevrolet', 'Silverado 1500', null, 'RWD', 'RWD (Rear Wheel)', false),
(2019, 2025, 'Chevrolet', 'Silverado 1500', null, '4WD', '4WD (4x4)', true),

-- Silverado 2500HD/3500HD
(2020, 2025, 'Chevrolet', 'Silverado 2500HD', null, 'RWD', 'RWD (Rear Wheel)', false),
(2020, 2025, 'Chevrolet', 'Silverado 2500HD', null, '4WD', '4WD (4x4)', true),
(2020, 2025, 'Chevrolet', 'Silverado 3500HD', null, 'RWD', 'RWD (Rear Wheel)', false),
(2020, 2025, 'Chevrolet', 'Silverado 3500HD', null, '4WD', '4WD (4x4)', true),

-- Colorado
(2015, 2025, 'Chevrolet', 'Colorado', null, 'RWD', 'RWD (Rear Wheel)', false),
(2015, 2025, 'Chevrolet', 'Colorado', null, '4WD', '4WD (4x4)', true),
(2023, 2025, 'Chevrolet', 'Colorado', 'ZR2', '4WD', '4WD (4x4)', true),
(2023, 2025, 'Chevrolet', 'Colorado', 'Trail Boss', '4WD', '4WD (4x4)', true),

-- ============================================================================
-- FORD TRUCKS
-- ============================================================================

-- F-150 (2021-2025 - 14th Gen)
(2021, 2025, 'Ford', 'F-150', 'XL', 'RWD', 'RWD (Rear Wheel)', false),
(2021, 2025, 'Ford', 'F-150', 'XL', '4WD', '4WD (4x4)', true),
(2021, 2025, 'Ford', 'F-150', 'STX', 'RWD', 'RWD (Rear Wheel)', false),
(2021, 2025, 'Ford', 'F-150', 'STX', '4WD', '4WD (4x4)', true),
(2021, 2025, 'Ford', 'F-150', 'XLT', 'RWD', 'RWD (Rear Wheel)', false),
(2021, 2025, 'Ford', 'F-150', 'XLT', '4WD', '4WD (4x4)', true),
(2021, 2025, 'Ford', 'F-150', 'Lariat', 'RWD', 'RWD (Rear Wheel)', false),
(2021, 2025, 'Ford', 'F-150', 'Lariat', '4WD', '4WD (4x4)', true),
(2021, 2025, 'Ford', 'F-150', 'King Ranch', 'RWD', 'RWD (Rear Wheel)', false),
(2021, 2025, 'Ford', 'F-150', 'King Ranch', '4WD', '4WD (4x4)', true),
(2021, 2025, 'Ford', 'F-150', 'Platinum', 'RWD', 'RWD (Rear Wheel)', false),
(2021, 2025, 'Ford', 'F-150', 'Platinum', '4WD', '4WD (4x4)', true),
(2021, 2025, 'Ford', 'F-150', 'Limited', 'RWD', 'RWD (Rear Wheel)', false),
(2021, 2025, 'Ford', 'F-150', 'Limited', '4WD', '4WD (4x4)', true),
-- Tremor and Raptor are 4WD only
(2021, 2025, 'Ford', 'F-150', 'Tremor', '4WD', '4WD (4x4)', true),
(2021, 2025, 'Ford', 'F-150', 'Raptor', '4WD', '4WD (4x4)', true),
-- Generic F-150
(2021, 2025, 'Ford', 'F-150', null, 'RWD', 'RWD (Rear Wheel)', false),
(2021, 2025, 'Ford', 'F-150', null, '4WD', '4WD (4x4)', true),

-- F-150 (2015-2020 - 13th Gen)
(2015, 2020, 'Ford', 'F-150', null, 'RWD', 'RWD (Rear Wheel)', false),
(2015, 2020, 'Ford', 'F-150', null, '4WD', '4WD (4x4)', true),

-- F-250/F-350 Super Duty
(2017, 2025, 'Ford', 'F-250', null, 'RWD', 'RWD (Rear Wheel)', false),
(2017, 2025, 'Ford', 'F-250', null, '4WD', '4WD (4x4)', true),
(2017, 2025, 'Ford', 'F-350', null, 'RWD', 'RWD (Rear Wheel)', false),
(2017, 2025, 'Ford', 'F-350', null, '4WD', '4WD (4x4)', true),

-- Ranger
(2019, 2025, 'Ford', 'Ranger', null, 'RWD', 'RWD (Rear Wheel)', false),
(2019, 2025, 'Ford', 'Ranger', null, '4WD', '4WD (4x4)', true),
(2024, 2025, 'Ford', 'Ranger', 'Raptor', '4WD', '4WD (4x4)', true),

-- Bronco (4WD only)
(2021, 2025, 'Ford', 'Bronco', null, '4WD', '4WD (4x4)', true),
(2021, 2025, 'Ford', 'Bronco', 'Raptor', '4WD', '4WD (4x4)', true),

-- Bronco Sport (AWD focused)
(2021, 2025, 'Ford', 'Bronco Sport', null, 'FWD', 'FWD (Front Wheel)', false),
(2021, 2025, 'Ford', 'Bronco Sport', null, 'AWD', 'AWD (All Wheel)', true),

-- ============================================================================
-- GMC TRUCKS
-- ============================================================================

-- Sierra 1500 (2019-2025)
(2019, 2025, 'GMC', 'Sierra 1500', 'Pro', 'RWD', 'RWD (Rear Wheel)', false),
(2019, 2025, 'GMC', 'Sierra 1500', 'Pro', '4WD', '4WD (4x4)', true),
(2019, 2025, 'GMC', 'Sierra 1500', 'SLE', 'RWD', 'RWD (Rear Wheel)', false),
(2019, 2025, 'GMC', 'Sierra 1500', 'SLE', '4WD', '4WD (4x4)', true),
(2019, 2025, 'GMC', 'Sierra 1500', 'Elevation', 'RWD', 'RWD (Rear Wheel)', false),
(2019, 2025, 'GMC', 'Sierra 1500', 'Elevation', '4WD', '4WD (4x4)', true),
(2019, 2025, 'GMC', 'Sierra 1500', 'SLT', 'RWD', 'RWD (Rear Wheel)', false),
(2019, 2025, 'GMC', 'Sierra 1500', 'SLT', '4WD', '4WD (4x4)', true),
(2019, 2025, 'GMC', 'Sierra 1500', 'Denali', 'RWD', 'RWD (Rear Wheel)', false),
(2019, 2025, 'GMC', 'Sierra 1500', 'Denali', '4WD', '4WD (4x4)', true),
(2022, 2025, 'GMC', 'Sierra 1500', 'Denali Ultimate', '4WD', '4WD (4x4)', true),
-- AT4 trims are 4WD only
(2019, 2025, 'GMC', 'Sierra 1500', 'AT4', '4WD', '4WD (4x4)', true),
(2022, 2025, 'GMC', 'Sierra 1500', 'AT4X', '4WD', '4WD (4x4)', true),
-- Generic Sierra 1500
(2019, 2025, 'GMC', 'Sierra 1500', null, 'RWD', 'RWD (Rear Wheel)', false),
(2019, 2025, 'GMC', 'Sierra 1500', null, '4WD', '4WD (4x4)', true),

-- Sierra 2500HD/3500HD
(2020, 2025, 'GMC', 'Sierra 2500HD', null, 'RWD', 'RWD (Rear Wheel)', false),
(2020, 2025, 'GMC', 'Sierra 2500HD', null, '4WD', '4WD (4x4)', true),
(2020, 2025, 'GMC', 'Sierra 3500HD', null, 'RWD', 'RWD (Rear Wheel)', false),
(2020, 2025, 'GMC', 'Sierra 3500HD', null, '4WD', '4WD (4x4)', true),

-- Canyon
(2015, 2025, 'GMC', 'Canyon', null, 'RWD', 'RWD (Rear Wheel)', false),
(2015, 2025, 'GMC', 'Canyon', null, '4WD', '4WD (4x4)', true),
(2023, 2025, 'GMC', 'Canyon', 'AT4X', '4WD', '4WD (4x4)', true),

-- ============================================================================
-- TOYOTA TRUCKS & SUVS
-- ============================================================================

-- Tacoma (2016-2025)
(2016, 2023, 'Toyota', 'Tacoma', 'SR', 'RWD', 'RWD (Rear Wheel)', false),
(2016, 2023, 'Toyota', 'Tacoma', 'SR', '4WD', '4WD (4x4)', true),
(2016, 2023, 'Toyota', 'Tacoma', 'SR5', 'RWD', 'RWD (Rear Wheel)', false),
(2016, 2023, 'Toyota', 'Tacoma', 'SR5', '4WD', '4WD (4x4)', true),
(2016, 2023, 'Toyota', 'Tacoma', 'TRD Sport', 'RWD', 'RWD (Rear Wheel)', false),
(2016, 2023, 'Toyota', 'Tacoma', 'TRD Sport', '4WD', '4WD (4x4)', true),
(2016, 2023, 'Toyota', 'Tacoma', 'TRD Off-Road', '4WD', '4WD (4x4)', true),
(2016, 2023, 'Toyota', 'Tacoma', 'Limited', 'RWD', 'RWD (Rear Wheel)', false),
(2016, 2023, 'Toyota', 'Tacoma', 'Limited', '4WD', '4WD (4x4)', true),
(2017, 2023, 'Toyota', 'Tacoma', 'TRD Pro', '4WD', '4WD (4x4)', true),
-- 4th Gen Tacoma (2024+)
(2024, 2025, 'Toyota', 'Tacoma', null, 'RWD', 'RWD (Rear Wheel)', false),
(2024, 2025, 'Toyota', 'Tacoma', null, '4WD', '4WD (4x4)', true),
(2024, 2025, 'Toyota', 'Tacoma', 'TRD Pro', '4WD', '4WD (4x4)', true),
(2024, 2025, 'Toyota', 'Tacoma', 'Trailhunter', '4WD', '4WD (4x4)', true),
-- Generic Tacoma
(2016, 2025, 'Toyota', 'Tacoma', null, 'RWD', 'RWD (Rear Wheel)', false),
(2016, 2025, 'Toyota', 'Tacoma', null, '4WD', '4WD (4x4)', true),

-- Tundra (2022-2025 - 3rd Gen)
(2022, 2025, 'Toyota', 'Tundra', 'SR', 'RWD', 'RWD (Rear Wheel)', false),
(2022, 2025, 'Toyota', 'Tundra', 'SR', '4WD', '4WD (4x4)', true),
(2022, 2025, 'Toyota', 'Tundra', 'SR5', 'RWD', 'RWD (Rear Wheel)', false),
(2022, 2025, 'Toyota', 'Tundra', 'SR5', '4WD', '4WD (4x4)', true),
(2022, 2025, 'Toyota', 'Tundra', 'Limited', 'RWD', 'RWD (Rear Wheel)', false),
(2022, 2025, 'Toyota', 'Tundra', 'Limited', '4WD', '4WD (4x4)', true),
(2022, 2025, 'Toyota', 'Tundra', 'Platinum', 'RWD', 'RWD (Rear Wheel)', false),
(2022, 2025, 'Toyota', 'Tundra', 'Platinum', '4WD', '4WD (4x4)', true),
(2022, 2025, 'Toyota', 'Tundra', '1794 Edition', 'RWD', 'RWD (Rear Wheel)', false),
(2022, 2025, 'Toyota', 'Tundra', '1794 Edition', '4WD', '4WD (4x4)', true),
(2022, 2025, 'Toyota', 'Tundra', 'Capstone', '4WD', '4WD (4x4)', true),
(2022, 2025, 'Toyota', 'Tundra', 'TRD Pro', '4WD', '4WD (4x4)', true),
-- Generic Tundra
(2022, 2025, 'Toyota', 'Tundra', null, 'RWD', 'RWD (Rear Wheel)', false),
(2022, 2025, 'Toyota', 'Tundra', null, '4WD', '4WD (4x4)', true),

-- 4Runner (2010-2025)
(2010, 2025, 'Toyota', '4Runner', 'SR5', 'RWD', 'RWD (Rear Wheel)', false),
(2010, 2025, 'Toyota', '4Runner', 'SR5', '4WD', '4WD (4x4)', true),
(2010, 2025, 'Toyota', '4Runner', 'TRD Sport', 'RWD', 'RWD (Rear Wheel)', false),
(2010, 2025, 'Toyota', '4Runner', 'TRD Sport', '4WD', '4WD (4x4)', true),
(2010, 2025, 'Toyota', '4Runner', 'TRD Off-Road', '4WD', '4WD (4x4)', true),
(2010, 2025, 'Toyota', '4Runner', 'TRD Off-Road Premium', '4WD', '4WD (4x4)', true),
(2010, 2025, 'Toyota', '4Runner', 'Limited', 'RWD', 'RWD (Rear Wheel)', false),
(2010, 2025, 'Toyota', '4Runner', 'Limited', '4WD', '4WD (4x4)', true),
(2015, 2025, 'Toyota', '4Runner', 'TRD Pro', '4WD', '4WD (4x4)', true),
-- Generic 4Runner
(2010, 2025, 'Toyota', '4Runner', null, 'RWD', 'RWD (Rear Wheel)', false),
(2010, 2025, 'Toyota', '4Runner', null, '4WD', '4WD (4x4)', true),

-- Land Cruiser (4WD only)
(2008, 2021, 'Toyota', 'Land Cruiser', null, '4WD', '4WD (4x4)', true),
(2024, 2025, 'Toyota', 'Land Cruiser', null, '4WD', '4WD (4x4)', true),

-- Sequoia
(2023, 2025, 'Toyota', 'Sequoia', null, 'RWD', 'RWD (Rear Wheel)', false),
(2023, 2025, 'Toyota', 'Sequoia', null, '4WD', '4WD (4x4)', true),
(2023, 2025, 'Toyota', 'Sequoia', 'TRD Pro', '4WD', '4WD (4x4)', true),

-- ============================================================================
-- JEEP
-- ============================================================================

-- Wrangler (4WD only)
(2018, 2025, 'Jeep', 'Wrangler', 'Sport', '4WD', '4WD (4x4)', true),
(2018, 2025, 'Jeep', 'Wrangler', 'Sport S', '4WD', '4WD (4x4)', true),
(2018, 2025, 'Jeep', 'Wrangler', 'Willys', '4WD', '4WD (4x4)', true),
(2018, 2025, 'Jeep', 'Wrangler', 'Sahara', '4WD', '4WD (4x4)', true),
(2018, 2025, 'Jeep', 'Wrangler', 'Rubicon', '4WD', '4WD (4x4)', true),
(2021, 2025, 'Jeep', 'Wrangler', 'Rubicon 392', '4WD', '4WD (4x4)', true),
(2018, 2025, 'Jeep', 'Wrangler', null, '4WD', '4WD (4x4)', true),

-- Gladiator (4WD only)
(2020, 2025, 'Jeep', 'Gladiator', 'Sport', '4WD', '4WD (4x4)', true),
(2020, 2025, 'Jeep', 'Gladiator', 'Sport S', '4WD', '4WD (4x4)', true),
(2020, 2025, 'Jeep', 'Gladiator', 'Willys', '4WD', '4WD (4x4)', true),
(2020, 2025, 'Jeep', 'Gladiator', 'Overland', '4WD', '4WD (4x4)', true),
(2020, 2025, 'Jeep', 'Gladiator', 'Rubicon', '4WD', '4WD (4x4)', true),
(2020, 2025, 'Jeep', 'Gladiator', 'Mojave', '4WD', '4WD (4x4)', true),
(2020, 2025, 'Jeep', 'Gladiator', null, '4WD', '4WD (4x4)', true),

-- Grand Cherokee
(2022, 2025, 'Jeep', 'Grand Cherokee', 'Laredo', 'RWD', 'RWD (Rear Wheel)', false),
(2022, 2025, 'Jeep', 'Grand Cherokee', 'Laredo', '4WD', '4WD (4x4)', true),
(2022, 2025, 'Jeep', 'Grand Cherokee', 'Limited', 'RWD', 'RWD (Rear Wheel)', false),
(2022, 2025, 'Jeep', 'Grand Cherokee', 'Limited', '4WD', '4WD (4x4)', true),
(2022, 2025, 'Jeep', 'Grand Cherokee', 'Overland', '4WD', '4WD (4x4)', true),
(2022, 2025, 'Jeep', 'Grand Cherokee', 'Summit', '4WD', '4WD (4x4)', true),
(2022, 2025, 'Jeep', 'Grand Cherokee', 'Trailhawk', '4WD', '4WD (4x4)', true),
(2022, 2025, 'Jeep', 'Grand Cherokee', null, 'RWD', 'RWD (Rear Wheel)', false),
(2022, 2025, 'Jeep', 'Grand Cherokee', null, '4WD', '4WD (4x4)', true),

-- ============================================================================
-- NISSAN
-- ============================================================================

-- Titan
(2017, 2025, 'Nissan', 'Titan', 'S', 'RWD', 'RWD (Rear Wheel)', false),
(2017, 2025, 'Nissan', 'Titan', 'S', '4WD', '4WD (4x4)', true),
(2017, 2025, 'Nissan', 'Titan', 'SV', 'RWD', 'RWD (Rear Wheel)', false),
(2017, 2025, 'Nissan', 'Titan', 'SV', '4WD', '4WD (4x4)', true),
(2017, 2025, 'Nissan', 'Titan', 'SL', 'RWD', 'RWD (Rear Wheel)', false),
(2017, 2025, 'Nissan', 'Titan', 'SL', '4WD', '4WD (4x4)', true),
(2017, 2025, 'Nissan', 'Titan', 'PRO-4X', '4WD', '4WD (4x4)', true),
(2017, 2025, 'Nissan', 'Titan', 'Platinum Reserve', 'RWD', 'RWD (Rear Wheel)', false),
(2017, 2025, 'Nissan', 'Titan', 'Platinum Reserve', '4WD', '4WD (4x4)', true),
(2017, 2025, 'Nissan', 'Titan', null, 'RWD', 'RWD (Rear Wheel)', false),
(2017, 2025, 'Nissan', 'Titan', null, '4WD', '4WD (4x4)', true),

-- Titan XD
(2016, 2025, 'Nissan', 'Titan XD', null, 'RWD', 'RWD (Rear Wheel)', false),
(2016, 2025, 'Nissan', 'Titan XD', null, '4WD', '4WD (4x4)', true),

-- Frontier
(2022, 2025, 'Nissan', 'Frontier', null, 'RWD', 'RWD (Rear Wheel)', false),
(2022, 2025, 'Nissan', 'Frontier', null, '4WD', '4WD (4x4)', true),
(2022, 2025, 'Nissan', 'Frontier', 'PRO-4X', '4WD', '4WD (4x4)', true),

-- ============================================================================
-- HONDA
-- ============================================================================

-- Ridgeline (AWD focused)
(2017, 2025, 'Honda', 'Ridgeline', null, 'FWD', 'FWD (Front Wheel)', false),
(2017, 2025, 'Honda', 'Ridgeline', null, 'AWD', 'AWD (All Wheel)', true),
(2021, 2025, 'Honda', 'Ridgeline', 'TrailSport', 'AWD', 'AWD (All Wheel)', true),

-- Passport
(2019, 2025, 'Honda', 'Passport', null, 'FWD', 'FWD (Front Wheel)', false),
(2019, 2025, 'Honda', 'Passport', null, 'AWD', 'AWD (All Wheel)', true),
(2022, 2025, 'Honda', 'Passport', 'TrailSport', 'AWD', 'AWD (All Wheel)', true),

-- Pilot
(2016, 2025, 'Honda', 'Pilot', null, 'FWD', 'FWD (Front Wheel)', false),
(2016, 2025, 'Honda', 'Pilot', null, 'AWD', 'AWD (All Wheel)', true),
(2023, 2025, 'Honda', 'Pilot', 'TrailSport', 'AWD', 'AWD (All Wheel)', true),

-- ============================================================================
-- LEXUS
-- ============================================================================

-- GX
(2010, 2025, 'Lexus', 'GX', null, '4WD', '4WD (4x4)', true),
(2024, 2025, 'Lexus', 'GX', 'Overtrail', '4WD', '4WD (4x4)', true),

-- LX
(2008, 2025, 'Lexus', 'LX', null, '4WD', '4WD (4x4)', true)

on conflict (year_start, year_end, make, model, trim, drivetrain) do nothing;

-- Verify insert count
select count(*) as total_records from public.vehicle_drivetrains;
