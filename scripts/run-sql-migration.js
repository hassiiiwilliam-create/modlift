import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SUPABASE_PROJECT_REF = 'uoaaiyzycbufdnptrluc'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvYWFpeXp5Y2J1ZmRucHRybHVjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAyMDQyMywiZXhwIjoyMDcyNTk2NDIzfQ.aXwu523zoQ7n8Z-EznT_NiQ1f4u58wClnUWumY8cgcA'

async function runSQL(sql) {
  const response = await fetch(
    `https://${SUPABASE_PROJECT_REF}.supabase.co/rest/v1/rpc/exec_sql`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({ sql_query: sql })
    }
  )

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`SQL Error: ${text}`)
  }

  return response.json()
}

async function main() {
  console.log('Running SQL migration via Supabase REST API...\n')

  // Read the migration file
  const migrationPath = path.join(__dirname, '../supabase/migrations/002_products_filter_columns_v2.sql')
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

  // Split into individual statements
  const statements = migrationSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'))

  console.log(`Found ${statements.length} SQL statements to execute.\n`)

  let success = 0
  let errors = 0

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i]
    // Skip comment-only statements
    if (stmt.split('\n').every(line => line.trim().startsWith('--') || line.trim() === '')) {
      continue
    }

    try {
      await runSQL(stmt + ';')
      success++
      // Print abbreviated statement
      const preview = stmt.replace(/\n/g, ' ').slice(0, 60)
      console.log(`✓ ${preview}...`)
    } catch (err) {
      errors++
      console.log(`✗ Error on statement ${i + 1}: ${err.message.slice(0, 100)}`)
    }
  }

  console.log(`\nMigration complete: ${success} succeeded, ${errors} failed`)
}

main().catch(console.error)
