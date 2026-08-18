import { Router } from "express";
import { createTask, getTasks, completeTask, deleteTask } from "../controllers/taskController";

const router = Router();

// 1. CREATE: Create a new task
router.post('/', createTask);

// 2. READ: List all tasks
router.get('/', getTasks);

// 3. UPDATE: Mark task as completed
router.put('/:id/complete', completeTask);

// 4. DELETE: Delete a task
router.delete('/:id', deleteTask);

export default router;
