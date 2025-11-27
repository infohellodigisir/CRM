'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Briefcase, Plus, TrendingUp } from 'lucide-react';

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    status: 'lead',
    contact_id: '',
  });

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('deals').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setDeals(data || []);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('deals').insert([
        {
          ...formData,
          amount: parseFloat(formData.amount),
        },
      ]);
      if (error) throw error;
      setFormData({ title: '', amount: '', status: 'lead', contact_id: '' });
      setShowForm(false);
      fetchDeals();
    } catch (error) {
      console.error('Error adding deal:', error);
    }
  };

  const statuses = ['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
  const statusColors: { [key: string]: string } = {
    lead: '#3498db',
    qualified: '#9b59b6',
    proposal: '#f39c12',
    negotiation: '#e74c3c',
    won: '#27ae60',
    lost: '#95a5a6',
  };

  const dealsByStatus = statuses.map((status) => ({
    status,
    deals: deals.filter((d) => d.status === status),
    total: deals.filter((d) => d.status === status).reduce((sum, d) => sum + (d.amount || 0), 0),
  }));

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Sales Pipeline</h1>
          <p className="page-subtitle">Track your deals and opportunities</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={18} />
            Add Deal
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-3" style={{ marginBottom: '30px' }}>
        <div className="metric-card">
          <TrendingUp size={32} color="#ff8c00" />
          <div className="metric-value">₹{(deals.reduce((sum, d) => sum + (d.amount || 0), 0) / 100000).toFixed(1)}L</div>
          <div className="metric-label">Total Pipeline Value</div>
        </div>
        <div className="metric-card">
          <Briefcase size={32} color="#ff8c00" />
          <div className="metric-value">{deals.length}</div>
          <div className="metric-label">Total Deals</div>
        </div>
        <div className="metric-card">
          <TrendingUp size={32} color="#ff8c00" />
          <div className="metric-value">₹{deals.length > 0 ? (deals.reduce((sum, d) => sum + (d.amount || 0), 0) / deals.length / 100000).toFixed(1) : '0'}L</div>
          <div className="metric-label">Average Deal Size</div>
        </div>
      </div>

      {/* Add Deal Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#1a1a2e' }}>
            Add New Deal
          </h3>
          <form onSubmit={handleAddDeal}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Deal Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Amount (₹) *</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-input"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button type="submit" className="btn btn-primary">
                Save Deal
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Deals by Status */}
      {loading ? (
        <div className="empty-state">
          <div className="loading" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: '16px', color: '#7f8c8d' }}>Loading deals...</p>
        </div>
      ) : deals.length === 0 ? (
        <div className="empty-state">
          <Briefcase size={64} style={{ opacity: 0.3, margin: '0 auto' }} />
          <h3 className="empty-state-title">No deals yet</h3>
          <p className="empty-state-text">Create your first deal to get started</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={18} />
            Add First Deal
          </button>
        </div>
      ) : (
        <div className="grid grid-2">
          {dealsByStatus.map((stage) => (
            <div key={stage.status} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: statusColors[stage.status],
                  }}
                ></div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a2e', flex: 1 }}>
                  {stage.status.charAt(0).toUpperCase() + stage.status.slice(1)}
                </h3>
                <span className="badge badge-info">{stage.deals.length}</span>
              </div>

              <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e8e8e8' }}>
                <p style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '4px' }}>Total Value</p>
                <p style={{ fontSize: '20px', fontWeight: '700', color: '#ff8c00' }}>
                  ₹{(stage.total / 100000).toFixed(1)}L
                </p>
              </div>

              {stage.deals.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#7f8c8d', textAlign: 'center', padding: '20px 0' }}>
                  No deals in this stage
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {stage.deals.map((deal) => (
                    <div
                      key={deal.id}
                      style={{
                        padding: '12px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '6px',
                        borderLeft: `3px solid ${statusColors[stage.status]}`,
                      }}
                    >
                      <p style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a2e', marginBottom: '4px' }}>
                        {deal.title}
                      </p>
                      <p style={{ fontSize: '12px', color: '#ff8c00', fontWeight: '700' }}>
                        ₹{(deal.amount / 100000).toFixed(1)}L
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
