import type { Task } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getTasks = async (): Promise<Task[]> => {
  const response = await fetch(`${API_URL}/tasks`);
  if (!response.ok) {
    throw new Error('Erro ao buscar tarefas');
  }
  return response.json();
};

export const createTask = async (title: string, description: string, dueDate: string | null): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description, due_date: dueDate }),
  });
  if (!response.ok) {
    throw new Error('Erro ao criar tarefa');
  }
  return response.json();
};

export const completeTask = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/tasks/${id}/complete`, {
    method: 'PUT',
  });
  if (!response.ok) {
    throw new Error('Erro ao concluir tarefa');
  }
};

export const deleteTask = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Erro ao excluir tarefa');
  }
};
