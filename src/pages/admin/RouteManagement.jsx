import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Loader2, 
  Link as LinkIcon, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  Save, 
  X, 
  ExternalLink, 
  MousePointer2,
  Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminRouteManagement() {
  const [routes, setRoutes] = useState([]);
  const [buttons, setButtons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('buttons'); // 'buttons' or 'routes'
  
  // Form states
  const [editingId, setEditingId] = useState(null);
  const [routeFormData, setRouteFormData] = useState({
    routeName: '',
    routePath: '',
    routeType: 'INTERNAL',
    isActive: true
  });
  
  const [buttonFormData, setButtonFormData] = useState({
    buttonLabel: '',
    routeId: '',
    locationGroup: 'NAVBAR',
    pageKey: 'ALL',
    componentName: '',
    displayOrder: 0,
    buttonStyle: 'primary',
    isActive: true
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [routesRes, buttonsRes] = await Promise.all([
        api.get('/admin/routes'),
        api.get('/admin/ui-buttons')
      ]);
      setRoutes(routesRes.data);
      setButtons(buttonsRes.data);
    } catch (err) {
      console.error('Failed to load route management data');
    } finally {
      setLoading(false);
    }
  };

  const handleRouteSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingId) {
        await api.put(`/admin/routes/${editingId}`, routeFormData);
      } else {
        await api.post('/admin/routes', routeFormData);
      }
      fetchData();
      handleReset();
    } catch (err) {
      alert('Failed to save route');
    } finally {
      setSaving(false);
    }
  };

  const handleButtonSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...buttonFormData,
        route: { id: buttonFormData.routeId }
      };
      if (editingId) {
        await api.put(`/admin/ui-buttons/${editingId}`, payload);
      } else {
        await api.post('/admin/ui-buttons', payload);
      }
      fetchData();
      handleReset();
    } catch (err) {
      alert('Failed to save button');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setEditingId(null);
    setRouteFormData({
      routeName: '',
      routePath: '',
      routeType: 'INTERNAL',
      isActive: true
    });
    setButtonFormData({
      buttonLabel: '',
      routeId: '',
      locationGroup: 'NAVBAR',
      pageKey: 'ALL',
      componentName: '',
      displayOrder: 0,
      buttonStyle: 'primary',
      isActive: true
    });
  };

  const handleEditRoute = (route) => {
    setEditingId(route.id);
    setRouteFormData({
      routeName: route.routeName,
      routePath: route.routePath,
      routeType: route.routeType,
      isActive: route.active
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditButton = (btn) => {
    setEditingId(btn.id);
    setButtonFormData({
      buttonLabel: btn.buttonLabel,
      routeId: btn.route?.id || '',
      locationGroup: btn.locationGroup,
      pageKey: btn.pageKey || 'ALL',
      componentName: btn.componentName || '',
      displayOrder: btn.displayOrder,
      buttonStyle: btn.buttonStyle || 'primary',
      isActive: btn.active
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteRoute = async (id) => {
    if (!window.confirm('Delete this route? This might break buttons using it!')) return;
    try {
      await api.delete(`/admin/routes/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete route. It might be in use.');
    }
  };

  const handleDeleteButton = async (id) => {
    if (!window.confirm('Delete this button mapping?')) return;
    try {
      await api.delete(`/admin/ui-buttons/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete button');
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
          <h1 className="text-3xl font-display font-bold">Route & Button Management</h1>
          <p className="text-secondary">Centrally manage every clickable action across the website.</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-line">
        <button 
          onClick={() => { setActiveTab('buttons'); handleReset(); }}
          className={`pb-4 px-2 font-bold text-sm transition-all relative ${activeTab === 'buttons' ? 'text-accent' : 'text-tertiary hover:text-secondary'}`}
        >
          UI Buttons
          {activeTab === 'buttons' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />}
        </button>
        <button 
          onClick={() => { setActiveTab('routes'); handleReset(); }}
          className={`pb-4 px-2 font-bold text-sm transition-all relative ${activeTab === 'routes' ? 'text-accent' : 'text-tertiary hover:text-secondary'}`}
        >
          Routes Library
          {activeTab === 'routes' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1">
          {activeTab === 'routes' ? (
            <form onSubmit={handleRouteSubmit} className="bg-surface border border-line rounded-xl overflow-hidden sticky top-8">
              <div className="p-4 border-b border-line bg-background/30 font-bold flex justify-between items-center text-sm uppercase tracking-wider">
                <span>{editingId ? 'Edit Route' : 'Add New Route'}</span>
                {editingId && <button type="button" onClick={handleReset} className="text-secondary hover:text-primary"><X size={16} /></button>}
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-tertiary">Route Name</label>
                  <input 
                    value={routeFormData.routeName} 
                    onChange={e => setRouteFormData({...routeFormData, routeName: e.target.value})} 
                    required placeholder="e.g. Services Page"
                    className="w-full bg-background border border-line rounded px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-tertiary">Route Path</label>
                  <input 
                    value={routeFormData.routePath} 
                    onChange={e => setRouteFormData({...routeFormData, routePath: e.target.value})} 
                    required placeholder="e.g. /services"
                    className="w-full bg-background border border-line rounded px-3 py-2 text-sm outline-none focus:border-accent font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-tertiary">Route Type</label>
                  <select 
                    value={routeFormData.routeType} 
                    onChange={e => setRouteFormData({...routeFormData, routeType: e.target.value})}
                    className="w-full bg-background border border-line rounded px-3 py-2 text-sm outline-none focus:border-accent"
                  >
                    <option value="INTERNAL">INTERNAL</option>
                    <option value="EXTERNAL">EXTERNAL</option>
                    <option value="EMAIL">EMAIL</option>
                    <option value="WHATSAPP">WHATSAPP</option>
                    <option value="SECTION_SCROLL">SECTION_SCROLL</option>
                    <option value="MODAL">MODAL</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer pt-2">
                  <input 
                    type="checkbox" 
                    checked={routeFormData.isActive} 
                    onChange={e => setRouteFormData({...routeFormData, isActive: e.target.checked})}
                    className="w-4 h-4 accent-accent"
                  />
                  <span className="text-xs font-bold text-secondary uppercase">Active</span>
                </label>
                <button 
                  type="submit" disabled={saving}
                  className="w-full bg-accent text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all disabled:opacity-50 mt-4"
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {editingId ? 'Update Route' : 'Create Route'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleButtonSubmit} className="bg-surface border border-line rounded-xl overflow-hidden sticky top-8">
              <div className="p-4 border-b border-line bg-background/30 font-bold flex justify-between items-center text-sm uppercase tracking-wider">
                <span>{editingId ? 'Edit Button' : 'Map New Button'}</span>
                {editingId && <button type="button" onClick={handleReset} className="text-secondary hover:text-primary"><X size={16} /></button>}
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-tertiary">Button Label</label>
                  <input 
                    value={buttonFormData.buttonLabel} 
                    onChange={e => setButtonFormData({...buttonFormData, buttonLabel: e.target.value})} 
                    required placeholder="e.g. Build With Us"
                    className="w-full bg-background border border-line rounded px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-tertiary">Route Destination</label>
                  <select 
                    value={buttonFormData.routeId} 
                    onChange={e => setButtonFormData({...buttonFormData, routeId: e.target.value})}
                    required
                    className="w-full bg-background border border-line rounded px-3 py-2 text-sm outline-none focus:border-accent"
                  >
                    <option value="">Select a Route...</option>
                    {routes.map(r => (
                      <option key={r.id} value={r.id}>{r.routeName} ({r.routePath})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-tertiary">Location Group</label>
                    <select 
                      value={buttonFormData.locationGroup} 
                      onChange={e => setButtonFormData({...buttonFormData, locationGroup: e.target.value})}
                      className="w-full bg-background border border-line rounded px-3 py-2 text-sm outline-none focus:border-accent"
                    >
                      <option value="NAVBAR">NAVBAR</option>
                      <option value="FOOTER">FOOTER</option>
                      <option value="HOMEPAGE">HOMEPAGE</option>
                      <option value="SERVICES_PAGE">SERVICES_PAGE</option>
                      <option value="PORTFOLIO_PAGE">PORTFOLIO_PAGE</option>
                      <option value="PRICING_PAGE">PRICING_PAGE</option>
                      <option value="CONTACT_PAGE">CONTACT_PAGE</option>
                      <option value="PROJECT_DETAIL_PAGE">PROJECT_DETAIL</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-tertiary">Display Order</label>
                    <input 
                      type="number"
                      value={buttonFormData.displayOrder} 
                      onChange={e => setButtonFormData({...buttonFormData, displayOrder: parseInt(e.target.value)})} 
                      className="w-full bg-background border border-line rounded px-3 py-2 text-sm outline-none focus:border-accent"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-tertiary">Button Style</label>
                  <select 
                    value={buttonFormData.buttonStyle} 
                    onChange={e => setButtonFormData({...buttonFormData, buttonStyle: e.target.value})}
                    className="w-full bg-background border border-line rounded px-3 py-2 text-sm outline-none focus:border-accent"
                  >
                    <option value="primary">Primary (Filled)</option>
                    <option value="outline">Outline</option>
                    <option value="link">Link (Text Only)</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer pt-2">
                  <input 
                    type="checkbox" 
                    checked={buttonFormData.isActive} 
                    onChange={e => setButtonFormData({...buttonFormData, isActive: e.target.checked})}
                    className="w-4 h-4 accent-accent"
                  />
                  <span className="text-xs font-bold text-secondary uppercase">Active</span>
                </label>
                <button 
                  type="submit" disabled={saving}
                  className="w-full bg-accent text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all disabled:opacity-50 mt-4"
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {editingId ? 'Update Button' : 'Map Button'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 space-y-4">
           {activeTab === 'routes' ? (
             <div className="bg-surface border border-line rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                   <thead className="bg-background text-tertiary text-[10px] uppercase font-bold border-b border-line">
                      <tr>
                        <th className="px-6 py-4">Route Name</th>
                        <th className="px-6 py-4">Path</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-line">
                      {routes.map(route => (
                        <tr key={route.id} className="hover:bg-background/50 transition-colors group">
                           <td className="px-6 py-4 font-bold text-primary flex items-center gap-2">
                              <Navigation size={14} className="text-accent" />
                              {route.routeName}
                           </td>
                           <td className="px-6 py-4 text-secondary font-mono text-[11px]">{route.routePath}</td>
                           <td className="px-6 py-4">
                              <span className="bg-tertiary/10 text-tertiary text-[10px] px-2 py-0.5 rounded font-bold">{route.routeType}</span>
                           </td>
                           <td className="px-6 py-4 text-right space-x-2">
                              <button onClick={() => handleEditRoute(route)} className="text-secondary hover:text-accent transition-colors"><Edit2 size={16} /></button>
                              <button onClick={() => handleDeleteRoute(route.id)} className="text-secondary hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
           ) : (
             <div className="space-y-4">
                {buttons.map(btn => (
                  <div key={btn.id} className="bg-surface border border-line p-4 rounded-xl flex items-center justify-between group hover:border-accent transition-all">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-background border border-line flex items-center justify-center text-accent">
                           <MousePointer2 size={20} />
                        </div>
                        <div>
                           <div className="flex items-center gap-2">
                              <h3 className="font-bold text-primary">{btn.buttonLabel}</h3>
                              <span className="bg-accent/10 text-accent text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">{btn.locationGroup}</span>
                           </div>
                           <div className="flex items-center gap-2 mt-1 text-xs text-secondary">
                              <LinkIcon size={12} />
                              <span className="font-mono">{btn.route?.routePath}</span>
                              <span className="mx-1">•</span>
                              <span>{btn.buttonStyle}</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => handleEditButton(btn)} className="p-2 text-secondary hover:text-accent transition-colors"><Edit2 size={18} /></button>
                        <button onClick={() => handleDeleteButton(btn.id)} className="p-2 text-secondary hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
