import sqlite3, json, sys

DB = r"C:\Users\Meu Computador\.local\share\mimocode\mimocode.db"
conn = sqlite3.connect(DB)
conn.row_factory = sqlite3.Row
c = conn.cursor()

# 1. List recent sessions
print("=== RECENT SESSIONS (last 25) ===")
c.execute("""
    SELECT id, project_id, substr(title,1,100) as title,
           datetime(time_created,'localtime') as created
    FROM session
    ORDER BY time_created DESC
    LIMIT 25
""")
for r in c.fetchall():
    print(f"  {r['id']}  |  {r['project_id']}  |  {r['created']}  |  {r['title']}")

# 2. Count sessions per project
print("\n=== SESSIONS PER PROJECT ===")
c.execute("""
    SELECT project_id, count(*) as cnt,
           min(datetime(time_created,'localtime')) as first,
           max(datetime(time_created,'localtime')) as last
    FROM session
    GROUP BY project_id
    ORDER BY last DESC
""")
for r in c.fetchall():
    print(f"  {r['project_id']}  |  {r['cnt']} sessions  |  {r['first']} -> {r['last']}")

conn.close()
