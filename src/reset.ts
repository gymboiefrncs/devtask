import { db } from "./db/database.js";

export function resetDatabase() {
  try {
    const tables = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
      )
      .all() as { name: string }[];

    const truncate = db.transaction(() => {
      for (const table of tables) {
        db.prepare(`DELETE FROM "${table.name}";`).run();

        db.prepare("DELETE FROM sqlite_sequence WHERE name = ?;").run(
          table.name
        );
      }
    });

    truncate();

    console.log(
      "Database reset complete. All tables truncated and counters reset."
    );
  } catch (err) {
    console.error("Failed to reset database:", err);
  }
}
