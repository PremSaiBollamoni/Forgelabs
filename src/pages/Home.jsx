import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Zap, Clock, Target, XCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { PricingBlocks } from '../components/ui/pricing-blocks';
import { DemoBauhaus } from '../components/ui/demo-bauhaus';
import { GLSLHills } from '../components/ui/glsl-hills';
import { GetStartedButton } from '../components/ui/get-started-button';
import { LiquidButton } from '../components/ui/liquid-glass-button';
import { CircularTestimonials } from '../components/ui/circular-testimonials';
import api from '../api/axios';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [plans, setPlans] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [settings, setSettings] = useState(null);
  const [heroButtons, setHeroButtons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [faqsRes, pricingRes, projectsRes, testimonialsRes, settingsRes, buttonsRes] = await Promise.all([
          api.get('/faqs'),
          api.get('/pricing'),
          api.get('/projects/featured'),
          api.get('/testimonials'),
          api.get('/settings'),
          api.get('/hero-buttons')
        ]);
        setFaqs(Array.isArray(faqsRes.data) ? faqsRes.data : []);
        setSettings(Array.isArray(settingsRes.data) ? settingsRes.data[0] : settingsRes.data);
        setHeroButtons(Array.isArray(buttonsRes.data) ? buttonsRes.data : []);
        const pricingData = Array.isArray(pricingRes.data) ? pricingRes.data : [];
        setPlans(pricingData.map(p => ({
          ...p,
          name: p.planName,
          featured: p.isFeatured,
          features: typeof p.features === 'string' ? JSON.parse(p.features) : (Array.isArray(p.features) ? p.features : [])
        })));
        setFeaturedProjects(Array.isArray(projectsRes.data) ? projectsRes.data : []);
        const testimonialsData = Array.isArray(testimonialsRes.data) ? testimonialsRes.data : [];
        setTestimonials(testimonialsData.map(t => ({
          quote: t.quote,
          name: t.name,
          designation: t.designation,
          src: t.imageUrl
        })));
      } catch (err) {
        // Error handled by UI state
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-40 md:pb-32 px-6 overflow-hidden min-h-[90vh] flex items-center">
        {/* Animated 3D Wireframe Hills Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-100 dark:opacity-60 flex items-center justify-center">
          {/* Atmospheric fog layer behind the hills */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.02)_0%,_transparent_70%)] dark:hidden z-0"></div>
          
          {/* Main vertical fades to contain the animation area */}
          <div className="absolute top-0 w-full h-full bg-gradient-to-b from-background via-transparent to-background z-20 pointer-events-none"></div>
          
          {/* Central mask to ensure high hero text contrast */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--bg-base)_0%,_transparent_80%)] opacity-40 dark:hidden z-30 pointer-events-none"></div>

          <div className="relative z-10 w-[110%] h-[110%] transform -translate-y-8 md:-translate-y-12 blur-[1.5px] opacity-70">
            <GLSLHills cameraZ={135} speed={0.3} className="w-full h-full" />
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[100px] z-0 pointer-events-none"></div>
        
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <motion.div variants={staggerContainer} initial="initial" animate="animate">
            <motion.div variants={fadeUp} className="inline-block mb-4 px-4 py-1.5 rounded border border-line bg-surface backdrop-blur-sm text-xs font-medium text-primary shadow-sm shadow-primary/5">
              {settings?.footerTagline || "Premium Digital Execution Studio"}
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-balance leading-[1.1] mb-8">
              We build <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">exceptional</span> digital products.
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-secondary max-w-2xl mx-auto mb-10 text-balance">
              {settings?.footerTagline ? `Based in ${settings.location || 'the cloud'}, we are ${settings.siteName || 'ForgeLabs'}. ${settings.footerTagline}` : "Stop dealing with freelancer ghosting and expensive agency overhead. Get premium execution at smart pricing for startups, founders, and local brands."}
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {heroButtons.length > 0 ? (
                heroButtons.map((btn) => (
                  btn.variant === 'primary' ? (
                    <GetStartedButton key={btn.id} asChild text={btn.label} className="w-full sm:w-auto shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-shadow">
                      <Link to={btn.route} />
                    </GetStartedButton>
                  ) : (
                    <LiquidButton key={btn.id} asChild variant="outline" className="w-full sm:w-auto">
                      <Link to={btn.route}>{btn.label}</Link>
                    </LiquidButton>
                  )
                ))
              ) : (
                <>
                  <GetStartedButton asChild text="Build With Us" className="w-full sm:w-auto shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-shadow">
                    <Link to="/contact" />
                  </GetStartedButton>
                  <LiquidButton asChild variant="outline" className="w-full sm:w-auto">
                    <Link to="/portfolio">View Our Work</Link>
                  </LiquidButton>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-10 border-y border-line bg-surface/50">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
              <ShieldCheck className="text-accent mb-2 md:mb-0" size={24} />
              <span className="font-medium text-sm text-secondary uppercase tracking-wider">7x Best Project Awards</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
              <Zap className="text-accent mb-2 md:mb-0" size={24} />
              <span className="font-medium text-sm text-secondary uppercase tracking-wider">IEEE Runner-Up 2024</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
              <Target className="text-accent mb-2 md:mb-0" size={24} />
              <span className="font-medium text-sm text-secondary uppercase tracking-wider">9.3 CGPA CSE</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
              <Clock className="text-accent mb-2 md:mb-0" size={24} />
              <span className="font-medium text-sm text-secondary uppercase tracking-wider">Agentic AI Developer</span>
            </div>
          </div>
        </div>
      </section>

      {/* Complex Web Components Demo */}
      <section className="py-24 px-6 bg-surface border-y border-line overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Complex UI, Engineered Beautifully.</h2>
            <p className="text-secondary text-lg max-w-2xl mx-auto">
              We build custom components that feel alive. From interactive dashboards to floating physics-based cards, your interface should never feel static.
            </p>
          </div>
          <DemoBauhaus projects={featuredProjects} />
        </div>
      </section>

      {/* The Old Way vs ForgeLabs */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">The old way is broken.</h2>
            <p className="text-secondary text-lg max-w-2xl mx-auto">
              Hiring on marketplaces is a gamble. Traditional agencies are slow and overpriced. We created a better execution model.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-lg border border-line bg-surface opacity-80">
              <h3 className="text-xl font-bold mb-6 text-tertiary">Marketplace Freelancers</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-secondary"><XCircle className="text-red-500 shrink-0" size={20} /> High risk of ghosting</li>
                <li className="flex items-start gap-3 text-secondary"><XCircle className="text-red-500 shrink-0" size={20} /> Inconsistent, random quality</li>
                <li className="flex items-start gap-3 text-secondary"><XCircle className="text-red-500 shrink-0" size={20} /> Poor communication</li>
              </ul>
            </div>
            <div className="p-8 rounded-lg border border-line bg-surface opacity-80">
              <h3 className="text-xl font-bold mb-6 text-tertiary">Traditional Agencies</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-secondary"><XCircle className="text-red-500 shrink-0" size={20} /> Slow moving processes</li>
                <li className="flex items-start gap-3 text-secondary"><XCircle className="text-red-500 shrink-0" size={20} /> Exorbitant overhead costs</li>
                <li className="flex items-start gap-3 text-secondary"><XCircle className="text-red-500 shrink-0" size={20} /> You're treated like a ticket</li>
              </ul>
            </div>
            <div className="p-8 rounded-lg border border-line bg-surface relative shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-accent text-white text-xs font-bold px-3 py-1 rounded">The ForgeLabs Way</div>
              <h3 className="text-xl font-bold mb-6 text-primary">ForgeLabs Studio</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-primary"><CheckCircle2 className="text-accent shrink-0" size={20} /> Guaranteed, structured delivery</li>
                <li className="flex items-start gap-3 text-primary"><CheckCircle2 className="text-accent shrink-0" size={20} /> Premium, production-grade quality</li>
                <li className="flex items-start gap-3 text-primary"><CheckCircle2 className="text-accent shrink-0" size={20} /> Direct communication & fast support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-24 px-6 bg-surface border-y border-line">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Structured Execution</h2>
            <p className="text-secondary text-lg">Our proven blueprint for building premium digital products predictably.</p>
          </div>
          
          <div className="relative border-l border-line ml-4 md:ml-8 space-y-12 pb-4">
            {[
              { step: '01', title: 'Discovery', desc: 'We understand your goals, define the exact scope, and provide a transparent quote.' },
              { step: '02', title: 'Planning', desc: 'Wireframes, architecture design, and timeline mapping so there are zero surprises.' },
              { step: '03', title: 'Execution', desc: 'Our studio builds your product with premium code, modern aesthetics, and daily updates.' },
              { step: '04', title: 'Review', desc: 'You review the functional build. We refine, polish, and optimize based on your feedback.' },
              { step: '05', title: 'Delivery & Support', desc: 'We hand over the polished product, deploy it, and remain available for ongoing support.' }
            ].map((phase, i) => (
              <div key={i} className="relative pl-8 md:pl-12">
                <div className="absolute -left-3.5 top-1 w-7 h-7 bg-background border border-line rounded flex items-center justify-center text-[10px] font-bold text-tertiary">
                  {phase.step}
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">{phase.title}</h3>
                <p className="text-secondary">{phase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements / Credentials */}
      <section className="py-24 px-6 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Built on Excellence</h2>
            <p className="text-secondary text-lg">A track record of technical innovation and award-winning execution.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-line rounded-lg bg-surface flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-6">
                <Target size={32} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">IEEE Runner-Up 2024</h3>
              <p className="text-secondary">Awarded 2nd Place at the IEEE Bangalore Section Rapid Innovation Challenge for an AI-driven platform.</p>
            </div>
            <div className="p-8 border border-line rounded-lg bg-surface flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">7x Best Project</h3>
              <p className="text-secondary">Consistently secured the "Best Project of the Semester" award for 7 consecutive semesters.</p>
            </div>
            <div className="p-8 border border-line rounded-lg bg-surface flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-6">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">NASSCOM Gold</h3>
              <p className="text-secondary">Achieved 95%+ in the NASSCOM FutureSkills Prime Certification for Data Science & AI/ML.</p>
            </div>
          </div>
        </div>
      </section>


      {/* Testimonials */}
      <section className="py-24 px-6 bg-surface overflow-hidden">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-16">Trusted for Excellence</h2>
          <CircularTestimonials 
            testimonials={testimonials.length > 0 ? testimonials : [
              {
                quote: "The attention to detail and technical execution was far beyond what we expected from a studio. Truly premium work.",
                name: "Sarah Chen",
                designation: "Product Lead at Nexus AI",
                src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop"
              }
            ]}
          />
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-7xl text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Smart Pricing.</h2>
          <p className="text-secondary text-lg mb-16 max-w-xl mx-auto">Transparent entry packages tailored to your project scope. No hidden fees.</p>
          
          <PricingBlocks
            tiers={plans}
            compact={true}
          />
          
          <div className="mt-12 text-secondary">
            Need a complex platform? <Link to="/contact" className="text-accent hover:underline">Request a Custom Quote.</Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-surface border-y border-line">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Frequently Asked</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-line rounded-lg bg-background overflow-hidden">
                <button 
                  className="w-full text-left px-6 py-4 font-medium text-primary flex justify-between items-center hover:bg-surface transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.question}
                  <span className="text-accent">{openFaq === i ? '-' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-secondary text-sm">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
