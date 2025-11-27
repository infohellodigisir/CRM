'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { TrendingUp, Users, Briefcase, Phone } from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
}

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
}

interface CallLog {
  id: string;
  duration: number;
}

export default function AnalyticsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const { data: dealsData } = await supabase.from('deals').select('*');
      const { data: contactsData } = await supabase.from('contacts').select('*');
      const { data: callsData } = await supabase.from('call_logs').select('*');

      setDeals(dealsData || []);
      setContacts(contactsData || []);
      setCalls(callsData || []);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const totalRevenue = deals
    .filter(d => d.stage === 'Won')
    .reduce((sum, d) => sum + (d.value || 0), 0);

  const pipelineValue = deals
    .filter(d => d.stage !== 'Won' && d.stage !== 'Lost')
    .reduce((sum, d) => sum + (d.value || 0), 0);

  const avgDealSize = deals.length > 0
    ? deals.reduce((sum, d) => sum + (d.value || 0), 0) / deals.length
    : 0;

  const conversionRate = deals.length > 0
    ? ((deals.filter(d => d.stage === 'Won').length / deals.length) * 100).toFixed(1)
    : 0;

  const totalCallDuration = calls.reduce((sum, c) => sum + (c.duration || 0), 0);
  const avgCallDuration = calls.length > 0 ? Math.round(totalCallDuration / calls.length) : 0;

  const dealsByStage = {
    Lead: deals.filter(d => d.stage === 'Lead').length,
    Qualified: deals.filter(d => d.stage === 'Qualified').length,
    Proposal: deals.filter(d => d.stage === 'Proposal').length,
    Negotiation: deals.filter(d => d.stage === 'Negotiation').length,
    Won: deals.filter(d => d.stage === 'Won').length,
    Lost: deals.filter(d => d.stage === 'Lost').length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Track your sales performance and metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{formatCurrency(totalRevenue)}</p>
              <p className="text-green-600 text-sm mt-2">↑ 18% from last month</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Pipeline Value */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Pipeline Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{formatCurrency(pipelineValue)}</p>
              <p className="text-blue-600 text-sm mt-2">↑ 12% from last month</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Avg Deal Size */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Avg Deal Size</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{formatCurrency(avgDealSize)}</p>
              <p className="text-purple-600 text-sm mt-2">↑ 5% from last month</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
              <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{conversionRate}%</p>
              <p className="text-orange-600 text-sm mt-2">↑ 2.5% from last month</p>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Sales Pipeline & Call Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Pipeline */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Sales Pipeline</h2>
          <div className="space-y-4">
            {Object.entries(dealsByStage).map(([stage, count]) => (
              <div key={stage}>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-700 dark:text-gray-300 font-medium">{stage}</p>
                  <p className="text-gray-900 dark:text-white font-bold">{count}</p>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${deals.length > 0 ? (count / Math.max(...Object.values(dealsByStage))) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call Statistics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Call Statistics</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Calls</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{calls.length}</p>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Duration</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.floor(totalCallDuration / 60)}m
                </p>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Avg Duration</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.floor(avgCallDuration / 60)}m {avgCallDuration % 60}s
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Contacts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{contacts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
              <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Deals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{deals.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
              <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Calls</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{calls.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
