'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart3, Users, Briefcase, Phone, CheckSquare, FileText, TrendingUp, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    pipelineValue: 0,
    totalContacts: 0,
    totalDeals: 0,
    totalCalls: 0,
    activeTasks: 0,
    totalNotes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const [contacts, deals, calls, tasks, notes] = await Promise.all([
        supabase.from('contacts').select('*'),
        supabase.from('deals').select('*'),
        supabase.from('calls').select('*'),
        supabase.from('tasks').select('*'),
        supabase.from('notes').select('*'),
      ]);

      const totalRevenue = deals.data?.reduce((sum, deal) => sum + (deal.amount || 0), 0) || 0;
      const pipelineValue = deals.data?.reduce((sum, deal) => {
        if (deal.status !== 'won' && deal.status !== 'lost') {
          return sum + (deal.amount || 0);
        }
        return sum;
      }, 0) || 0;

      setMetrics({
        totalRevenue,
        pipelineValue,
        totalContacts: contacts.data?.length || 0,
        totalDeals: deals.data?.length || 0,
        totalCalls: calls.data?.length || 0,
        activeTasks: tasks.data?.filter(t => t.status !== 'completed').length || 0,
        totalNotes: notes.data?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's your sales overview.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary btn-sm" onClick={fetchMetrics}>
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-4">
        <div className="metric-card">
          <TrendingUp size={32} color="#ff8c00" />
          <div className="metric-value">₹{(metrics.totalRevenue / 100000).toFixed(1)}L</div>
          <div className="metric-label">Total Revenue</div>
          <div className="metric-change">↑ 12% from last month</div>
        </div>

        <div className="metric-card">
          <BarChart3 size={32} color="#ff8c00" />
          <div className="metric-value">₹{(metrics.pipelineValue / 100000).toFixed(1)}L</div>
          <div className="metric-label">Pipeline Value</div>
          <div className="metric-change">↑ 8% from last month</div>
        </div>

        <div className="metric-card">
          <Users size={32} color="#ff8c00" />
          <div className="metric-value">{metrics.totalContacts}</div>
          <div className="metric-label">Total Contacts</div>
          <div className="metric-change">↑ 5 new this month</div>
        </div>

        <div className="metric-card">
          <Briefcase size={32} color="#ff8c00" />
          <div className="metric-value">{metrics.totalDeals}</div>
          <div className="metric-label">Total Deals</div>
          <div className="metric-change">↑ 2 new this week</div>
        </div>

        <div className="metric-card">
          <Phone size={32} color="#ff8c00" />
          <div className="metric-value">{metrics.totalCalls}</div>
          <div className="metric-label">Total Calls</div>
          <div className="metric-change">Calls logged this month</div>
        </div>

        <div className="metric-card">
          <CheckSquare size={32} color="#ff8c00" />
          <div className="metric-value">{metrics.activeTasks}</div>
          <div className="metric-label">Active Tasks</div>
          <div className="metric-change">Tasks pending</div>
        </div>

        <div className="metric-card">
          <FileText size={32} color="#ff8c00" />
          <div className="metric-value">{metrics.totalNotes}</div>
          <div className="metric-label">Notes</div>
          <div className="metric-change">Notes created</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px', color: '#1a1a2e' }}>
          Quick Actions
        </h2>
        <div className="grid grid-2">
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <Users size={32} color="#ff8c00" />
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a2e' }}>Manage Contacts</h3>
                <p style={{ fontSize: '13px', color: '#7f8c8d' }}>Add and manage customer contacts</p>
              </div>
            </div>
            <a href="/contacts" className="btn btn-primary btn-sm">
              Go to Contacts
            </a>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <Briefcase size={32} color="#ff8c00" />
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a2e' }}>Sales Pipeline</h3>
                <p style={{ fontSize: '13px', color: '#7f8c8d' }}>Track your deals and opportunities</p>
              </div>
            </div>
            <a href="/deals" className="btn btn-primary btn-sm">
              Go to Deals
            </a>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <Phone size={32} color="#ff8c00" />
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a2e' }}>Call Logs</h3>
                <p style={{ fontSize: '13px', color: '#7f8c8d' }}>Log and track customer calls</p>
              </div>
            </div>
            <a href="/calls" className="btn btn-primary btn-sm">
              Go to Calls
            </a>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <BarChart3 size={32} color="#ff8c00" />
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a2e' }}>Analytics</h3>
                <p style={{ fontSize: '13px', color: '#7f8c8d' }}>View detailed sales analytics</p>
              </div>
            </div>
            <a href="/analytics" className="btn btn-primary btn-sm">
              Go to Analytics
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
