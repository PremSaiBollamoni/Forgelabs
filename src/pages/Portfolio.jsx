import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { ParticleTextEffect } from '../components/ui/particle-text-effect';
import { BauhausCard } from '../components/ui/bauhaus-card';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Loader2, AlertCircle } from 'lucide-react';

export default function Portfolio() {
  const [filter, setFilter] = useState('All');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await api.get('/projects');
        const parsedData = (Array.isArray(response.data) ? response.data : []).map(p => ({
          ...p,
          stack: typeof p.techStack === 'string' ? JSON.parse(p.techStack) : (Array.isArray(p.techStack) ? p.techStack : [])
        }));
        setProjects(parsedData);
      } catch (err) {
        setError('Failed to load portfolio.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const categories = ['All', ...new Set(projects.map(p => p.category))];
  const filteredProjects = projects.filter(p => filter === 'All' || p.category === filter);

  if (loading) return (
    <div className="pt-32 pb-24 flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-accent w-10 h-10" />
    </div>
  );

  if (error) return (
    <div className="pt-32 pb-24 px-6 text-center">
      <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
      <h2 className="text-2xl font-bold mb-4">{error}</h2>
      <button onClick={() => window.location.reload()} className="px-6 py-2 bg-primary text-background rounded-lg">Retry</button>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-24 px-6"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Hero */}
        <div className="mb-16 rounded-2xl border border-line overflow-hidden flex flex-col md:flex-row items-center gap-0">
          {/* Text — left */}
          <div className="flex-1 p-12">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-primary">Case Studies</h1>
            <p className="text-xl text-secondary max-w-xl">
              A selection of production-grade solutions built for ambitious founders, startups, and established brands.
            </p>
          </div>
          {/* Particle — right, decorative only */}
          <div className="flex-1 w-full pointer-events-none select-none opacity-80 hidden md:block">
            <ParticleTextEffect
              words={["DESIGN", "INNOVATE", "EXECUTE", "DELIVER"]}
              withControls={false}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={clsx(
                'px-5 py-2 rounded text-sm font-medium transition-colors border',
                filter === cat 
                  ? 'bg-primary text-background border-transparent' 
                  : 'bg-transparent text-secondary border-line hover:border-tertiary'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 justify-items-center">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => {
              const colors = ['#156ef6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];
              const accentColor = colors[index % colors.length];
              
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <BauhausCard
                    id={project.slug}
                    accentColor={accentColor}
                    topInscription={project.category}
                    mainText={project.title}
                    subMainText={project.shortDescription}
                    progressBarInscription="Technical Stack"
                    progress={100}
                    progressValue={project.stack?.[0] || 'Modern Stack'}
                    filledButtonInscription="View Case Study"
                    outlinedButtonInscription="Contact Us"
                    onFilledButtonClick={(id) => navigate(`/portfolio/${id}`)}
                    onOutlinedButtonClick={() => navigate('/contact')}
                    onMoreOptionsClick={() => {}}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
