import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Plus, Edit2, Trash2, Loader2, Quote, User, Briefcase, Image, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    quote: '',
    imageUrl: '',
    displayOrder: 0,
    isActive: true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/testimonials');
      setTestimonials(response.data);
    } catch (err) {
      console.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (testimonial) => {
    setEditingId(testimonial.id);
    setFormData(testimonial);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setEditingId(null);
    setFormData({
      name: '',
      designation: '',
      quote: '',
      imageUrl: '',
      displayOrder: 0,
      isActive: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingId) {
        await api.put(`/admin/testimonials/${editingId}`, formData);
      } else {
        await api.post('/admin/testimonials', formData);
      }
      fetchTestimonials();
      handleReset();
    } catch (err) {
      alert('Failed to save testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await api.delete(`/admin/testimonials/${id}`);
      setTestimonials(testimonials.filter(t => t.id !== id));
    } catch (err) {
      alert('Failed to delete testimonial');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <Loader2 className="animate-spin text-accent w-10 h-10" />
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold">Client Testimonials</h1>
          <p className="text-secondary">Manage what clients say about your studio.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-surface border border-line rounded-xl overflow-hidden sticky top-8">
             <div className="p-4 border-b border-line bg-background/30 font-bold flex justify-between items-center">
                <span>{editingId ? 'Edit Testimonial' : 'Add New Testimonial'}</span>
                {editingId && <button type="button" onClick={handleReset} className="text-secondary hover:text-primary"><X size={18} /></button>}
             </div>
             <div className="p-6 space-y-4">
                <div className="space-y-1">
                   <label className="text-xs font-bold uppercase tracking-wider text-tertiary">Client Name</label>
                   <input 
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required
                      className="w-full bg-background border border-line rounded px-3 py-2 text-sm outline-none focus:border-accent"
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-bold uppercase tracking-wider text-tertiary">Designation</label>
                   <input 
                      value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})}
                      className="w-full bg-background border border-line rounded px-3 py-2 text-sm outline-none focus:border-accent"
                      placeholder="e.g. CEO, Founder"
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-bold uppercase tracking-wider text-tertiary">Quote</label>
                   <textarea 
                      value={formData.quote} onChange={e => setFormData({...formData, quote: e.target.value})} required
                      className="w-full bg-background border border-line rounded px-3 py-2 text-sm outline-none focus:border-accent h-32 resize-none"
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-bold uppercase tracking-wider text-tertiary">Image URL</label>
                   <input 
                      value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                      className="w-full bg-background border border-line rounded px-3 py-2 text-sm outline-none focus:border-accent"
                   />
                </div>
                <div className="flex items-center gap-4">
                   <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                         type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})}
                         className="w-4 h-4 accent-accent"
                      />
                      <span className="text-xs font-bold uppercase text-tertiary">Active</span>
                   </label>
                </div>
                <button 
                   type="submit" disabled={saving}
                   className="w-full bg-accent text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all disabled:opacity-50"
                >
                   {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                   {editingId ? 'Update Testimonial' : 'Create Testimonial'}
                </button>
             </div>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
           {testimonials.map(testimonial => (
             <div key={testimonial.id} className="bg-surface border border-line p-6 rounded-xl flex items-start gap-6 group transition-all hover:border-accent/30">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-line bg-background shrink-0">
                   {testimonial.imageUrl ? (
                     <img src={testimonial.imageUrl} alt={testimonial.name} className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-tertiary"><User size={24} /></div>
                   )}
                </div>
                <div className="flex-grow">
                   <div className="flex justify-between items-start">
                      <div>
                         <h3 className="font-bold text-lg">{testimonial.name}</h3>
                         <p className="text-xs text-secondary font-medium uppercase tracking-wider">{testimonial.designation}</p>
                      </div>
                      <div className="flex items-center gap-2">
                         <button onClick={() => handleEdit(testimonial)} className="p-2 text-secondary hover:text-accent transition-colors"><Edit2 size={18} /></button>
                         <button onClick={() => handleDelete(testimonial.id)} className="p-2 text-secondary hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                      </div>
                   </div>
                   <div className="mt-4 relative">
                      <Quote className="absolute -left-2 -top-2 text-accent/10" size={32} />
                      <p className="text-secondary italic text-sm leading-relaxed relative z-10">{testimonial.quote}</p>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
