import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Save, Globe, Mail, Phone, MapPin, Tag, Link as LinkIcon, Loader2, CheckCircle, AlertCircle, Cpu, Eye, EyeOff, Wand2, Layout, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: '',
    contactEmail: '',
    whatsappNumber: '',
    githubUrl: '',
    location: '',
    primaryCtaLabel: '',
    secondaryCtaLabel: '',
    footerTagline: '',
    claudeApiKey: '',
    footerAboutText: '',
    copyrightText: '',
    officeAddress: ''
  });
  const [heroButtons, setHeroButtons] = useState([]);
  const [isSavingButton, setIsSavingButton] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [message, setMessage] = useState(null);
  const [isGeneratingFooter, setIsGeneratingFooter] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleGenerateFooter = async () => {
    try {
      setIsGeneratingFooter(true);
      const response = await api.post('/admin/github/generate-footer', { 
        prompt: `${settings.siteName} - ${settings.footerTagline}` 
      });
      setSettings({
        ...settings,
        footerAboutText: response.data.footerAboutText,
        copyrightText: response.data.copyrightText
      });
    } catch (err) {
      // Error handled by UI
    } finally {
      setIsGeneratingFooter(false);
    }
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/settings');
      const data = Array.isArray(response.data) ? response.data : [];
      if (data.length > 0) {
        setSettings(data[0]);
      }
      fetchButtons();
    } catch (err) {
      // Error handled by UI
    } finally {
      setLoading(false);
    }
  };

  const fetchButtons = async () => {
    try {
      const response = await api.get('/admin/hero-buttons');
      setHeroButtons(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      // Error silently handled
    }
  };

  const handleAddButton = async () => {
    try {
      const newButton = { label: 'New Button', route: '/', variant: 'outline', displayOrder: heroButtons.length, isActive: true };
      const response = await api.post('/admin/hero-buttons', newButton);
      setHeroButtons([...heroButtons, response.data]);
    } catch (err) {
      alert('Failed to add button');
    }
  };

  const handleUpdateButton = async (id, updates) => {
    try {
      await api.put(`/admin/hero-buttons/${id}`, updates);
      setHeroButtons(heroButtons.map(b => b.id === id ? { ...b, ...updates } : b));
    } catch (err) {
      alert('Failed to update button');
    }
  };

  const handleDeleteButton = async (id) => {
    if (!window.confirm('Delete this button?')) return;
    try {
      await api.delete(`/admin/hero-buttons/${id}`);
      setHeroButtons(heroButtons.filter(b => b.id !== id));
    } catch (err) {
      alert('Failed to delete button');
    }
  };

  const availableRoutes = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage(null);
      // Use the first settings record ID if it exists
      if (settings.id) {
        await api.put(`/admin/settings/${settings.id}`, settings);
      } else {
        await api.post('/admin/settings', settings);
      }
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save settings.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <Loader2 className="animate-spin text-accent w-10 h-10" />
    </div>
  );

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Site Settings</h1>
        <p className="text-secondary">Configure global website content and contact info.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-surface border border-line rounded-xl overflow-hidden">
          <div className="p-6 border-b border-line bg-background/30">
            <h3 className="font-bold flex items-center gap-2">
              <Globe size={18} className="text-accent" />
              General Configuration
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">Site Name</label>
              <input 
                type="text" 
                value={settings.siteName}
                onChange={e => setSettings({...settings, siteName: e.target.value})}
                className="w-full bg-background border border-line rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent"
                placeholder="ForgeLabs"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">Location</label>
              <input 
                type="text" 
                value={settings.location}
                onChange={e => setSettings({...settings, location: e.target.value})}
                className="w-full bg-background border border-line rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent"
                placeholder="Remote / Worldwide"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-primary">Footer Tagline</label>
              <input 
                type="text" 
                value={settings.footerTagline}
                onChange={e => setSettings({...settings, footerTagline: e.target.value})}
                className="w-full bg-background border border-line rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent"
                placeholder="The Digital Execution Studio."
              />
            </div>
          </div>
        </div>

        <div className="bg-surface border border-line rounded-xl overflow-hidden">
          <div className="p-6 border-b border-line bg-background/30">
            <h3 className="font-bold flex items-center gap-2">
              <Mail size={18} className="text-accent" />
              Contact & Social
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">Contact Email</label>
              <input 
                type="email" 
                value={settings.contactEmail}
                onChange={e => setSettings({...settings, contactEmail: e.target.value})}
                className="w-full bg-background border border-line rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent"
                placeholder="hello@forgelabs.studio"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">WhatsApp Number</label>
              <input 
                type="text" 
                value={settings.whatsappNumber}
                onChange={e => setSettings({...settings, whatsappNumber: e.target.value})}
                className="w-full bg-background border border-line rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent"
                placeholder="+1234567890"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-primary">GitHub URL</label>
              <input 
                type="text" 
                value={settings.githubUrl}
                onChange={e => setSettings({...settings, githubUrl: e.target.value})}
                className="w-full bg-background border border-line rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent"
                placeholder="https://github.com/forgelabs"
              />
            </div>
          </div>
        </div>

        <div className="bg-surface border border-line rounded-xl overflow-hidden">
          <div className="p-6 border-b border-line bg-background/30">
            <h3 className="font-bold flex items-center gap-2">
              <Cpu size={18} className="text-accent" />
              AI Configuration (Claude Haiku)
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">Claude API Key</label>
              <div className="relative">
                <input 
                  type={showKey ? "text" : "password"} 
                  value={settings.claudeApiKey || ''}
                  onChange={e => setSettings({...settings, claudeApiKey: e.target.value})}
                  className="w-full bg-background border border-line rounded-lg px-4 py-2.5 pr-12 focus:outline-none focus:border-accent"
                  placeholder="sk-ant-api03-..."
                />
                <button 
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary transition-colors"
                >
                  {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-[10px] text-tertiary mt-1 italic">This key is used for GitHub Magic Import to analyze README files intelligently.</p>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-line rounded-xl overflow-hidden">
          <div className="p-6 border-b border-line bg-background/30 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">
              <Layout size={18} className="text-accent" />
              Footer Configuration
            </h3>
            <button 
              type="button"
              onClick={handleGenerateFooter}
              disabled={isGeneratingFooter || !settings.siteName}
              className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded flex items-center gap-2 hover:bg-primary/20 transition-all disabled:opacity-50"
            >
              {isGeneratingFooter ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
              AI Magic Footer
            </button>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">Footer About Text</label>
              <textarea 
                value={settings.footerAboutText || ''}
                onChange={e => setSettings({...settings, footerAboutText: e.target.value})}
                className="w-full bg-background border border-line rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent h-24 resize-none"
                placeholder="A brief professional summary of your studio..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">Copyright Text</label>
                <input 
                  type="text" 
                  value={settings.copyrightText || ''}
                  onChange={e => setSettings({...settings, copyrightText: e.target.value})}
                  className="w-full bg-background border border-line rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent"
                  placeholder="© 2024 ForgeLabs. All rights reserved."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">Office Address</label>
                <input 
                  type="text" 
                  value={settings.officeAddress || ''}
                  onChange={e => setSettings({...settings, officeAddress: e.target.value})}
                  className="w-full bg-background border border-line rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent"
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-line rounded-xl overflow-hidden">
          <div className="p-6 border-b border-line bg-background/30 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">
              <Cpu size={18} className="text-accent" />
              Dynamic Hero Buttons
            </h3>
            <button 
              type="button"
              onClick={handleAddButton}
              className="text-xs bg-accent text-white px-3 py-1.5 rounded flex items-center gap-2 hover:bg-opacity-90 transition-all"
            >
              <Plus size={14} />
              Add Button
            </button>
          </div>
          <div className="p-6 space-y-4">
             {heroButtons.map((button, index) => (
               <div key={button.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-line rounded-lg bg-background/50 relative group">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-tertiary">Label</label>
                    <input 
                      value={button.label}
                      onChange={e => handleUpdateButton(button.id, { ...button, label: e.target.value })}
                      className="w-full bg-background border border-line rounded px-3 py-1.5 text-sm focus:border-accent outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-tertiary">Route</label>
                    <select 
                      value={button.route}
                      onChange={e => handleUpdateButton(button.id, { ...button, route: e.target.value })}
                      className="w-full bg-background border border-line rounded px-3 py-1.5 text-sm focus:border-accent outline-none"
                    >
                      {availableRoutes.map(route => (
                        <option key={route.path} value={route.path}>{route.label} ({route.path})</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-tertiary">Variant</label>
                    <select 
                      value={button.variant}
                      onChange={e => handleUpdateButton(button.id, { ...button, variant: e.target.value })}
                      className="w-full bg-background border border-line rounded px-3 py-1.5 text-sm focus:border-accent outline-none"
                    >
                      <option value="primary">Primary (Filled)</option>
                      <option value="outline">Outline</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-4">
                    <button 
                      type="button"
                      onClick={() => handleDeleteButton(button.id)}
                      className="p-2 text-tertiary hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="flex-grow"></div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={button.isActive}
                        onChange={e => handleUpdateButton(button.id, { ...button, isActive: e.target.checked })}
                        className="w-3 h-3 accent-accent"
                      />
                      <span className="text-[10px] font-bold uppercase text-tertiary">Active</span>
                    </label>
                  </div>
               </div>
             ))}
             {heroButtons.length === 0 && (
               <p className="text-center text-secondary py-4 text-sm italic">No buttons configured. Click 'Add Button' to start.</p>
             )}
          </div>
        </div>

        <AnimatePresence>
          {message && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`p-4 rounded-lg flex items-center gap-3 ${
                message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
              }`}
            >
              {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-end">
          <button 
            type="submit"
            disabled={saving}
            className="bg-accent text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-lg shadow-accent/20 disabled:opacity-50"
          >
            {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
