import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Layout, Cpu, Webhook, MonitorSmartphone, Rocket, Smartphone, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GetStartedButton } from '../components/ui/get-started-button';
import { ParticleTextEffect } from '../components/ui/particle-text-effect';
import api from '../api/axios';

const iconMap = {
  'layout': Layout,
  'monitor-smartphone': MonitorSmartphone,
  'code': Code,
  'smartphone': Smartphone,
  'rocket': Rocket,
  'cpu': Cpu,
  'webhook': Webhook,
  'globe': Layout // fallback
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await api.get('/services');
        setServices(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError('Failed to load services.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) return (
    <div className="pt-32 pb-24 flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-accent w-10 h-10" />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-24 px-6"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="max-w-3xl mb-20">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">Our Services</h1>
          <p className="text-xl text-secondary">
            We don't just write code. We execute digital strategies. From simple landing pages to complex AI integrations, we deliver production-grade solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => {
            const Icon = iconMap[service.iconName?.toLowerCase()] || Code;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 border border-line bg-surface rounded-lg hover:bg-surface transition-colors"
              >
                <Icon className="text-primary mb-6" size={32} />
                <h3 className="text-2xl font-display font-bold mb-3">{service.title}</h3>
                <p className="text-secondary leading-relaxed">{service.shortDescription}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-24 mb-10 pt-16 border-t border-line">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-primary">Creative Technology & WebGL</h2>
              <p className="text-secondary mb-6 text-lg">
                We go beyond standard DOM manipulation. If your brand demands an unforgettable, immersive experience, we build custom high-performance WebGL animations, physics simulations, and particle engines directly in the browser.
              </p>
              <ul className="space-y-2 mb-8 text-secondary">
                <li className="flex items-center gap-2">• <span className="text-primary font-medium">Interactive Canvas</span></li>
                <li className="flex items-center gap-2">• <span className="text-primary font-medium">Three.js / WebGL</span></li>
                <li className="flex items-center gap-2">• <span className="text-primary font-medium">Physics & Data Visualization</span></li>
              </ul>
            </div>
            <div className="md:w-1/2 w-full">
              <ParticleTextEffect words={["WEBGL", "PHYSICS", "CANVAS"]} className="rounded-xl border border-line" />
            </div>
          </div>
        </div>
        
        <div className="mt-20 text-center p-10 border border-line bg-surface rounded-lg">
          <h3 className="text-2xl font-display font-bold mb-4 text-primary">Ready to execute your vision?</h3>
          <p className="text-secondary mb-8 max-w-2xl mx-auto">Stop waiting and start building. Let's discuss your project scope and find the right execution plan.</p>
          <GetStartedButton asChild text="Build With Us">
            <Link to="/contact" />
          </GetStartedButton>
        </div>
      </div>
    </motion.div>
  );
}
