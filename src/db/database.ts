import Database, { type Database as DatabaseType } from "better-sqlite3";
import path from "path";
import os from "os";
import fs from "fs";
import { initializeSchema } from "./setupSchema.js";

const DB_DIR = path.join(os.homedir(), ".devtask");
const DB_PATH = path.join(DB_DIR, ".devtask.sqlite");

if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

export const db: DatabaseType = new Database(DB_PATH);
initializeSchema(db);
