import { drizzle } from "drizzle-orm/neon-serverless";
import { sql } from "drizzle-orm";
import ws from "ws";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const db = drizzle({
  connection: DATABASE_URL,
  ws: ws,
});

const DATA_DIR = join(process.cwd(), "data");

async function migrate() {
  try {
    console.log("Connecting to PostgreSQL...");
    
    // Fetch all messages from the database
    const messages = await db.execute(sql`SELECT * FROM messages ORDER BY timestamp ASC`);
    
    console.log(`Found ${messages.rows.length} messages in database`);
    
    // Create data directory
    await mkdir(DATA_DIR, { recursive: true });
    
    // Save messages to JSON file
    await writeFile(
      join(DATA_DIR, "messages.json"),
      JSON.stringify(messages.rows, null, 2)
    );
    
    console.log(`✓ Migrated ${messages.rows.length} messages to data/messages.json`);
    
    // Also save empty users array for now
    await writeFile(
      join(DATA_DIR, "users.json"),
      JSON.stringify([], null, 2)
    );
    
    console.log("✓ Migration complete!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
