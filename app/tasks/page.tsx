'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Edit2, CheckCircle2, Circle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  due_date: string;
  created_at: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    due_date: '',
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('tasks')
        .insert([formData]);

      if (error) throw error;

      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        due_date: '',
      });
      setShowForm(false);
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleTask = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      high: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
      medium: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
      low: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    };
    return colors[priority] || 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      completed: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      pending: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
      in_progress: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
    };
    return colors[status] || 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
  };

  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;
  const highPriorityTasks = tasks.filter((t) => t.priority === 'high' && t.status !== 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="frappe-header">Tasks</h1>
              <p className="frappe-subheader">Manage your work and stay organized</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="frappe-button-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>

          {/* Task Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="frappe-card p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{tasks.length}</p>
            </div>
            <div className="frappe-card p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{completedTasks}</p>
            </div>
            <div className="frappe-card p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{pendingTasks}</p>
            </div>
            <div className="frappe-card p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">High Priority</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{highPriorityTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Task Form */}
        {showForm && (
          <div className="frappe-card p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Task</h2>
            <form onSubmit={handleAddTask} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 form-group">
                <label className="form-label">Task Title *</label>
                <input
                  type="text"
                  required
                  className="frappe-input"
                  placeholder="Task title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="md:col-span-2 form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="frappe-input"
                  placeholder="Task description..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="frappe-input"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="frappe-input"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="frappe-input"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>

              <div className="md:col-span-2 flex gap-3">
                <button type="submit" className="frappe-button-primary flex-1">
                  Save Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="frappe-button-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {loading ? (
            <div className="frappe-card p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading tasks...</p>
            </div>
          ) : tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`frappe-card p-6 transition-all ${
                  task.status === 'completed' ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => handleToggleTask(task.id, task.status)}
                    className="mt-1 flex-shrink-0 transition-colors"
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3
                        className={`text-lg font-semibold ${
                          task.status === 'completed'
                            ? 'line-through text-gray-500 dark:text-gray-400'
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {task.title}
                      </h3>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-3">{task.description}</p>
                    )}

                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`badge ${getPriorityColor(task.priority)}`}>
                        {task.priority} priority
                      </span>
                      <span className={`badge ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      {task.due_date && (
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Due: {new Date(task.due_date).toLocaleDateString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="frappe-card p-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">No tasks yet. Create your first task to get started.</p>
              <button
                onClick={() => setShowForm(true)}
                className="frappe-button-primary"
              >
                Add First Task
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
