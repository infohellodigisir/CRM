'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Edit2, TrendingUp } from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  contact_id: string;
  value: number;
  stage: string;
  probability: number;
  expected_close_date: string;
  created_at: string;
}

const STAGES = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];

export default function Deals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    contact_id: '',
    value: 0,
    stage: 'Lead',
    probability: 50,
    expected_close_date: '',
  });

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });

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
      const { error } = await supabase
        .from('deals')
        .insert([formData]);

      if (error) throw error;

      setFormData({
        title: '',
        contact_id: '',
        value: 0,
        stage: 'Lead',
        probability: 50,
        expected_close_date: '',
      });
      setShowForm(false);
      fetchDeals();
    } catch (error) {
      console.error('Error adding deal:', error);
    }
  };

  const handleDeleteDeal = async (id: string) => {
    if (!confirm('Are you sure you want to delete this deal?')) return;

    try {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchDeals();
    } catch (error) {
      console.error('Error deleting deal:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStageColor = (stage: string) => {
    const colors: { [key: string]: string } = {
      Lead: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
      Qualified: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
      Proposal: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
      Negotiation: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
      Won: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      Lost: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    };
    return colors[stage] || 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
  };

  const dealsByStage = STAGES.map((stage) => ({
    stage,
    deals: deals.filter((d) => d.stage === stage),
    total: deals
      .filter((d) => d.stage === stage)
      .reduce((sum, d) => sum + d.value, 0),
  }));

  const totalPipelineValue = deals.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="frappe-header">Sales Pipeline</h1>
              <p className="frappe-subheader">Manage your deals and opportunities</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="frappe-button-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Deal
            </button>
          </div>

          {/* Pipeline Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="frappe-card p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Pipeline Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalPipelineValue)}</p>
            </div>
            <div className="frappe-card p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Deals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{deals.length}</p>
            </div>
            <div className="frappe-card p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Average Deal Size</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {deals.length > 0 ? formatCurrency(totalPipelineValue / deals.length) : '₹0'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Deal Form */}
        {showForm && (
          <div className="frappe-card p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Deal</h2>
            <form onSubmit={handleAddDeal} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Deal Title *</label>
                <input
                  type="text"
                  required
                  className="frappe-input"
                  placeholder="Deal name"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Deal Value (₹) *</label>
                <input
                  type="number"
                  required
                  className="frappe-input"
                  placeholder="0"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Stage</label>
                <select
                  className="frappe-input"
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                >
                  {STAGES.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Probability (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="frappe-input"
                  value={formData.probability}
                  onChange={(e) => setFormData({ ...formData, probability: parseInt(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Expected Close Date</label>
                <input
                  type="date"
                  className="frappe-input"
                  value={formData.expected_close_date}
                  onChange={(e) => setFormData({ ...formData, expected_close_date: e.target.value })}
                />
              </div>

              <div className="md:col-span-2 flex gap-3">
                <button type="submit" className="frappe-button-primary flex-1">
                  Save Deal
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

        {/* Kanban Board */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading deals...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dealsByStage.map(({ stage, deals: stageDeal, total }) => (
              <div key={stage} className="frappe-card p-4">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{stage}</h3>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {stageDeal.length}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(total)}</p>
                </div>

                <div className="space-y-3">
                  {stageDeal.length > 0 ? (
                    stageDeal.map((deal) => (
                      <div
                        key={deal.id}
                        className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm flex-1">{deal.title}</h4>
                          <div className="flex gap-1">
                            <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors">
                              <Edit2 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                            </button>
                            <button
                              onClick={() => handleDeleteDeal(deal.id)}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                            >
                              <Trash2 className="w-3 h-3 text-red-600 dark:text-red-400" />
                            </button>
                          </div>
                        </div>

                        <p className="text-lg font-bold text-green-600 dark:text-green-400 mb-2">
                          {formatCurrency(deal.value)}
                        </p>

                        <div className="flex items-center justify-between text-xs">
                          <span className={`badge ${getStageColor(deal.stage)}`}>{deal.stage}</span>
                          <span className="text-gray-600 dark:text-gray-400">{deal.probability}%</span>
                        </div>

                        {deal.expected_close_date && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                            Close: {new Date(deal.expected_close_date).toLocaleDateString('en-IN')}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <p className="text-sm">No deals in this stage</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
