'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus } from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  contact_id: string;
  expected_close_date: string;
}

const stages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];
const stageColors: Record<string, string> = {
  Lead: 'bg-gray-100 dark:bg-gray-700',
  Qualified: 'bg-blue-100 dark:bg-blue-900',
  Proposal: 'bg-purple-100 dark:bg-purple-900',
  Negotiation: 'bg-yellow-100 dark:bg-yellow-900',
  Won: 'bg-green-100 dark:bg-green-900',
  Lost: 'bg-red-100 dark:bg-red-900',
};

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    stage: 'Lead',
    contact_id: '',
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
        .insert([{
          ...formData,
          value: parseInt(formData.value),
        }]);

      if (error) throw error;
      
      setFormData({
        title: '',
        value: '',
        stage: 'Lead',
        contact_id: '',
        expected_close_date: '',
      });
      setShowForm(false);
      fetchDeals();
    } catch (error) {
      console.error('Error adding deal:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const dealsByStage = stages.map(stage => ({
    stage,
    deals: deals.filter(d => d.stage === stage),
    total: deals
      .filter(d => d.stage === stage)
      .reduce((sum, d) => sum + (d.value || 0), 0),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Deals</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your sales pipeline</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Deal
        </button>
      </div>

      {/* Add Deal Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Deal</h2>
          <form onSubmit={handleAddDeal} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Deal Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
            <input
              type="number"
              placeholder="Deal Value (₹)"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
            <select
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {stages.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
            <input
              type="date"
              value={formData.expected_close_date}
              onChange={(e) => setFormData({ ...formData, expected_close_date: e.target.value })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              type="submit"
              className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Save Deal
            </button>
          </form>
        </div>
      )}

      {/* Kanban Board */}
      {loading ? (
        <div className="text-center text-gray-600 dark:text-gray-400">Loading deals...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dealsByStage.map(({ stage, deals: stageDeal, total }) => (
            <div key={stage} className={`${stageColors[stage]} rounded-lg p-4`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white">{stage}</h3>
                <span className="bg-white dark:bg-gray-700 px-2 py-1 rounded text-sm font-medium text-gray-900 dark:text-white">
                  {stageDeal.length}
                </span>
              </div>
              <div className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                Total: {formatCurrency(total)}
              </div>
              <div className="space-y-3">
                {stageDeal.map(deal => (
                  <div key={deal.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{deal.title}</p>
                    <p className="text-blue-600 dark:text-blue-400 font-bold text-sm mt-1">
                      {formatCurrency(deal.value)}
                    </p>
                    {deal.expected_close_date && (
                      <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                        Close: {new Date(deal.expected_close_date).toLocaleDateString('en-IN')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
