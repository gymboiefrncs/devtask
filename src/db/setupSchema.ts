import type { Database } from "better-sqlite3";

export const initializeSchema = (db: Database) => {
  db.pragma("foreign_keys = ON");

  db.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        status TEXT CHECK(status IN ('active','inactive', 'done')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS features (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        description TEXT NOT NULL,
        status TEXT CHECK(status IN ('todo','in_progress','done')) DEFAULT 'todo',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        is_focused INTEGER DEFAULT 0,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
      CREATE INDEX IF NOT EXISTS idx_features_project_id ON features(project_id);
      CREATE INDEX IF NOT EXISTS idx_features_status ON features(status);
      CREATE INDEX IF NOT EXISTS idx_features_is_focused ON features(is_focused);
    `);
};
