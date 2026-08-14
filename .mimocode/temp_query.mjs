import { DatabaseSync } from 'node:sqlite';

const DB = 'C:\\Users\\Meu Computador\\.local\\share\\mimocode\\mimocode.db';
const db = new DatabaseSync(DB, { open: true, readOnly: true });

// 1. Get the full text of the "Voltei ao commit" message and what happened after
console.log("=== LAST USER MESSAGE AND RESPONSES (ses_04fa4556cffeiz7Urpr0MOcYga, from rowid 10770+) ===");
const lastMsgs = db.prepare(`
  SELECT p.rowid, m.agent_id,
         json_extract(m.data, '$.role') as role,
         json_extract(p.data, '$.type') as part_type,
         json_extract(p.data, '$.tool') as tool,
         substr(json_extract(p.data, '$.text'), 1, 400) as text
  FROM part p
  JOIN message m ON m.id = p.message_id
  WHERE m.session_id = 'ses_04fa4556cffeiz7Urpr0MOcYga'
    AND p.rowid >= 10770
    AND json_extract(p.data, '$.type') IN ('text', 'tool')
  ORDER BY p.rowid
  LIMIT 40
`).all();
lastMsgs.forEach(r => {
  const t = r.text ? r.text.replace(/\n/g, ' ').substring(0, 250) : '(null)';
  const tool = r.tool ? ` [tool: ${r.tool}]` : '';
  console.log(`  rowid=${r.rowid}  [${r.role}]${tool}  |  ${t}`);
});

// 2. Search for "mobile" related parts
console.log("\n=== MOBILE-RELATED PARTS (last 20) ===");
const mobileParts = db.prepare(`
  SELECT p.rowid, m.agent_id,
         json_extract(m.data, '$.role') as role,
         json_extract(p.data, '$.type') as part_type,
         substr(json_extract(p.data, '$.text'), 1, 300) as text
  FROM part p
  JOIN message m ON m.id = p.message_id
  WHERE m.session_id = 'ses_04fa4556cffeiz7Urpr0MOcYga'
    AND json_extract(p.data, '$.type') = 'text'
    AND json_extract(p.data, '$.text') LIKE '%mobile%'
  ORDER BY p.rowid DESC
  LIMIT 10
`).all();
mobileParts.forEach(r => {
  const t = r.text ? r.text.replace(/\n/g, ' ').substring(0, 200) : '(null)';
  console.log(`  rowid=${r.rowid}  [${r.role}]  |  ${t}`);
});

db.close();
