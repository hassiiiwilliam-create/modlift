import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SUPABASE_PROJECT_REF = 'uoaaiyzycbufdnptrluc'
// Use the database connection string directly via the SQL API
const SUPABASE_URL = `https://${SUPABASE_PROJECT_REF}.supabase.co`
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvYWFpeXp5Y2J1ZmRucHRybHVjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAyMDQyMywiZXhwIjoyMDcyNTk2NDIzfQ.aXwu523zoQ7n8Z-EznT_NiQ1f4u58wClnUWumY8cgcA'

async function runMigration() {
  console.log('Reading migration file...\n')

  const migrationPath = path.join(__dirname, '../supabase/migrations/002_products_filter_columns_v2.sql')
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

  console.log('Executing migration via Supabase SQL API...\n')

  // Use the Supabase SQL API (v1/sql)
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({})
  })

  // Since we can't run raw SQL via REST API without a custom function,
  // we need to use the Supabase Dashboard SQL Editor or supabase db execute

  console.log(`
╔═══════════════════════════════════════════════════════════════════════════════╗
║                    MANUAL MIGRATION REQUIRED                                  ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  The Supabase REST API doesn't support raw SQL execution.                     ║
║  Please run the migration manually in the Supabase SQL Editor:                ║
║                                                                               ║
║  1. Open: https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/sql  ║
║                                                                               ║
║  2. Copy the contents of:                                                     ║
║     supabase/migrations/002_products_filter_columns_v2.sql                    ║
║                                                                               ║
║  3. Paste into SQL Editor and click "Run"                                     ║
║                                                                               ║
║  4. Then copy the contents of:                                                ║
║     supabase/seeds/products_seed_v2.sql                                       ║
║                                                                               ║
║  5. Paste into SQL Editor and click "Run"                                     ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
`)
}

runMigration().catch(console.error)
