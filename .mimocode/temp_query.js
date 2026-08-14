const Database = require('better-sqlite3');
const path = require('path');

const DB = path.join(process.env.LOCALAPPDATA || '', 'mimocode', 'mimocode.db');
let db;
try {
  db = new Database(DB, { readonly: true });
} catch(e) {
  // try alternative path
  const altDB = 'C:\\Users\\Meu Computador\\.local\\share\\mimocode\\mimocode.db';
  db = new Database(altDB, { readonly: true });
}

// 1. List recent sessions
console.log("=== RECENT SESSIONS (last 25) ===");
const sessions = db.prepare(`
  SELECT id, project_id, substr(title,1,100) as title,
         datetime(time_created,'localtime') as created
  FROM session
  ORDER BY time_created DESC
  LIMIT 25
`).all();
sessions.forEach(r => console.log(`  ${r.id}  |  ${r.project_id}  |  ${r.created}  |  ${r.title}`));

// 2. Count sessions per project
console.log("\n=== SESSIONS PER PROJECT ===");
const counts = db.prepare(`
  SELECT project_id, count(*) as cnt,
         min(datetime(time_created,'localtime')) as first,
         max(datetime(time_created,'localtime')) as last
  FROM session
  GROUP BY project_id
  ORDER BY last DESC
`).all();
counts.forEach(r => console.log(`  ${r.project_id}  |  ${r.cnt} sessions  |  ${r.first} -> ${r.last}`));

db.close();
