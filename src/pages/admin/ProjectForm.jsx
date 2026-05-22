import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { getDirectImageUrl } from '../../lib/utils';
import { Save, ArrowLeft, Plus, Trash2, Loader2, Image as ImageIcon, Code, Info, CheckCircle, AlertCircle, ChevronUp, ChevronDown, X, Terminal, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isNewCategory, setIsNewCategory] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    shortDescription: '',
    problemStatement: '',
    solution: '',
    outcomes: '',
    isFeatured: false,
    publishStatus: 'PUBLISHED',
    techStack: [],
    features: [],
    gallery: [] // Array of {imageUrl: '', caption: ''}
  });

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchProject();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/admin/projects');
      const data = Array.isArray(response.data) ? response.data : [];
      const cats = [...new Set(data.map(p => p.category))].filter(Boolean);
      setCategories(cats);
    } catch (err) {
      // Error silently handled
    }
  };

  const fetchProject = async () => {
    try {
      const response = await api.get(`/admin/projects/${id}`);
      const project = response.data;
      
      // Parse JSON strings
      setFormData({
        ...project,
        techStack: typeof project.techStack === 'string' ? JSON.parse(project.techStack) : project.techStack || [],
        features: typeof project.features === 'string' ? JSON.parse(project.features) : project.features || [],
        gallery: project.gallery || []
      });
    } catch (err) {
      setError('Failed to load project data.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Tech Stack & Features dynamic lists
  const handleListItemChange = (listName, index, value) => {
    const newList = [...formData[listName]];
    newList[index] = value;
    setFormData({ ...formData, [listName]: newList });
  };

  const addListItem = (listName) => {
    setFormData({ ...formData, [listName]: [...formData[listName], ''] });
  };

  const removeListItem = (listName, index) => {
    setFormData({ 
      ...formData, 
      [listName]: formData[listName].filter((_, i) => i !== index) 
    });
  };

  // Gallery dynamic list
  const addGalleryItem = () => {
    setFormData({ ...formData, gallery: [...formData.gallery, { imageUrl: '', caption: '' }] });
  };

  const handleGalleryChange = (index, field, value) => {
    const newGallery = [...formData.gallery];
    newGallery[index] = { ...newGallery[index], [field]: value };
    setFormData({ ...formData, gallery: newGallery });
  };

  const removeGalleryItem = (index) => {
    setFormData({ 
      ...formData, 
      gallery: formData.gallery.filter((_, i) => i !== index) 
    });
  };

  const moveGalleryItem = (index, direction) => {
    const newGallery = [...formData.gallery];
    if (direction === 'up' && index > 0) {
      [newGallery[index], newGallery[index - 1]] = [newGallery[index - 1], newGallery[index]];
    } else if (direction === 'down' && index < newGallery.length - 1) {
      [newGallery[index], newGallery[index + 1]] = [newGallery[index + 1], newGallery[index]];
    }
    setFormData({ ...formData, gallery: newGallery });
  };

  const handleGithubImport = async () => {
    if (!githubUrl) return;
    try {
      setIsImporting(true);
      setError(null);
      
      const response = await api.post('/admin/github/import', { url: githubUrl });
      const data = response.data;
      
      setFormData(prev => ({
        ...prev,
        title: data.title || prev.title,
        slug: data.slug || prev.slug,
        shortDescription: data.shortDescription || prev.shortDescription,
        problemStatement: data.problemStatement || prev.problemStatement,
        solution: data.solution || prev.solution,
        outcomes: data.outcomes || prev.outcomes,
        techStack: data.techStack && data.techStack.length > 0 ? [...new Set([...prev.techStack, ...data.techStack])] : prev.techStack,
        features: data.features && data.features.length > 0 ? [...new Set([...prev.features, ...data.features])] : prev.features
      }));

    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setError('AI Import failed: ' + msg);
    } finally {
      setIsImporting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      // Stringify lists for backend
      const payload = {
        ...formData,
        techStack: JSON.stringify(formData.techStack),
        features: JSON.stringify(formData.features),
        // The backend expects List<ProjectGallery> objects
        gallery: formData.gallery.map(g => ({ imageUrl: g.imageUrl, caption: g.caption }))
      };

      if (isEdit) {
        await api.put(`/admin/projects/${id}`, payload);
      } else {
        await api.post('/admin/projects', payload);
      }
      
      navigate('/admin/projects');
    } catch (err) {
      setError('Failed to save project. Please check all fields.');
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
    <div className="max-w-5xl space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/admin/projects')}
          className="p-2 hover:bg-surface rounded-lg transition-colors text-secondary"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-display font-bold">
            {isEdit ? 'Edit Project' : 'New Project'}
          </h1>
          <p className="text-secondary">Fill in the details to update your portfolio.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* GitHub Magic Import */}
        {!isEdit && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-grow space-y-2">
              <label className="text-sm font-bold flex items-center gap-2 text-primary">
                <Terminal size={18} />
                GitHub Magic Import (Beta)
              </label>
              <input 
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="w-full bg-background border border-primary/20 rounded-lg px-4 py-2.5 focus:border-primary outline-none"
              />
            </div>
            <button 
              type="button"
              onClick={handleGithubImport}
              disabled={isImporting || !githubUrl}
              className="bg-primary text-background px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
            >
              {isImporting ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
              Magic Import
            </button>
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-surface border border-line rounded-xl overflow-hidden">
          <div className="p-6 border-b border-line bg-background/30 flex items-center gap-2 font-bold">
            <Info size={18} className="text-accent" />
            General Information
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Title</label>
              <input 
                name="title" value={formData.title || ''} onChange={handleInputChange} required
                className="w-full bg-background border border-line rounded-lg px-4 py-2.5 focus:border-accent outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug (URL path)</label>
              <input 
                name="slug" value={formData.slug || ''} onChange={handleInputChange} required
                className="w-full bg-background border border-line rounded-lg px-4 py-2.5 focus:border-accent outline-none"
                placeholder="my-cool-project"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex justify-between items-center">
                <span>Category</span>
                <button 
                  type="button"
                  onClick={() => setIsNewCategory(!isNewCategory)}
                  className="text-[10px] uppercase tracking-wider font-bold text-accent hover:underline"
                >
                  {isNewCategory ? 'Select Existing' : '+ Add New'}
                </button>
              </label>
              {isNewCategory ? (
                <input 
                  name="category" 
                  value={formData.category || ''} 
                  onChange={handleInputChange} 
                  required
                  autoFocus
                  className="w-full bg-background border border-line rounded-lg px-4 py-2.5 focus:border-accent outline-none"
                  placeholder="Enter new category..."
                />
              ) : (
                <select 
                  name="category" 
                  value={formData.category || ''} 
                  onChange={handleInputChange} 
                  required
                  className="w-full bg-background border border-line rounded-lg px-4 py-2.5 focus:border-accent outline-none appearance-none"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex items-center gap-6 pt-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleInputChange}
                  className="w-4 h-4 accent-accent"
                />
                <span className="text-sm font-medium">Featured Project</span>
              </label>
              <div className="flex items-center gap-2">
                 <label className="text-sm font-medium">Status:</label>
                 <select 
                    name="publishStatus" value={formData.publishStatus || 'PUBLISHED'} onChange={handleInputChange}
                    className="bg-background border border-line rounded px-2 py-1 text-sm outline-none focus:border-accent"
                 >
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                 </select>
              </div>
            </div>
          </div>
        </div>

        {/* Descriptions */}
        <div className="bg-surface border border-line rounded-xl overflow-hidden">
          <div className="p-6 border-b border-line bg-background/30 flex items-center gap-2 font-bold">
            <Info size={18} className="text-accent" />
            Content & Story
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Short Description</label>
              <textarea 
                name="shortDescription" value={formData.shortDescription || ''} onChange={handleInputChange} rows={2}
                className="w-full bg-background border border-line rounded-lg px-4 py-2.5 focus:border-accent outline-none resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Problem Statement</label>
              <textarea 
                name="problemStatement" value={formData.problemStatement || ''} onChange={handleInputChange} rows={3}
                className="w-full bg-background border border-line rounded-lg px-4 py-2.5 focus:border-accent outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Solution</label>
              <textarea 
                name="solution" value={formData.solution || ''} onChange={handleInputChange} rows={3}
                className="w-full bg-background border border-line rounded-lg px-4 py-2.5 focus:border-accent outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Outcomes</label>
              <textarea 
                name="outcomes" value={formData.outcomes || ''} onChange={handleInputChange} rows={3}
                className="w-full bg-background border border-line rounded-lg px-4 py-2.5 focus:border-accent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Lists: Tech Stack & Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface border border-line rounded-xl overflow-hidden">
             <div className="p-4 border-b border-line bg-background/30 flex justify-between items-center">
                <span className="font-bold flex items-center gap-2"><Code size={16} /> Tech Stack</span>
                <button type="button" onClick={() => addListItem('techStack')} className="text-accent hover:text-white transition-colors"><Plus size={20} /></button>
             </div>
             <div className="p-4 space-y-2">
                {formData.techStack.map((tech, i) => (
                  <div key={i} className="flex gap-2">
                    <input 
                      value={tech} onChange={(e) => handleListItemChange('techStack', i, e.target.value)}
                      className="flex-grow bg-background border border-line rounded px-3 py-1.5 text-sm outline-none focus:border-accent"
                      placeholder="React, Node.js..."
                    />
                    <button type="button" onClick={() => removeListItem('techStack', i)} className="text-red-500 p-1.5"><Trash2 size={16} /></button>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-surface border border-line rounded-xl overflow-hidden">
             <div className="p-4 border-b border-line bg-background/30 flex justify-between items-center">
                <span className="font-bold flex items-center gap-2"><CheckCircle size={16} /> Key Features</span>
                <button type="button" onClick={() => addListItem('features')} className="text-accent hover:text-white transition-colors"><Plus size={20} /></button>
             </div>
             <div className="p-4 space-y-2">
                {formData.features.map((feature, i) => (
                  <div key={i} className="flex gap-2">
                    <input 
                      value={feature} onChange={(e) => handleListItemChange('features', i, e.target.value)}
                      className="flex-grow bg-background border border-line rounded px-3 py-1.5 text-sm outline-none focus:border-accent"
                      placeholder="Authentication, Real-time sync..."
                    />
                    <button type="button" onClick={() => removeListItem('features', i)} className="text-red-500 p-1.5"><Trash2 size={16} /></button>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="pt-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold flex items-center gap-2 text-xl">
              <ImageIcon size={20} className="text-accent" />
              Project Gallery Images
            </h3>
            <button type="button" onClick={addGalleryItem} className="bg-surface border border-line px-4 py-2 rounded-lg text-sm hover:bg-background transition-colors flex items-center gap-2 font-medium">
              <Plus size={16} /> Add Image
            </button>
          </div>
          
          <div className="space-y-3">
            {formData.gallery.map((img, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-4 items-center p-2 group/row transition-colors">
                <div className="flex flex-col gap-0.5 opacity-20 group-hover/row:opacity-100 transition-opacity">
                   <button 
                      type="button" onClick={() => moveGalleryItem(i, 'up')} disabled={i === 0}
                      className="p-1 hover:bg-surface rounded disabled:opacity-0 text-accent"
                   >
                      <ChevronUp size={14} />
                   </button>
                   <button 
                      type="button" onClick={() => moveGalleryItem(i, 'down')} disabled={i === formData.gallery.length - 1}
                      className="p-1 hover:bg-surface rounded disabled:opacity-0 text-accent"
                   >
                      <ChevronDown size={14} />
                   </button>
                </div>
                <div 
                   className="w-16 h-10 bg-surface rounded overflow-hidden flex-shrink-0 cursor-zoom-in group/img relative border border-line/30"
                   onClick={() => setPreviewImage(getDirectImageUrl(img.imageUrl))}
                >
                  {img.imageUrl ? <img src={getDirectImageUrl(img.imageUrl)} referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform group-hover/img:scale-110" /> : <div className="w-full h-full flex items-center justify-center text-tertiary"><ImageIcon size={14} /></div>}
                </div>
                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                   <input 
                     value={img.imageUrl || ''} onChange={(e) => handleGalleryChange(i, 'imageUrl', e.target.value)}
                     className="w-full bg-transparent border-b border-line/30 focus:border-accent py-1 text-sm outline-none transition-colors"
                     placeholder="Image URL"
                   />
                   <input 
                     value={img.caption || ''} onChange={(e) => handleGalleryChange(i, 'caption', e.target.value)}
                     className="w-full bg-transparent border-b border-line/30 focus:border-accent py-1 text-sm outline-none transition-colors"
                     placeholder="Caption / Title"
                   />
                </div>
                <button type="button" onClick={() => removeGalleryItem(i)} className="text-red-500/30 hover:text-red-500 p-2 transition-colors"><Trash2 size={18} /></button>
              </div>
            ))}
            {formData.gallery.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-line/20 rounded-xl text-secondary">
                <ImageIcon size={32} className="mx-auto mb-3 opacity-20" />
                <p>No gallery images added yet. Click "Add Image" to get started.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button 
            type="button" onClick={() => navigate('/admin/projects')}
            className="px-8 py-3 rounded-lg font-bold border border-line hover:bg-surface transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={saving}
            className="bg-accent text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-lg shadow-accent/20 disabled:opacity-50"
          >
            {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {isEdit ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </form>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-12 cursor-zoom-out"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-3xl w-full flex items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              <img 
                src={previewImage} 
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl border border-white/10" 
                alt="Preview" 
              />
              <button 
                onClick={() => setPreviewImage(null)}
                className="absolute -top-4 -right-4 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer"
              >
                <X size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
