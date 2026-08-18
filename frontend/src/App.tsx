import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Circle, ListTodo } from 'lucide-react';
import type { Task } from './types';
import * as api from './services/api';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    if (task.is_completed) return; // Optional: If the backend doesn't support un-completing, we just skip it or change the UI to only allow checking.
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
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          
          {/* Header */}
          <div className="bg-indigo-600 px-8 py-10">
            <div className="flex items-center gap-4 text-white">
              <ListTodo size={40} className="text-indigo-200" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Gerenciador de Tarefas</h1>
                <p className="text-indigo-200 mt-1">Organize seu dia com facilidade</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            {/* Add Task Form */}
            <form onSubmit={handleCreateTask} className="mb-10 bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Nova Tarefa</h2>
              <div className="grid gap-4 sm:grid-cols-12">
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    placeholder="Título da tarefa"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    placeholder="Descrição detalhada"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full h-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-3 rounded-lg transition-colors shadow-sm"
                  >
                    <Plus size={20} />
                    <span className="sr-only sm:not-sr-only">Adicionar</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Task List */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Suas Tarefas</h2>
              
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                  <p className="text-slate-500">Nenhuma tarefa encontrada. Adicione uma acima!</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <div 
                    key={task.id}
                    className={`group flex items-start gap-4 p-5 rounded-xl border transition-all ${
                      task.is_completed 
                        ? 'bg-slate-50 border-slate-200 opacity-75' 
                        : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
                    }`}
                  >
                    <button
                      onClick={() => handleToggleComplete(task)}
                      className={`mt-1 flex-shrink-0 transition-colors ${
                        task.is_completed ? 'text-emerald-500 cursor-default' : 'text-slate-400 hover:text-indigo-600'
                      }`}
                      disabled={task.is_completed}
                    >
                      {task.is_completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-semibold truncate ${
                        task.is_completed ? 'text-slate-500 line-through' : 'text-slate-800'
                      }`}>
                        {task.title}
                      </h3>
                      <p className={`mt-1 text-sm ${
                        task.is_completed ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {task.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all focus:opacity-100"
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
