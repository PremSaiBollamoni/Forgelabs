import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Code2, Rocket, Target, Zap, Loader2, AlertCircle } from 'lucide-react';
import { LiquidButton } from '../components/ui/liquid-glass-button';
import { CircularGallery } from '../components/ui/circular-gallery';
import { useEffect, useState } from 'react';
import { getDirectImageUrl } from '../lib/utils';
import api from '../api/axios';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export default function PortfolioDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectRes, listRes] = await Promise.all([
          api.get(`/projects/${slug}`),
          api.get('/projects')
        ]);
        
        const p = projectRes.data;
        const parsedProject = {
          ...p,
          stack: typeof p.techStack === 'string' ? JSON.parse(p.techStack) : p.techStack,
          features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features,
          gallery: p.gallery || []
        };
        
        setProject(parsedProject);
        setAllProjects(listRes.data);
      } catch (err) {
        setError('Project not found or server error.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="animate-spin text-accent w-12 h-12" />
    </div>
  );

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold mb-4">{error || 'Project not found'}</h2>
          <Link to="/portfolio" className="text-accent hover:underline flex items-center justify-center gap-2">
            <ArrowLeft size={16} /> Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  const projectIndex = allProjects.findIndex(p => p.slug === slug);
  const nextProject = allProjects[(projectIndex + 1) % allProjects.length];
  const prevProject = allProjects[(projectIndex - 1 + allProjects.length) % allProjects.length];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full"
    >
      {/* Back Button */}
      <div className="container mx-auto max-w-7xl px-6 pt-8">
        <Link 
          to="/portfolio" 
          className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:text-primary transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Portfolio
        </Link>
      </div>

      {/* Hero Section */}
      <section className="pt-12 pb-24 px-6 overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <motion.div variants={staggerContainer} initial="initial" animate="animate">
            <motion.div variants={fadeUp} className="label-md text-accent mb-6">
              {project.category}
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-display font-bold text-primary mb-8 leading-[1.1]">
              {project.title}
            </motion.h1>
            <motion.p variants={fadeUp} className="text-xl md:text-2xl text-secondary max-w-3xl mb-12 leading-relaxed">
              {project.shortDescription}
            </motion.p>
            
            <motion.div variants={fadeUp} className="relative mt-12">
               <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none z-0">
                  <div className="text-[10vw] font-display font-black tracking-tighter uppercase opacity-5 rotate-[-2deg] select-none">
                    {project.title}
                  </div>
               </div>
               
               {project.gallery && project.gallery.length > 0 && (
                 <CircularGallery items={project.gallery.map((img, idx) => ({ 
                   src: getDirectImageUrl(img.imageUrl), 
                   title: img.caption || `Project Screen ${idx + 1}` 
                 }))} />
               )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-24 px-6 bg-surface/50 border-y border-line">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-3xl font-display font-bold mb-8 flex items-center gap-3">
                <Target className="text-accent" />
                The Challenge
              </h2>
              <p className="text-lg text-secondary leading-relaxed italic">
                "{project.problemStatement}"
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-display font-bold mb-8 flex items-center gap-3">
                <Zap className="text-accent" />
                The Execution
              </h2>
              <p className="text-lg text-secondary leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">Core Capabilities</h2>
            <p className="text-secondary">Engineered for performance, scale, and user experience.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {project.features && Array.isArray(project.features) ? project.features.map((feature, i) => (
              <div key={i} className="p-8 rounded-xl border border-line bg-surface hover:border-tertiary transition-colors group">
                <div className="w-12 h-12 bg-background border border-line rounded flex items-center justify-center mb-6 group-hover:border-accent transition-colors">
                  <CheckCircle2 size={20} className="text-accent" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">
                  {typeof feature === 'string' ? feature : feature.title}
                </h3>
                <p className="text-secondary leading-relaxed">
                  {typeof feature === 'string' ? 'Premium integrated feature module.' : feature.description}
                </p>
              </div>
            )) : null}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 px-6 bg-surface border-y border-line">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
            <div className="max-w-md">
              <h2 className="text-3xl font-display font-bold mb-4 flex items-center gap-3">
                <Code2 className="text-accent" />
                Tech Stack
              </h2>
              <p className="text-secondary">We leverage a modern, battle-tested stack to ensure stability and high-speed execution.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              {project.stack && project.stack.map((tech) => (
                <span key={tech} className="px-6 py-3 rounded-full border border-line bg-background text-sm font-bold text-primary shadow-sm hover:border-tertiary transition-colors">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-32 px-6 bg-background">
        <div className="container mx-auto max-w-5xl">
          <div className="p-12 md:p-20 rounded-3xl bg-primary text-background relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 label-md text-accent mb-8">
                <Rocket size={16} />
                The Impact
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 text-balance">
                {project.outcomes}
              </h2>
              <div className="w-20 h-1 bg-accent/30 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Navigation */}
      {allProjects.length > 0 && (
        <section className="py-24 border-t border-line">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="flex flex-col md:flex-row gap-8">
              {prevProject && (
                <Link 
                  to={`/portfolio/${prevProject.slug}`}
                  className="flex-1 p-10 rounded-2xl border border-line group hover:border-tertiary transition-all"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-tertiary uppercase tracking-widest mb-4">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Previous Project
                  </div>
                  <h4 className="text-2xl font-display font-bold text-primary group-hover:text-accent transition-colors">
                    {prevProject.title}
                  </h4>
                </Link>
              )}
              
              {nextProject && (
                <Link 
                  to={`/portfolio/${nextProject.slug}`}
                  className="flex-1 p-10 rounded-2xl border border-line text-right group hover:border-tertiary transition-all"
                >
                  <div className="flex items-center justify-end gap-2 text-xs font-bold text-tertiary uppercase tracking-widest mb-4">
                    Next Project
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h4 className="text-2xl font-display font-bold text-primary group-hover:text-accent transition-colors">
                    {nextProject.title}
                  </h4>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-32 px-6 bg-surface border-t border-line">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-8">Have a similar project in mind?</h2>
          <p className="text-xl text-secondary mb-12">
            We specialize in turning complex requirements into premium digital experiences. Let's discuss how we can build your next solution.
          </p>
          <LiquidButton asChild size="lg">
            <Link to="/contact">Discuss Your Project</Link>
          </LiquidButton>
        </div>
      </section>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </motion.div>
  );
}
