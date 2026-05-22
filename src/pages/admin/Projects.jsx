import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Plus, Edit2, Trash2, ExternalLink, Loader2, AlertCircle, Image as ImageIcon, LayoutGrid, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/projects');
      setProjects(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project? All associated gallery images will also be removed.')) return;
    try {
      setDeleteLoading(id);
      await api.delete(`/admin/projects/${id}`);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete project');
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
          <h1 className="text-3xl font-display font-bold">Projects</h1>
          <p className="text-secondary">Manage your portfolio and case studies.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/projects/new')}
          className="bg-accent text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-lg shadow-accent/20"
        >
          <Plus size={20} />
          Add Project
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-surface border border-line rounded-xl overflow-hidden group hover:border-accent/30 transition-all"
            >
              <div className="aspect-video relative overflow-hidden bg-background">
                {project.heroImageUrl ? (
                  <img 
                    src={project.heroImageUrl} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-tertiary">
                    <ImageIcon size={40} />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    project.publishStatus === 'PUBLISHED' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {project.publishStatus}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1 block">
                      {project.category}
                    </span>
                    <h3 className="text-xl font-display font-bold text-primary group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => window.open(`/portfolio/${project.slug}`, '_blank')}
                      className="p-2 text-secondary hover:text-primary transition-colors"
                      title="View Live"
                    >
                      <ExternalLink size={18} />
                    </button>
                    <button 
                      onClick={() => navigate(`/admin/projects/edit/${project.id}`)}
                      className="p-2 text-secondary hover:text-accent transition-colors"
                      title="Edit Project"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(project.id)}
                      disabled={deleteLoading === project.id}
                      className="p-2 text-secondary hover:text-red-500 transition-colors"
                      title="Delete Project"
                    >
                      {deleteLoading === project.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                    </button>
                  </div>
                </div>

                <p className="text-secondary text-sm line-clamp-2 mb-6">
                  {project.shortDescription}
                </p>

                <div className="flex items-center gap-4 pt-4 border-t border-line/40 text-[11px] font-medium text-tertiary">
                  <div className="flex items-center gap-1">
                    <LayoutGrid size={14} />
                    {project.techStack ? JSON.parse(project.techStack).length : 0} Tools
                  </div>
                  <div className="flex items-center gap-1">
                    <ImageIcon size={14} />
                    {project.gallery ? project.gallery.length : 0} Images
                  </div>
                  {project.isFeatured && (
                    <div className="flex items-center gap-1 text-accent">
                      <Plus size={14} className="rotate-45" />
                      Featured
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
