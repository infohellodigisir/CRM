'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Edit2, Phone, Clock } from 'lucide-react';

interface CallLog {
  id: string;
  contact_id: string;
  contact_name: string;
  duration: number;
  call_type: string;
  notes: string;
  created_at: string;
}

export default function Calls() {
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    contact_name: '',
    contact_id: '',
    duration: 0,
    call_type: 'inbound',
    notes: '',
  });

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('call_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCalls(data || []);
    } catch (error) {
      console.error('Error fetching calls:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCall = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('call_logs')
        .insert([formData]);

      if (error) throw error;

      setFormData({
        contact_name: '',
        contact_id: '',
        duration: 0,
        call_type: 'inbound',
        notes: '',
      });
      setShowForm(false);
      fetchCalls();
    } catch (error) {
      console.error('Error adding call:', error);
    }
  };

  const handleDeleteCall = async (id: string) => {
    if (!confirm('Are you sure you want to delete this call log?')) return;

    try {
      const { error } = await supabase
        .from('call_logs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchCalls();
    } catch (error) {
      console.error('Error deleting call:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };

  const totalDuration = calls.reduce((sum, call) => sum + call.duration, 0);
  const avgDuration = calls.length > 0 ? Math.round(totalDuration / calls.length) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="frappe-header">Call Logs</h1>
              <p className="frappe-subheader">Track and manage customer calls</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="frappe-button-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Log Call
            </button>
          </div>

          {/* Call Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="frappe-card p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Calls</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{calls.length}</p>
            </div>
            <div className="frappe-card p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Duration</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatDuration(totalDuration)}</p>
            </div>
            <div className="frappe-card p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Duration</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatDuration(avgDuration)}</p>
            </div>
            <div className="frappe-card p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Inbound Calls</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {calls.filter((c) => c.call_type === 'inbound').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Call Form */}
        {showForm && (
          <div className="frappe-card p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Log New Call</h2>
            <form onSubmit={handleAddCall} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Contact Name *</label>
                <input
                  type="text"
                  required
                  className="frappe-input"
                  placeholder="Contact name"
                  value={formData.contact_name}
                  onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Call Type</label>
                <select
                  className="frappe-input"
                  value={formData.call_type}
                  onChange={(e) => setFormData({ ...formData, call_type: e.target.value })}
                >
                  <option value="inbound">Inbound</option>
                  <option value="outbound">Outbound</option>
                  <option value="missed">Missed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Duration (seconds) *</label>
                <input
                  type="number"
                  required
                  className="frappe-input"
                  placeholder="0"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact ID</label>
                <input
                  type="text"
                  className="frappe-input"
                  placeholder="Contact ID (optional)"
                  value={formData.contact_id}
                  onChange={(e) => setFormData({ ...formData, contact_id: e.target.value })}
                />
              </div>

              <div className="md:col-span-2 form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="frappe-input"
                  placeholder="Call notes..."
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="md:col-span-2 flex gap-3">
                <button type="submit" className="frappe-button-primary flex-1">
                  Save Call
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

        {/* Call Logs List */}
        <div className="frappe-card overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading call logs...</p>
            </div>
          ) : calls.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="frappe-table">
                <thead>
                  <tr>
                    <th>Contact</th>
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Notes</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {calls.map((call) => (
                    <tr key={call.id}>
                      <td className="font-medium">{call.contact_name}</td>
                      <td>
                        <span
                          className={`badge ${
                            call.call_type === 'inbound'
                              ? 'badge-success'
                              : call.call_type === 'outbound'
                              ? 'badge-info'
                              : 'badge-warning'
                          }`}
                        >
                          {call.call_type}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          {formatDuration(call.duration)}
                        </div>
                      </td>
                      <td className="text-gray-600 dark:text-gray-400 max-w-xs truncate">{call.notes || '-'}</td>
                      <td className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(call.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleDeleteCall(call.id)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Phone className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">No call logs yet. Start logging calls to track customer interactions.</p>
              <button
                onClick={() => setShowForm(true)}
                className="frappe-button-primary"
              >
                Log First Call
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
