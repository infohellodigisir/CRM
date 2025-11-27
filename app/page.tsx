'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { BarChart3, Users, TrendingUp, Phone, CheckSquare, FileText, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface DashboardMetrics {
  totalContacts: number;
  totalDeals: number;
  totalCalls: number;
  totalTasks: number;
  totalNotes: number;
  totalRevenue: number;
  pipelineValue: number;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalContacts: 0,
    totalDeals: 0,
    totalCalls: 0,
    totalTasks: 0,
    totalNotes: 0,
    totalRevenue: 0,
    pipelineValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentContacts, setRecentContacts] = useState<any[]>([]);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);

      // Fetch contacts
      const { data: contacts, count: contactCount } = await supabase
        .from('contacts')
        .select('*', { count: 'exact' })
        .limit(5);

      // Fetch deals
      const { data: deals, count: dealCount } = await supabase
        .from('deals')
        .select('*', { count: 'exact' });

      // Fetch call logs
      const { count: callCount } = await supabase
        .from('call_logs')
        .select('*', { count: 'exact' });

      // Fetch tasks
      const { count: taskCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact' });

      // Fetch notes
      const { count: noteCount } = await supabase
        .from('notes')
        .select('*', { count: 'exact' });

      // Calculate totals
      const totalRevenue = deals?.reduce((sum, deal) => sum + (deal.value || 0), 0) || 0;
      const pipelineValue = deals?.reduce((sum, deal) => sum + (deal.value || 0), 0) || 0;

      setMetrics({
        totalContacts: contactCount || 0,
        totalDeals: dealCount || 0,
        totalCalls: callCount || 0,
        totalTasks: taskCount || 0,
        totalNotes: noteCount || 0,
        totalRevenue,
        pipelineValue,
      });

      setRecentContacts(contacts || []);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const MetricCard = ({ icon: Icon, label, value, change, trend }: any) => (
    <div className="frappe-card p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="frappe-metric-label">{label}</p>
          <p className="frappe-metric">{value}</p>
          {change && (
            <p className={`frappe-metric-change ${trend === 'up' ? 'positive' : 'negative'}`}>
              {trend === 'up' ? '↑' : '↓'} {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${trend === 'up' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
          <Icon className={`w-6 h-6 ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="frappe-header">Dashboard</h1>
              <p className="frappe-subheader">Welcome back! Here's your sales overview.</p>
            </div>
            <button
              onClick={fetchMetrics}
              className="frappe-button-primary"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={TrendingUp}
            label="Total Revenue"
            value={formatCurrency(metrics.totalRevenue)}
            change="12% from last month"
            trend="up"
          />
          <MetricCard
            icon={BarChart3}
            label="Pipeline Value"
            value={formatCurrency(metrics.pipelineValue)}
            change="8% from last month"
            trend="up"
          />
          <MetricCard
            icon={Users}
            label="Total Contacts"
            value={metrics.totalContacts}
            change="5 new this month"
            trend="up"
          />
          <MetricCard
            icon={TrendingUp}
            label="Total Deals"
            value={metrics.totalDeals}
            change="2 new this week"
            trend="up"
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="frappe-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Total Calls</h3>
              <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.totalCalls}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Calls logged this month</p>
          </div>

          <div className="frappe-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Active Tasks</h3>
              <CheckSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.totalTasks}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Tasks pending</p>
          </div>

          <div className="frappe-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notes</h3>
              <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.totalNotes}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Notes created</p>
          </div>
        </div>

        {/* Recent Contacts */}
        <div className="frappe-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Contacts</h2>
            <Link href="/contacts" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium">
              View All →
            </Link>
          </div>

          {recentContacts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="frappe-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Company</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentContacts.map((contact) => (
                    <tr key={contact.id}>
                      <td className="font-medium">{contact.name}</td>
                      <td>{contact.email}</td>
                      <td>{contact.phone}</td>
                      <td>{contact.company || '-'}</td>
                      <td>
                        <span className={`badge ${contact.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                          {contact.status || 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No contacts yet. Start by adding your first contact.</p>
              <Link href="/contacts" className="frappe-button-primary mt-4 inline-block">
                Add Contact
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/contacts" className="frappe-card p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Manage Contacts</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Add and manage customer contacts</p>
          </Link>

          <Link href="/deals" className="frappe-card p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Sales Pipeline</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Track your deals and opportunities</p>
          </Link>

          <Link href="/calls" className="frappe-card p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <Phone className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Call Logs</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Log and track customer calls</p>
          </Link>

          <Link href="/analytics" className="frappe-card p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400 mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Analytics</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">View detailed sales analytics</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
