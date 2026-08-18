import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Circle, ListTodo, Moon, Sun, Calendar, Clock, CalendarCheck } from 'lucide-react';
import type { Task } from './types';
import * as api from './services/api';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hasDueDate, setHasDueDate] = useState(false);
  const [dueDate, setDueDate] = useState('');
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
    
    // Validar se o prazo foi selecionado
    if (hasDueDate && !dueDate) {
      setError('Por favor, selecione uma data e hora para o prazo.');
      return;
    }

    try {
      await api.createTask(title, description, hasDueDate ? new Date(dueDate).toISOString() : null);
      setTitle('');
      setDescription('');
      setHasDueDate(false);
      setDueDate('');
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 2xl:py-20 transition-colors duration-200">
      <div className="w-full max-w-3xl lg:max-w-5xl 2xl:max-w-7xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700 transition-colors duration-200">
          
          {/* Header */}
          <div className="bg-indigo-600 dark:bg-indigo-900 px-6 sm:px-8 2xl:px-12 py-8 sm:py-10 2xl:py-14 transition-colors duration-200">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <ListTodo className="w-10 h-10 2xl:w-14 2xl:h-14 text-indigo-200 dark:text-indigo-300" />
                <div>
                  <h1 className="text-2xl sm:text-3xl 2xl:text-5xl font-bold tracking-tight">Gerenciador de Tarefas</h1>
                  <p className="text-sm sm:text-base 2xl:text-xl text-indigo-200 dark:text-indigo-300 mt-1">Organize seu dia com facilidade</p>
                </div>
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 2xl:p-4 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Alternar modo escuro"
              >
                {isDarkMode ? <Sun className="w-6 h-6 2xl:w-8 2xl:h-8" /> : <Moon className="w-6 h-6 2xl:w-8 2xl:h-8" />}
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8 2xl:p-12">
            {/* Error Message */}
            {error && (
              <div className="mb-6 2xl:mb-8 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 2xl:p-6 2xl:text-lg rounded-lg border border-red-100 dark:border-red-800">
                {error}
              </div>
            )}

            {/* Add Task Form */}
            <form onSubmit={handleCreateTask} className="mb-10 2xl:mb-14 bg-slate-50 dark:bg-slate-800/50 p-6 2xl:p-8 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors duration-200">
              <h2 className="text-lg 2xl:text-2xl font-semibold text-slate-800 dark:text-white mb-4 2xl:mb-6">Nova Tarefa</h2>
              <div className="grid gap-4 sm:grid-cols-12 lg:grid-cols-12">
                <div className="sm:col-span-12 lg:col-span-5">
                  <input
                    type="text"
                    placeholder="Título da tarefa"
                    className="w-full px-4 2xl:px-6 py-3 2xl:py-4 2xl:text-lg rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:border-indigo-600 dark:focus:border-indigo-500 outline-none transition-all"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="sm:col-span-12 lg:col-span-7">
                  <input
                    type="text"
                    placeholder="Descrição detalhada"
                    className="w-full px-4 2xl:px-6 py-3 2xl:py-4 2xl:text-lg rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:border-indigo-600 dark:focus:border-indigo-500 outline-none transition-all"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                
                {/* Opção de Prazo */}
                <div className="sm:col-span-12 lg:col-span-10 flex flex-col sm:flex-row sm:items-center gap-4 mt-2">
                  <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600 dark:bg-slate-700 dark:border-slate-600"
                      checked={hasDueDate}
                      onChange={(e) => setHasDueDate(e.target.checked)}
                    />
                    <span className="2xl:text-lg">Esta tarefa tem prazo de validade?</span>
                  </label>
                  
                  {hasDueDate && (
                    <input
                      type="datetime-local"
                      className="px-4 py-2 2xl:text-lg rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 outline-none transition-all flex-1"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      required={hasDueDate}
                    />
                  )}
                </div>

                <div className="sm:col-span-12 lg:col-span-2 mt-2">
                  <button
                    type="submit"
                    className="w-full h-full min-h-[48px] 2xl:min-h-[64px] flex items-center justify-center gap-2 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-medium px-4 py-3 rounded-lg transition-colors shadow-sm"
                  >
                    <Plus className="w-5 h-5 2xl:w-7 2xl:h-7" />
                    <span className="sr-only lg:not-sr-only 2xl:text-lg">Adicionar</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Task List */}
            <div className="space-y-4 2xl:space-y-6">
              <h2 className="text-xl 2xl:text-3xl font-bold text-slate-800 dark:text-white mb-6 2xl:mb-8">Suas Tarefas</h2>
              
              {loading ? (
                <div className="flex justify-center py-10 2xl:py-16">
                  <div className="animate-spin rounded-full h-10 w-10 2xl:h-14 2xl:w-14 border-b-2 border-indigo-600 dark:border-indigo-500"></div>
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-12 2xl:py-20 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 border-dashed transition-colors duration-200">
                  <p className="text-slate-500 dark:text-slate-400 2xl:text-xl">Nenhuma tarefa encontrada. Adicione uma acima!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 2xl:gap-6">
                  {tasks.map((task) => {
                    const isOverdue = task.due_date && !task.is_completed && new Date(task.due_date) < new Date();
                    return (
                    <div 
                      key={task.id}
                      className={`group flex items-start gap-4 p-5 2xl:p-8 rounded-xl border transition-all duration-200 h-full flex-col ${
                        task.is_completed 
                          ? 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 opacity-75' 
                          : isOverdue
                            ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/50'
                            : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start gap-4 w-full">
                        <button
                          onClick={() => handleToggleComplete(task)}
                          className={`mt-1 flex-shrink-0 transition-colors ${
                            task.is_completed 
                              ? 'text-emerald-500 dark:text-emerald-400 cursor-default' 
                              : 'text-slate-400 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                          }`}
                          disabled={task.is_completed}
                        >
                          {task.is_completed ? <CheckCircle className="w-6 h-6 2xl:w-8 2xl:h-8" /> : <Circle className="w-6 h-6 2xl:w-8 2xl:h-8" />}
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-lg 2xl:text-2xl font-semibold truncate ${
                            task.is_completed ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-800 dark:text-white'
                          }`}>
                            {task.title}
                          </h3>
                          <p className={`mt-1 text-sm 2xl:text-lg ${
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
                          <Trash2 className="w-5 h-5 2xl:w-7 2xl:h-7" />
                        </button>
                      </div>

                      {/* Metadados da Tarefa (Datas) */}
                      <div className="w-full mt-4 pt-4 border-t border-slate-100 dark:border-slate-600/50 flex flex-col gap-2 text-xs 2xl:text-sm">
                        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Criada em: {formatDate(task.created_at)}</span>
                        </div>
                        
                        {task.due_date && (
                          <div className={`flex items-center gap-1 font-medium ${
                            task.is_completed 
                              ? 'text-slate-500 dark:text-slate-400' 
                              : isOverdue 
                                ? 'text-red-600 dark:text-red-400' 
                                : 'text-orange-600 dark:text-orange-400'
                          }`}>
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Prazo: {formatDate(task.due_date)}</span>
                            {isOverdue && !task.is_completed && <span className="ml-1 text-[10px] uppercase bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-sm">Atrasada</span>}
                          </div>
                        )}

                        {task.is_completed && task.completed_at && (
                          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                            <CalendarCheck className="w-3.5 h-3.5" />
                            <span>Concluída em: {formatDate(task.completed_at)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )})}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-slate-500 dark:text-slate-400 text-sm 2xl:text-base">
          <p>&copy; {new Date().getFullYear()} jmath. Todos os direitos reservados.</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="mailto:contato@exemplo.com" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Email</a>
            <span>•</span>
            <a href="https://github.com/jmath" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">GitHub</a>
            <span>•</span>
            <a href="https://linkedin.com/in/jmath" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">LinkedIn</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
