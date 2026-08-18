import { Request, Response } from "express";
import { pool } from "../config/database";
import { Task } from "../models/Task";

export const createTask = async (req: Request, res: Response) => {
    const {title, description, due_date} = req.body;

    try {
        const result = await pool.query('INSERT INTO tasks (title, description, due_date) VALUES ($1, $2, $3) RETURNING *',
        [title, description, due_date || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar a tarefa'});
    }
};

export const getTasks = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar tarefas'});
    }
};

export const completeTask = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const result = await pool.query('UPDATE tasks SET is_completed = true, completed_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0){
            res.status(404).json({ error: 'Tarefa não encontrada'});
            return;
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar a tarefa'});
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Erro ao deletar a tarefa'});
    }
};
