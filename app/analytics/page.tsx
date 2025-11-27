'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart3, TrendingUp, Users, Briefcase, Phone, CheckSquare, FileText, RefreshCw } from 'lucide-react';

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    pipelineValue: 0,
    avgDealSize: 0,
    conversionRate: 0,
    totalContacts: 0,
    totalDeals: 0,
    totalCalls: 0,
    activeTasks: 0,
    totalNotes: 0,
    wonDeals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [contacts, deals, calls, tasks, notes] = await Promise.all([
        supabase.from('contacts').select('*'),
        supabase.from('deals').select('*'),
        supabase.from('calls').select('*'),
        supabase.from('tasks').select('*'),
        supabase.from('notes').select('*'),
      ]);

      const dealsData = deals.data || [];
      const totalRevenue = dealsData.filter(d => d.status === 'won').reduce((sum, d) => sum + (d.amount || 0), 0);
      const pipelineValue = dealsData.filter(d => d.status !== 'won' && d.status !== 'lost').reduce((sum, d) => sum + (d.amount || 0), 0);
      const wonDeals = dealsData.filter(d => d.status === 'won').length;
      const conversionRate = dealsData.length > 0 ? ((wonDeals / dealsData.length) * 100).toFixed(1) : 0;

      setMetrics({
        totalRevenue,
        pipelineValue,
        avgDealSize: dealsData.length > 0 ? dealsData.reduce((sum, d) => sum + (d.amount || 0), 0) / dealsData.length : 0,
        conversionRate: parseFloat(conversionRate as string),
        totalContacts: contacts.data?.length || 0,
        totalDeals: dealsData.length,
        totalCalls: calls.data?.length || 0,
        activeTasks: tasks.data?.filter(t => t.status !== 'completed').length || 0,
        totalNotes: notes.data?.length || 0,
        wonDeals,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">View your sales performance and metrics</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary btn-sm" onClick={fetchAnalytics}>
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: '#1a1a2e' }}>Key Metrics</h2>
        <div className="grid grid-4">
          <div className="metric-card">
            <TrendingUp size={32} color="#ff8c00" />
            <div className="metric-value">₹{(metrics.totalRevenue / 100000).toFixed(1)}L</div>
            <div className="metric-label">Total Revenue</div>
          </div>
          <div className="metric-card">
            <BarChart3 size={32} color="#ff8c00" />
            <div className="metric-value">₹{(metrics.pipelineValue / 100000).toFixed(1)}L</div>
            <div className="metric-label">Pipeline Value</div>
          </div>
          <div className="metric-card">
            <Briefcase size={32} color="#ff8c00" />
            <div className="metric-value">₹{(metrics.avgDealSize / 100000).toFixed(1)}L</div>
            <div className="metric-label">Avg Deal Size</div>
          </div>
          <div className="metric-card">
            <TrendingUp size={32} color="#ff8c00" />
            <div className="metric-value">{metrics.conversionRate}%</div>
            <div className="metric-label">Conversion Rate</div>
          </div>
        </div>
      </div>

      {/* Sales Pipeline */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: '#1a1a2e' }}>Sales Pipeline</h2>
        <div className="grid grid-3">
          <div className="metric-card">
            <Users size={32} color="#ff8c00" />
            <div className="metric-value">{metrics.totalContacts}</div>
            <div className="metric-label">Total Contacts</div>
          </div>
          <div className="metric-card">
            <Briefcase size={32} color="#ff8c00" />
            <div className="metric-value">{metrics.totalDeals}</div>
            <div className="metric-label">Total Deals</div>
          </div>
          <div className="metric-card">
            <TrendingUp size={32} color="#27ae60" />
            <div className="metric-value">{metrics.wonDeals}</div>
            <div className="metric-label">Won Deals</div>
          </div>
        </div>
      </div>

      {/* Activity Metrics */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: '#1a1a2e' }}>Activity Metrics</h2>
        <div className="grid grid-3">
          <div className="metric-card">
            <Phone size={32} color="#ff8c00" />
            <div className="metric-value">{metrics.totalCalls}</div>
            <div className="metric-label">Total Calls</div>
          </div>
          <div className="metric-card">
            <CheckSquare size={32} color="#ff8c00" />
            <div className="metric-value">{metrics.activeTasks}</div>
            <div className="metric-label">Active Tasks</div>
          </div>
          <div className="metric-card">
            <FileText size={32} color="#ff8c00" />
            <div className="metric-value">{metrics.totalNotes}</div>
            <div className="metric-label">Total Notes</div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="card">
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#1a1a2e' }}>Performance Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div>
            <p style={{ fontSize: '13px', color: '#7f8c8d', marginBottom: '8px', fontWeight: '600' }}>Revenue Target</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, height: '8px', backgroundColor: '#e8e8e8', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: '#ff8c00', width: '65%' }}></div>
              </div>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a2e' }}>65%</span>
            </div>
          </div>
          <div>
            <p style={{ fontSize: '13px', color: '#7f8c8d', marginBottom: '8px', fontWeight: '600' }}>Pipeline Target</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, height: '8px', backgroundColor: '#e8e8e8', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: '#ff8c00', width: '45%' }}></div>
              </div>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a2e' }}>45%</span>
            </div>
          </div>
          <div>
            <p style={{ fontSize: '13px', color: '#7f8c8d', marginBottom: '8px', fontWeight: '600' }}>Activity Target</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, height: '8px', backgroundColor: '#e8e8e8', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: '#ff8c00', width: '80%' }}></div>
              </div>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a2e' }}>80%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
