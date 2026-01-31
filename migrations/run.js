const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Initialize database
const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('🚀 Running migrations...');

// Read and execute SQL file
const sqlFile = path.join(__dirname, 'create_tables.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

// Execute SQL
db.exec(sql, (err) => {
  if (err) {
    console.error('❌ Error running migrations:', err.message);
    process.exit(1);
  }

  console.log('✅ Migrations completed successfully!');
  console.log(`📁 Database created at: ${dbPath}`);

  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    process.exit(0);
  });
});
