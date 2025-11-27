'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckSquare, Plus } from 'lucide-react';

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'pending', priority: 'medium' });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
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
      const { error } = await supabase.from('tasks').insert([formData]);
      if (error) throw error;
      setFormData({ title: '', description: '', status: 'pending', priority: 'medium' });
      setShowForm(false);
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const priorityColors: { [key: string]: string } = {
    low: '#3498db',
    medium: '#f39c12',
    high: '#e74c3c',
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">Manage your tasks and to-do items</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={18} />
            Add Task
          </button>
        </div>
      </div>

      <div className="grid grid-4" style={{ marginBottom: '30px' }}>
        <div className="metric-card">
          <CheckSquare size={32} color="#ff8c00" />
          <div className="metric-value">{tasks.length}</div>
          <div className="metric-label">Total Tasks</div>
        </div>
        <div className="metric-card">
          <CheckSquare size={32} color="#27ae60" />
          <div className="metric-value">{tasks.filter(t => t.status === 'completed').length}</div>
          <div className="metric-label">Completed</div>
        </div>
        <div className="metric-card">
          <CheckSquare size={32} color="#f39c12" />
          <div className="metric-value">{tasks.filter(t => t.status === 'pending').length}</div>
          <div className="metric-label">Pending</div>
        </div>
        <div className="metric-card">
          <CheckSquare size={32} color="#e74c3c" />
          <div className="metric-value">{tasks.filter(t => t.priority === 'high').length}</div>
          <div className="metric-label">High Priority</div>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#1a1a2e' }}>Add New Task</h3>
          <form onSubmit={handleAddTask}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Task Title *</label>
                <input type="text" className="form-input" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="form-input" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-input" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn btn-primary">Save Task</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="empty-state">
          <div className="loading" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: '16px', color: '#7f8c8d' }}>Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <CheckSquare size={64} style={{ opacity: 0.3, margin: '0 auto' }} />
          <h3 className="empty-state-title">No tasks yet</h3>
          <p className="empty-state-text">Create your first task to get started</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={18} />
            Add First Task
          </button>
        </div>
      ) : (
        <div className="grid grid-2">
          {tasks.map((task) => (
            <div key={task.id} className="card">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a2e', flex: 1 }}>{task.title}</h3>
                <span className="badge" style={{ backgroundColor: priorityColors[task.priority] + '20', color: priorityColors[task.priority] }}>
                  {task.priority}
                </span>
              </div>
              {task.description && <p style={{ fontSize: '13px', color: '#7f8c8d', marginBottom: '12px' }}>{task.description}</p>}
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <span className="badge badge-info">{task.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
