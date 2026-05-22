import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Mail, Calendar, User, Trash2, CheckCircle, Clock, AlertCircle, Loader2, MessageSquare, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/inquiries');
      setInquiries(Array.isArray(response.data) ? response.data : []);
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

  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await api.get('/admin/export/leads', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ForgeLabs-Leads-Dashboard.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to export dashboard');
    } finally {
      setExporting(false);
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
          <h1 className="text-3xl font-display font-bold">Leads</h1>
          <p className="text-secondary">Manage incoming leads and project inquiries.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-surface border border-line px-4 py-2 rounded-lg flex items-center gap-2">
            <MessageSquare size={18} className="text-accent" />
            <span className="font-bold">{inquiries.length}</span>
            <span className="text-secondary text-sm">Total Leads</span>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {exporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
            <span className="font-medium">{exporting ? 'Exporting...' : 'Export Dashboard'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="bg-surface border border-line rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-background/50 border-b border-line text-sm text-tertiary uppercase tracking-wider">
              <th className="p-4 font-medium">Lead</th>
              <th className="p-4 font-medium">Project Type</th>
              <th className="p-4 font-medium">Budget</th>
              <th className="p-4 font-medium">Message</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-secondary bg-surface">
                    No leads found.
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry) => (
                  <motion.tr
                    key={inquiry.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-line hover:bg-background/30 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="font-bold text-primary">{inquiry.fullName}</div>
                      <div className="text-sm text-secondary flex items-center gap-1 mt-1">
                        <Mail size={12} /> {inquiry.email}
                      </div>
                      {inquiry.phone && (
                        <div className="text-xs text-tertiary mt-1">{inquiry.phone}</div>
                      )}
                    </td>
                    <td className="p-4 text-sm font-medium">{inquiry.projectType}</td>
                    <td className="p-4 text-sm font-medium text-accent">{inquiry.budgetRange}</td>
                    <td className="p-4">
                      <p className="text-sm text-secondary line-clamp-2 max-w-xs" title={inquiry.message}>
                        {inquiry.message}
                      </p>
                    </td>
                    <td className="p-4 text-sm text-tertiary whitespace-nowrap">
                      {new Date(inquiry.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', day: 'numeric', year: 'numeric' 
                      })}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(inquiry.id)}
                        disabled={deleteLoading === inquiry.id}
                        className="p-2 text-red-500 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Delete Lead"
                      >
                        {deleteLoading === inquiry.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
