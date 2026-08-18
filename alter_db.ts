import { pool } from "./backend/src/config/database";

async function alterTable() {
    try {
        await pool.query(`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS due_date TIMESTAMP;`);
        await pool.query(`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;`);
        console.log("Table 'tasks' altered successfully.");
    } catch (err) {
        console.error("Error altering table:", err);
    } finally {
        await pool.end();
    }
}

alterTable();
