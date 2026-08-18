import express, { Request, Response } from "express";
import { pool } from "./database";

const app = express();
app.use(express.json());

// Task interface
interface Task {
    id: number;
    title: string;
    description: string | null;
    is_completed: boolean;
    created_at: Date;
}

// 1. CREATE: Create a new task
app.post('/tasks', async (req: Request, res: Response) => {
    const {title, description} = req.body;

    try {
        const result = await pool.query('INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
        [title, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar a tarefa'});
    }
});

//2. READ: List all tasks
app.get('/tasks', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar tarefas'});
    }
});

//3. UPDATE: Mark task as completed
app.put('/tasks/:id/complete', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await pool.query('UPDATE tasks SET is_completed = true WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0){
            res.status(404).json({ error: 'Tarefa não encontrada'});
            return;
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualiza a tarefa'});
    }
});

//4. DELETE: Delete a task
app.delete('/tasks/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Erro ao deletar a tarefa'});
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
})