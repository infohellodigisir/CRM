'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Plus, Search, Mail, Phone, MapPin } from 'lucide-react';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '' });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('contacts').insert([formData]);
      if (error) throw error;
      setFormData({ name: '', email: '', phone: '', company: '' });
      setShowForm(false);
      fetchContacts();
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Contacts</h1>
          <p className="page-subtitle">Manage your customer contacts and relationships</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={18} />
            Add Contact
          </button>
        </div>
      </div>

      {/* Add Contact Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#1a1a2e' }}>
            Add New Contact
          </h3>
          <form onSubmit={handleAddContact}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Company</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button type="submit" className="btn btn-primary">
                Save Contact
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: '#7f8c8d' }} />
          <input
            type="text"
            placeholder="Search contacts by name, email..."
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>
      </div>

      {/* Contacts List */}
      {loading ? (
        <div className="empty-state">
          <div className="loading" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: '16px', color: '#7f8c8d' }}>Loading contacts...</p>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="empty-state">
          <Users size={64} style={{ opacity: 0.3, margin: '0 auto' }} />
          <h3 className="empty-state-title">No contacts yet</h3>
          <p className="empty-state-text">Create your first contact to get started</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={18} />
            Add First Contact
          </button>
        </div>
      ) : (
        <div className="grid grid-2">
          {filteredContacts.map((contact) => (
            <div key={contact.id} className="card">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ff8c00, #ff7700)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '18px',
                    }}
                  >
                    {contact.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a2e' }}>
                      {contact.name}
                    </h3>
                    {contact.company && (
                      <p style={{ fontSize: '13px', color: '#7f8c8d' }}>{contact.company}</p>
                    )}
                  </div>
                </div>
              </div>

              {contact.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '13px', color: '#7f8c8d' }}>
                  <Mail size={16} color="#ff8c00" />
                  <a href={`mailto:${contact.email}`} style={{ color: '#ff8c00', textDecoration: 'none' }}>
                    {contact.email}
                  </a>
                </div>
              )}

              {contact.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '13px', color: '#7f8c8d' }}>
                  <Phone size={16} color="#ff8c00" />
                  <a href={`tel:${contact.phone}`} style={{ color: '#ff8c00', textDecoration: 'none' }}>
                    {contact.phone}
                  </a>
                </div>
              )}

              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e8e8e8' }}>
                <button className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
