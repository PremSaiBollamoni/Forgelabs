import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Plus, Edit2, Trash2, Loader2, Tag, CheckCircle, AlertCircle, Save, X, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [magicPrompt, setMagicPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    planName: '',
    price: 0,
    currency: 'INR',
    shortDescription: '',
    features: [],
    ctaLabel: 'Build With Us',
    isFeatured: false,
    displayOrder: 0,
    isActive: true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleMagicGenerate = async () => {
    if (!magicPrompt) return;
    try {
      setIsGenerating(true);
      const response = await api.post('/admin/github/generate-pricing', { prompt: magicPrompt });
      const data = response.data;
      setFormData(prev => ({
        ...prev,
        planName: data.planName || prev.planName,
        price: data.price || prev.price,
        shortDescription: data.shortDescription || prev.shortDescription,
        features: data.features || prev.features
      }));
      setMagicPrompt('');
    } catch (err) {
      alert('AI Generation failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/pricing');
      setPlans(response.data.map(p => ({
        ...p,
        features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features || []
      })));
    } catch (err) {
      console.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan) => {
    setEditingId(plan.id);
    setFormData(plan);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setEditingId(null);
    setFormData({
      planName: '',
      price: 0,
      currency: 'INR',
      shortDescription: '',
      features: [],
      ctaLabel: 'Build With Us',
      isFeatured: false,
      displayOrder: 0,
      isActive: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...formData,
        features: JSON.stringify(formData.features)
      };

      if (editingId) {
        await api.put(`/admin/pricing/${editingId}`, payload);
      } else {
        await api.post('/admin/pricing', payload);
      }
      fetchPlans();
      handleReset();
    } catch (err) {
      alert('Failed to save plan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this plan?')) return;
    try {
      await api.delete(`/admin/pricing/${id}`);
      setPlans(plans.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete plan');
    }
  };

  const addFeature = () => setFormData({...formData, features: [...formData.features, '']});
  const removeFeature = (idx) => setFormData({...formData, features: formData.features.filter((_, i) => i !== idx)});
  const updateFeature = (idx, val) => {
    const newFeatures = [...formData.features];
    newFeatures[idx] = val;
    setFormData({...formData, features: newFeatures});
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
          <h1 className="text-3xl font-display font-bold">Pricing Plans</h1>
          <p className="text-secondary">Configure your studio tiers and pricing.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* AI Generator */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3">
             <label className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <Wand2 size={14} />
                AI Tier Generator
             </label>
             <div className="flex gap-2">
                <input 
                   value={magicPrompt}
                   onChange={e => setMagicPrompt(e.target.value)}
                   placeholder="e.g. Enterprise Tier for high-volume clients"
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
                <span>{editingId ? 'Edit Plan' : 'Add New Plan'}</span>
                {editingId && <button type="button" onClick={handleReset} className="text-secondary hover:text-primary"><X size={18} /></button>}
             </div>
             <div className="p-6 space-y-4">
                <div className="space-y-1">
                   <label className="text-xs font-bold uppercase tracking-wider text-tertiary">Plan Name</label>
                   <input 
                      value={formData.planName} onChange={e => setFormData({...formData, planName: e.target.value})} required
                      className="w-full bg-background border border-line rounded px-3 py-2 text-sm outline-none focus:border-accent"
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="text-xs font-bold uppercase tracking-wider text-tertiary">Price</label>
                     <input 
                        type="number" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} required
                        className="w-full bg-background border border-line rounded px-3 py-2 text-sm outline-none focus:border-accent"
                     />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold uppercase tracking-wider text-tertiary">Currency</label>
                     <select 
                        value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})}
                        className="w-full bg-background border border-line rounded px-3 py-2 text-sm outline-none focus:border-accent"
                     >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                     </select>
                  </div>
                </div>
                
                <div className="space-y-1">
                   <label className="text-xs font-bold uppercase tracking-wider text-tertiary">Short Description</label>
                   <textarea 
                      value={formData.shortDescription} onChange={e => setFormData({...formData, shortDescription: e.target.value})}
                      className="w-full bg-background border border-line rounded px-3 py-2 text-sm outline-none focus:border-accent h-16 resize-none"
                   />
                </div>

                <div className="space-y-2">
                   <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase tracking-wider text-tertiary">Features</label>
                      <button type="button" onClick={addFeature} className="text-accent text-xs hover:underline">+ Add</button>
                   </div>
                   {formData.features.map((f, i) => (
                     <div key={i} className="flex gap-2">
                        <input 
                          value={f} onChange={e => updateFeature(i, e.target.value)}
                          className="flex-grow bg-background border border-line rounded px-2 py-1 text-xs outline-none focus:border-accent"
                        />
                        <button type="button" onClick={() => removeFeature(i)} className="text-red-500"><X size={14} /></button>
                     </div>
                   ))}
                </div>

                <div className="flex items-center gap-4">
                   <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                         type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})}
                         className="w-4 h-4 accent-accent"
                      />
                      <span className="text-xs font-bold uppercase text-tertiary">Featured</span>
                   </label>
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
                   {editingId ? 'Update Plan' : 'Create Plan'}
                </button>
             </div>
          </form>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 space-y-4">
           {plans.map(plan => (
             <div key={plan.id} className={`bg-surface border p-6 rounded-xl flex items-center justify-between group transition-all ${plan.isFeatured ? 'border-accent shadow-lg shadow-accent/5' : 'border-line'}`}>
                <div className="flex items-center gap-6">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${plan.isFeatured ? 'bg-accent text-white' : 'bg-background border border-line text-tertiary'}`}>
                      <Tag size={24} />
                   </div>
                   <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{plan.planName}</h3>
                        {plan.isFeatured && <span className="bg-accent/10 text-accent text-[10px] px-2 py-0.5 rounded font-bold uppercase">Popular</span>}
                      </div>
                      <p className="text-xl font-display font-bold text-primary">
                        {plan.currency === 'INR' ? '₹' : '$'}{plan.price}
                      </p>
                      <p className="text-xs text-secondary mt-1">{plan.features.length} Features included</p>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <button onClick={() => handleEdit(plan)} className="p-2 text-secondary hover:text-accent transition-colors"><Edit2 size={18} /></button>
                   <button onClick={() => handleDelete(plan.id)} className="p-2 text-secondary hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
