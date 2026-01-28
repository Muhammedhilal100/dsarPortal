const { Pool } = require('pg')
const pool = new Pool({
  connectionString: "postgresql://postgres:postgres@localhost:5432/dsar-test"
})

async function test() {
  try {
    const res = await pool.query('SELECT NOW()')
    console.log('Connected successfully:', res.rows[0])
    await pool.end()
  } catch (err) {
    console.error('Connection error:', err)
    process.exit(1)
  }
}

test()
