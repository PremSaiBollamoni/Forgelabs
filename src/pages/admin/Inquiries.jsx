import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Mail, Calendar, User, Trash2, CheckCircle, Clock, AlertCircle, Loader2, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/inquiries');
      setInquiries(response.data);
    } catch (err) {
      setError('Failed to load inquiries.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      setDeleteLoading(id);
      await api.delete(`/admin/inquiries/${id}`);
      setInquiries(inquiries.filter(inq => inq.id !== id));
    } catch (err) {
      alert('Failed to delete inquiry');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <Loader2 className="animate-spin text-accent w-10 h-10" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold">Inquiries</h1>
          <p className="text-secondary">Manage incoming leads and requests.</p>
        </div>
        <div className="bg-surface border border-line px-4 py-2 rounded-lg flex items-center gap-2">
          <MessageSquare size={18} className="text-accent" />
          <span className="font-bold">{inquiries.length}</span>
          <span className="text-secondary text-sm">Total Leads</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="grid gap-6">
        <AnimatePresence>
          {inquiries.length === 0 ? (
            <div className="text-center py-20 bg-surface border border-line rounded-xl">
              <p className="text-secondary">No inquiries found.</p>
            </div>
          ) : (
            inquiries.map((inquiry) => (
              <motion.div
                key={inquiry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-surface border border-line p-6 rounded-xl hover:border-accent/30 transition-colors"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-4 flex-grow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                          <User size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{inquiry.fullName}</h3>
                          <div className="flex items-center gap-2 text-sm text-secondary">
                            <Mail size={14} />
                            {inquiry.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-tertiary">
                        <Calendar size={14} />
                        {new Date(inquiry.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', day: 'numeric', year: 'numeric' 
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 bg-background rounded-lg border border-line/50">
                        <span className="text-[10px] uppercase tracking-widest text-tertiary block mb-1">Project Type</span>
                        <span className="text-sm font-medium">{inquiry.projectType}</span>
                      </div>
                      <div className="p-3 bg-background rounded-lg border border-line/50">
                        <span className="text-[10px] uppercase tracking-widest text-tertiary block mb-1">Budget Range</span>
                        <span className="text-sm font-medium">{inquiry.budgetRange}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-background rounded-lg border border-line/50">
                      <span className="text-[10px] uppercase tracking-widest text-tertiary block mb-2">Message</span>
                      <p className="text-secondary text-sm whitespace-pre-wrap">{inquiry.message}</p>
                    </div>
                  </div>

                  <div className="flex md:flex-col justify-end gap-2 shrink-0">
                    <button 
                      onClick={() => handleDelete(inquiry.id)}
                      disabled={deleteLoading === inquiry.id}
                      className="p-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                      title="Delete Inquiry"
                    >
                      {deleteLoading === inquiry.id ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
