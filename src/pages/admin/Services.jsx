import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Plus, Edit2, Trash2, Loader2, Info, CheckCircle, AlertCircle, Save, X, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [magicPrompt, setMagicPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    iconName: 'Layout',
    displayOrder: 0,
    isActive: true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const handleMagicGenerate = async () => {
    if (!magicPrompt) return;
    try {
      setIsGenerating(true);
      const response = await api.post('/admin/github/generate-service', { prompt: magicPrompt });
      const data = response.data;
      setFormData(prev => ({
        ...prev,
        title: data.title || prev.title,
        slug: data.slug || prev.slug,
        shortDescription: data.shortDescription || prev.shortDescription,
        iconName: data.iconName || prev.iconName
      }));
      setMagicPrompt('');
    } catch (err) {
      alert('AI Generation failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/services');
      setServices(response.data);
    } catch (err) {
      console.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditingId(service.id);
    setFormData(service);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      shortDescription: '',
      fullDescription: '',
      iconName: 'Layout',
      displayOrder: 0,
      isActive: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingId) {
        await api.put(`/admin/services/${editingId}`, formData);
      } else {
        await api.post('/admin/services', formData);
      }
      fetchServices();
      handleReset();
    } catch (err) {
      alert('Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await api.delete(`/admin/services/${id}`);
      setServices(services.filter(s => s.id !== id));
    } catch (err) {
      alert('Failed to delete service');
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
          <h1 className="text-3xl font-display font-bold">Services</h1>
          <p className="text-secondary">Manage the services you offer on the website.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* AI Generator */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3">
             <label className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <Wand2 size={14} />
                AI Service Generator
             </label>
             <div className="flex gap-2">
                <input 
                   value={magicPrompt}
                   onChange={e => setMagicPrompt(e.target.value)}
                   placeholder="e.g. AI-driven SEO automation"
                   className="flex-grow bg-background border border-primary/20 rounded px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <button 
                   onClick={handleMagicGenerate}
                   disabled={isGenerating || !magicPrompt}
                   className="bg-primary text-background p-2 rounded hover:opacity-90 transition-all disabled:opacity-50"
                >
                   {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
                </button>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-surface border border-line rounded-xl overflow-hidden sticky top-8">
             <div className="p-4 border-b border-line bg-background/30 font-bold flex justify-between items-center">
                <span>{editingId ? 'Edit Service' : 'Add New Service'}</span>
                {editingId && <button type="button" onClick={handleReset} className="text-secondary hover:text-primary"><X size={18} /></button>}
             </div>
             <div className="p-6 space-y-4">
                <div className="space-y-1">
                   <label className="text-xs font-bold uppercase tracking-wider text-tertiary">Title</label>
                   <input 
                      value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required
                      className="w-full bg-background border border-line rounded px-3 py-2 text-sm outline-none focus:border-accent"
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-bold uppercase tracking-wider text-tertiary">Slug</label>
                   <input 
                      value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required
                      className="w-full bg-background border border-line rounded px-3 py-2 text-sm outline-none focus:border-accent"
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-bold uppercase tracking-wider text-tertiary">Icon Name (Lucide)</label>
                   <input 
                      value={formData.iconName} onChange={e => setFormData({...formData, iconName: e.target.value})}
                      className="w-full bg-background border border-line rounded px-3 py-2 text-sm outline-none focus:border-accent"
                      placeholder="Layout, Code, Cpu..."
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-bold uppercase tracking-wider text-tertiary">Short Description</label>
                   <textarea 
                      value={formData.shortDescription} onChange={e => setFormData({...formData, shortDescription: e.target.value})}
                      className="w-full bg-background border border-line rounded px-3 py-2 text-sm outline-none focus:border-accent h-20 resize-none"
                   />
                </div>
                <div className="flex items-center gap-4">
                   <div className="space-y-1 flex-grow">
                      <label className="text-xs font-bold uppercase tracking-wider text-tertiary">Display Order</label>
                      <input 
                         type="number" value={formData.displayOrder} onChange={e => setFormData({...formData, displayOrder: parseInt(e.target.value)})}
                         className="w-full bg-background border border-line rounded px-3 py-2 text-sm outline-none focus:border-accent"
                      />
                   </div>
                   <label className="flex items-center gap-2 pt-5 cursor-pointer">
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
                   {editingId ? 'Update Service' : 'Create Service'}
                </button>
             </div>
          </form>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 space-y-4">
           {services.map(service => (
             <div key={service.id} className="bg-surface border border-line p-4 rounded-xl flex items-center justify-between group">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-lg bg-background border border-line flex items-center justify-center text-accent">
                      <Info size={20} />
                   </div>
                   <div>
                      <h3 className="font-bold">{service.title}</h3>
                      <p className="text-xs text-secondary line-clamp-1">{service.shortDescription}</p>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <button onClick={() => handleEdit(service)} className="p-2 text-secondary hover:text-accent transition-colors"><Edit2 size={18} /></button>
                   <button onClick={() => handleDelete(service.id)} className="p-2 text-secondary hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
