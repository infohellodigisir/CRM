'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { FileText, Plus, Search } from 'lucide-react';

export default function NotesPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('notes').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('notes').insert([formData]);
      if (error) throw error;
      setFormData({ title: '', content: '' });
      setShowForm(false);
      fetchNotes();
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Notes</h1>
          <p className="page-subtitle">Create and manage your notes</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={18} />
            Add Note
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#1a1a2e' }}>Create New Note</h3>
          <form onSubmit={handleAddNote}>
            <div className="form-group">
              <label className="form-label">Note Title *</label>
              <input type="text" className="form-input" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea className="form-textarea" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn btn-primary">Save Note</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ marginBottom: '30px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: '#7f8c8d' }} />
          <input
            type="text"
            placeholder="Search notes by title or content..."
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <div className="loading" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: '16px', color: '#7f8c8d' }}>Loading notes...</p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="empty-state">
          <FileText size={64} style={{ opacity: 0.3, margin: '0 auto' }} />
          <h3 className="empty-state-title">No notes yet</h3>
          <p className="empty-state-text">Create your first note to get started</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={18} />
            Add First Note
          </button>
        </div>
      ) : (
        <div className="grid grid-2">
          {filteredNotes.map((note) => (
            <div key={note.id} className="card">
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a2e', marginBottom: '12px' }}>
                {note.title}
              </h3>
              {note.content && (
                <p style={{ fontSize: '13px', color: '#7f8c8d', marginBottom: '12px', lineHeight: '1.6' }}>
                  {note.content.substring(0, 150)}
                  {note.content.length > 150 ? '...' : ''}
                </p>
              )}
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e8e8e8' }}>
                <button className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                  View Note
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
