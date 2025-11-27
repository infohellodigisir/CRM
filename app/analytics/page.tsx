'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { TrendingUp, Users, BarChart3, Phone, CheckSquare, FileText } from 'lucide-react';

interface Analytics {
  totalRevenue: number;
  pipelineValue: number;
  avgDealSize: number;
  conversionRate: number;
  totalContacts: number;
  totalDeals: number;
  totalCalls: number;
  totalTasks: number;
  totalNotes: number;
  dealsByStage: { [key: string]: number };
  callsByType: { [key: string]: number };
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalRevenue: 0,
    pipelineValue: 0,
    avgDealSize: 0,
    conversionRate: 0,
    totalContacts: 0,
    totalDeals: 0,
    totalCalls: 0,
    totalTasks: 0,
    totalNotes: 0,
    dealsByStage: {},
    callsByType: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch all data
      const [contactsRes, dealsRes, callsRes, tasksRes, notesRes] = await Promise.all([
        supabase.from('contacts').select('*', { count: 'exact' }),
        supabase.from('deals').select('*', { count: 'exact' }),
        supabase.from('call_logs').select('*', { count: 'exact' }),
        supabase.from('tasks').select('*', { count: 'exact' }),
        supabase.from('notes').select('*', { count: 'exact' }),
      ]);

      const contacts = contactsRes.data || [];
      const deals = dealsRes.data || [];
      const calls = callsRes.data || [];
      const tasks = tasksRes.data || [];
      const notes = notesRes.data || [];

      // Calculate metrics
      const totalRevenue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);
      const pipelineValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);
      const avgDealSize = deals.length > 0 ? totalRevenue / deals.length : 0;
      const wonDeals = deals.filter((d) => d.stage === 'Won').length;
      const conversionRate = deals.length > 0 ? (wonDeals / deals.length) * 100 : 0;

      // Deals by stage
      const dealsByStage: { [key: string]: number } = {};
      deals.forEach((deal) => {
        dealsByStage[deal.stage] = (dealsByStage[deal.stage] || 0) + 1;
      });

      // Calls by type
      const callsByType: { [key: string]: number } = {};
      calls.forEach((call) => {
        callsByType[call.call_type] = (callsByType[call.call_type] || 0) + 1;
      });

      setAnalytics({
        totalRevenue,
        pipelineValue,
        avgDealSize,
        conversionRate,
        totalContacts: contactsRes.count || 0,
        totalDeals: dealsRes.count || 0,
        totalCalls: callsRes.count || 0,
        totalTasks: tasksRes.count || 0,
        totalNotes: notesRes.count || 0,
        dealsByStage,
        callsByType,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
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

  const MetricCard = ({ icon: Icon, label, value, subtext, color }: any) => (
    <div className="frappe-card p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="frappe-metric-label">{label}</p>
          <p className="frappe-metric">{value}</p>
          {subtext && <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6" />
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
              <h1 className="frappe-header">Analytics</h1>
              <p className="frappe-subheader">Track your sales performance and metrics</p>
            </div>
            <button
              onClick={fetchAnalytics}
              className="frappe-button-primary"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading analytics...</p>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                icon={TrendingUp}
                label="Total Revenue"
                value={formatCurrency(analytics.totalRevenue)}
                subtext="From all deals"
                color="bg-green-100 dark:bg-green-900"
              />
              <MetricCard
                icon={BarChart3}
                label="Pipeline Value"
                value={formatCurrency(analytics.pipelineValue)}
                subtext="Current pipeline"
                color="bg-blue-100 dark:bg-blue-900"
              />
              <MetricCard
                icon={TrendingUp}
                label="Avg Deal Size"
                value={formatCurrency(analytics.avgDealSize)}
                subtext="Average per deal"
                color="bg-purple-100 dark:bg-purple-900"
              />
              <MetricCard
                icon={BarChart3}
                label="Conversion Rate"
                value={`${analytics.conversionRate.toFixed(1)}%`}
                subtext="Won vs Total"
                color="bg-orange-100 dark:bg-orange-900"
              />
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <MetricCard
                icon={Users}
                label="Total Contacts"
                value={analytics.totalContacts}
                subtext="Active contacts"
                color="bg-blue-100 dark:bg-blue-900"
              />
              <MetricCard
                icon={BarChart3}
                label="Total Deals"
                value={analytics.totalDeals}
                subtext="All opportunities"
                color="bg-green-100 dark:bg-green-900"
              />
              <MetricCard
                icon={Phone}
                label="Total Calls"
                value={analytics.totalCalls}
                subtext="Logged calls"
                color="bg-purple-100 dark:bg-purple-900"
              />
            </div>

            {/* Sales Pipeline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="frappe-card p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Sales Pipeline</h2>
                <div className="space-y-4">
                  {Object.entries(analytics.dealsByStage).length > 0 ? (
                    Object.entries(analytics.dealsByStage).map(([stage, count]) => (
                      <div key={stage}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{stage}</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-600 dark:bg-green-500 h-2 rounded-full"
                            style={{
                              width: `${(count / Math.max(...Object.values(analytics.dealsByStage))) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-center py-8">No deals yet</p>
                  )}
                </div>
              </div>

              {/* Call Statistics */}
              <div className="frappe-card p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Call Statistics</h2>
                <div className="space-y-4">
                  {Object.entries(analytics.callsByType).length > 0 ? (
                    Object.entries(analytics.callsByType).map(([type, count]) => (
                      <div key={type}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                            {type} Calls
                          </span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full"
                            style={{
                              width: `${(count / Math.max(...Object.values(analytics.callsByType))) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-center py-8">No calls yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="frappe-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Active Tasks</h3>
                  <CheckSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.totalTasks}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Tasks pending</p>
              </div>

              <div className="frappe-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notes</h3>
                  <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.totalNotes}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Notes created</p>
              </div>

              <div className="frappe-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Performance</h3>
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {((analytics.totalDeals / Math.max(analytics.totalContacts, 1)) * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Deal conversion ratio</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
