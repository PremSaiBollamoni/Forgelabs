import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { GetStartedButton } from '../components/ui/get-started-button';
import api from '../api/axios';

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        setLoading(true);
        const response = await api.get('/pricing');
        const parsedData = (Array.isArray(response.data) ? response.data : []).map(p => ({
          ...p,
          features: typeof p.features === 'string' ? JSON.parse(p.features) : (Array.isArray(p.features) ? p.features : [])
        }));
        setPlans(parsedData);
      } catch (err) {
        setError('Failed to load pricing.');
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
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
      <div className="container mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">Smart Pricing</h1>
          <p className="text-xl text-secondary">
            Clear, realistic entry packages. No hidden fees. No unpredictable hourly billing. 
            We define the exact scope, agree on the price upfront, and deliver premium results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((tier, i) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
              className={clsx(
                "p-8 rounded-xl border flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:hover:shadow-primary/5",
                (tier.isFeatured || (plans.length === 3 && i === 1)) ? "bg-surface border-2 border-accent relative md:scale-105 z-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none" : "bg-background border-line"
              )}
            >
              {(tier.isFeatured || (plans.length === 3 && i === 1)) && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-8 -translate-y-1/2 bg-accent text-white text-[11px] uppercase tracking-widest font-bold px-4 py-1.5 rounded-full shadow-md">
                   Most Popular
                </div>
              )}
              <div className="label-md text-tertiary mb-2 mt-4 md:mt-0">{tier.isFeatured ? 'Most Popular' : 'Studio Tier'}</div>
              <h3 className="text-2xl font-display font-bold text-primary mb-4">{tier.planName}</h3>
              <div className="text-xs font-bold text-tertiary tracking-wider mb-1">STARTING FROM</div>
              <div className="text-5xl font-display font-bold mb-6 text-primary">
                {tier.currency === 'INR' ? '₹' : tier.currency === 'USD' ? '$' : tier.currency}{tier.price}
              </div>
              <p className="text-secondary mb-8 flex-grow">{tier.shortDescription}</p>
              
              <ul className="space-y-4 mb-10 pt-6 border-t border-line/40">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-primary">
                    <Check className="text-accent mt-0.5 shrink-0" size={18} />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <GetStartedButton asChild text={tier.ctaLabel || "Build With Us"} variant={tier.isFeatured ? "default" : "outline"} className="w-full mt-auto">
                <Link to="/contact" />
              </GetStartedButton>
            </motion.div>
          ))}
        </div>

        <div className="p-10 border border-line bg-surface rounded-lg text-center max-w-4xl mx-auto">
          <h3 className="text-2xl font-display font-bold mb-4 text-primary">Need a full production SaaS?</h3>
          <p className="text-secondary mb-6 max-w-2xl mx-auto">For enterprise-grade applications, extensive AI integrations, or massive scale projects, we provide custom quotes based on precise, detailed architecture mapping.</p>
          <GetStartedButton asChild text="Request Custom Quote" className="w-full sm:w-auto">
            <Link to="/contact" />
          </GetStartedButton>
        </div>
      </div>
    </motion.div>
  );
}
