'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Briefcase, Phone, TrendingUp } from 'lucide-react';

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
}

export default function Dashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .limit(10);

      if (contactsError) throw contactsError;
      setContacts(contactsData || []);

      // Fetch deals
      const { data: dealsData, error: dealsError } = await supabase
        .from('deals')
        .select('*');

      if (dealsError) throw dealsError;
      setDeals(dealsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalContacts = contacts.length;
  const activeDeals = deals.filter(d => d.stage !== 'Won' && d.stage !== 'Lost').length;
  const totalRevenue = deals
    .filter(d => d.stage === 'Won')
    .reduce((sum, d) => sum + (d.value || 0), 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's your CRM overview</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
          + New Contact
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Contacts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Contacts</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalContacts}</p>
              <p className="text-green-600 text-sm mt-2">↑ 12% from last month</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Active Deals */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Active Deals</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{activeDeals}</p>
              <p className="text-green-600 text-sm mt-2">↑ 8% from last month</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
              <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{formatCurrency(totalRevenue)}</p>
              <p className="text-green-600 text-sm mt-2">↑ 15% from last month</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Conversion Rate</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">32.5%</p>
              <p className="text-green-600 text-sm mt-2">↑ 2.5% from last month</p>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg">
              <Phone className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Contacts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Contacts</h2>
          <a href="/contacts" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All →
          </a>
        </div>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Loading contacts...</p>
        ) : contacts.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No contacts yet. Create your first contact!</p>
        ) : (
          <div className="space-y-4">
            {contacts.slice(0, 3).map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {contact.first_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {contact.first_name} {contact.last_name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{contact.email}</p>
                  </div>
                </div>
                <a href={`/contacts`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium flex items-center gap-2">
            + Add Contact
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium flex items-center gap-2">
            + Create Deal
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium flex items-center gap-2">
            ☎ Make Call
          </button>
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium flex items-center gap-2">
            📝 Add Note
          </button>
        </div>
      </div>
    </div>
  );
}
