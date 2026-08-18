import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Circle, ListTodo, Moon, Sun } from 'lucide-react';
import type { Task } from './types';
import * as api from './services/api';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await api.getTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Não foi possível carregar as tarefas.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      await api.createTask(title, description);
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError('Erro ao criar tarefa.');
    }
  };

  const handleToggleComplete = async (task: Task) => {
    if (task.is_completed) return;
    try {
      await api.completeTask(task.id);
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError('Erro ao atualizar tarefa.');
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await api.deleteTask(id);
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError('Erro ao excluir tarefa.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700 transition-colors duration-200">
          
          {/* Header */}
          <div className="bg-indigo-600 dark:bg-indigo-900 px-8 py-10 transition-colors duration-200">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <ListTodo size={40} className="text-indigo-200 dark:text-indigo-300" />
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Gerenciador de Tarefas</h1>
                  <p className="text-indigo-200 dark:text-indigo-300 mt-1">Organize seu dia com facilidade</p>
                </div>
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Alternar modo escuro"
              >
                {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
              </button>
            </div>
          </div>

          <div className="p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-lg border border-red-100 dark:border-red-800">
                {error}
              </div>
            )}

            {/* Add Task Form */}
            <form onSubmit={handleCreateTask} className="mb-10 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors duration-200">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Nova Tarefa</h2>
              <div className="grid gap-4 sm:grid-cols-12">
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    placeholder="Título da tarefa"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:border-indigo-600 dark:focus:border-indigo-500 outline-none transition-all"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    placeholder="Descrição detalhada"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:border-indigo-600 dark:focus:border-indigo-500 outline-none transition-all"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full h-full flex items-center justify-center gap-2 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-medium px-4 py-3 rounded-lg transition-colors shadow-sm"
                  >
                    <Plus size={20} />
                    <span className="sr-only sm:not-sr-only">Adicionar</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Task List */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Suas Tarefas</h2>
              
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 dark:border-indigo-500"></div>
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 border-dashed transition-colors duration-200">
                  <p className="text-slate-500 dark:text-slate-400">Nenhuma tarefa encontrada. Adicione uma acima!</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <div 
                    key={task.id}
                    className={`group flex items-start gap-4 p-5 rounded-xl border transition-all duration-200 ${
                      task.is_completed 
                        ? 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 opacity-75' 
                        : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md'
                    }`}
                  >
                    <button
                      onClick={() => handleToggleComplete(task)}
                      className={`mt-1 flex-shrink-0 transition-colors ${
                        task.is_completed 
                          ? 'text-emerald-500 dark:text-emerald-400 cursor-default' 
                          : 'text-slate-400 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                      }`}
                      disabled={task.is_completed}
                    >
                      {task.is_completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-semibold truncate ${
                        task.is_completed ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-800 dark:text-white'
                      }`}>
                        {task.title}
                      </h3>
                      <p className={`mt-1 text-sm ${
                        task.is_completed ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-300'
                      }`}>
                        {task.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all focus:opacity-100"
                      aria-label="Excluir tarefa"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
