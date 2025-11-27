'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Phone, Plus, Clock } from 'lucide-react';

export default function CallsPage() {
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ contact_name: '', phone_number: '', duration: '', type: 'inbound', notes: '' });

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('calls').select('*').order('created_at', { ascending: false });
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
      const { error } = await supabase.from('calls').insert([formData]);
      if (error) throw error;
      setFormData({ contact_name: '', phone_number: '', duration: '', type: 'inbound', notes: '' });
      setShowForm(false);
      fetchCalls();
    } catch (error) {
      console.error('Error adding call:', error);
    }
  };

  const totalDuration = calls.reduce((sum, call) => sum + (parseInt(call.duration) || 0), 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Call Logs</h1>
          <p className="page-subtitle">Track and manage customer calls</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={18} />
            Log Call
          </button>
        </div>
      </div>

      <div className="grid grid-4" style={{ marginBottom: '30px' }}>
        <div className="metric-card">
          <Phone size={32} color="#ff8c00" />
          <div className="metric-value">{calls.length}</div>
          <div className="metric-label">Total Calls</div>
        </div>
        <div className="metric-card">
          <Clock size={32} color="#ff8c00" />
          <div className="metric-value">{totalDuration}m</div>
          <div className="metric-label">Total Duration</div>
        </div>
        <div className="metric-card">
          <Clock size={32} color="#ff8c00" />
          <div className="metric-value">{calls.length > 0 ? Math.round(totalDuration / calls.length) : 0}m</div>
          <div className="metric-label">Avg Duration</div>
        </div>
        <div className="metric-card">
          <Phone size={32} color="#ff8c00" />
          <div className="metric-value">{calls.filter(c => c.type === 'inbound').length}</div>
          <div className="metric-label">Inbound Calls</div>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#1a1a2e' }}>Log New Call</h3>
          <form onSubmit={handleAddCall}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Contact Name *</label>
                <input type="text" className="form-input" value={formData.contact_name} onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-input" value={formData.phone_number} onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Duration (minutes)</label>
                <input type="number" className="form-input" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Call Type</label>
                <select className="form-input" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                  <option value="inbound">Inbound</option>
                  <option value="outbound">Outbound</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea className="form-textarea" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn btn-primary">Save Call</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="empty-state">
          <div className="loading" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: '16px', color: '#7f8c8d' }}>Loading calls...</p>
        </div>
      ) : calls.length === 0 ? (
        <div className="empty-state">
          <Phone size={64} style={{ opacity: 0.3, margin: '0 auto' }} />
          <h3 className="empty-state-title">No calls logged yet</h3>
          <p className="empty-state-text">Log your first call to get started</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={18} />
            Log First Call
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {calls.map((call) => (
            <div key={call.id} className="card">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a2e', marginBottom: '8px' }}>
                    {call.contact_name}
                  </h3>
                  {call.phone_number && (
                    <p style={{ fontSize: '13px', color: '#7f8c8d', marginBottom: '8px' }}>
                      📞 {call.phone_number}
                    </p>
                  )}
                  {call.notes && (
                    <p style={{ fontSize: '13px', color: '#7f8c8d' }}>
                      {call.notes}
                    </p>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge" style={{ backgroundColor: call.type === 'inbound' ? '#d1ecf1' : '#d4edda', color: call.type === 'inbound' ? '#0c5460' : '#155724' }}>
                    {call.type}
                  </span>
                  {call.duration && (
                    <p style={{ fontSize: '13px', color: '#ff8c00', fontWeight: '700', marginTop: '8px' }}>
                      {call.duration} min
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
