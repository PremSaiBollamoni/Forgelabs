import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SiReact, SiNextdotjs, SiVuedotjs, SiAngular, SiNodedotjs, SiSpring, SiPython, SiDjango, SiPhp, SiLaravel,
  SiMysql, SiPostgresql, SiMongodb, SiRedis, SiSupabase, SiFirebase,
  SiGooglecloud, SiVercel, SiNetlify, SiDocker, SiKubernetes,
  SiOpenai, SiAnthropic, SiStripe, SiTailwindcss, SiJavascript, SiTypescript,
  SiFlutter, SiAndroid, SiApple, SiSwift, SiKotlin, SiGo, SiGraphql, SiRazorpay
} from 'react-icons/si';
import { FaAws, FaJava, FaServer, FaCloud, FaDatabase, FaMobileAlt, FaNetworkWired, FaBrain } from 'react-icons/fa';
import { ArrowRight, ArrowLeft, Bot, CheckCircle2, ChevronRight, Loader2, Download, Rocket, Sparkles, Building2, Users, ListPlus, Clock, IndianRupee, MessageSquare, Lock } from 'lucide-react';
import api from '../api/axios';

const STEPS = [
  { id: 'intro', title: 'Start' },
  { id: 'type', title: 'Project Type' },
  { id: 'audience', title: 'Audience' },
  { id: 'users', title: 'Users' },
  { id: 'features', title: 'Features' },
  { id: 'timeline', title: 'Timeline' },
  { id: 'budget', title: 'Budget' },
  { id: 'additional', title: 'Extra Info' },
  { id: 'lead', title: 'Unlock' },
];

const getTechIcon = (name) => {
  if (!name) return <Sparkles size={24} className="text-tertiary" />;
  const n = name.toLowerCase();
  if (n.includes('react')) return <SiReact size={24} className="text-[#61DAFB]" />;
  if (n.includes('next')) return <SiNextdotjs size={24} className="text-white" />;
  if (n.includes('vue')) return <SiVuedotjs size={24} className="text-[#4FC08D]" />;
  if (n.includes('angular')) return <SiAngular size={24} className="text-[#DD0031]" />;
  if (n.includes('spring')) return <SiSpring size={24} className="text-[#6DB33F]" />;
  if (n.includes('node') || n.includes('express')) return <SiNodedotjs size={24} className="text-[#339933]" />;
  if (n.includes('python')) return <SiPython size={24} className="text-[#3776AB]" />;
  if (n.includes('django')) return <SiDjango size={24} className="text-[#092E20]" />;
  if (n.includes('php') || n.includes('laravel')) return <SiLaravel size={24} className="text-[#FF2D20]" />;
  if (n.includes('postgres')) return <SiPostgresql size={24} className="text-[#4169E1]" />;
  if (n.includes('mysql') || n.includes('sql')) return <SiMysql size={24} className="text-[#4479A1]" />;
  if (n.includes('mongo')) return <SiMongodb size={24} className="text-[#47A248]" />;
  if (n.includes('redis')) return <SiRedis size={24} className="text-[#DC382D]" />;
  if (n.includes('supabase')) return <SiSupabase size={24} className="text-[#3ECF8E]" />;
  if (n.includes('firebase')) return <SiFirebase size={24} className="text-[#FFCA28]" />;
  if (n.includes('aws') || n.includes('amazon')) return <FaAws size={24} className="text-[#FF9900]" />;
  if (n.includes('gcp') || n.includes('google cloud')) return <SiGooglecloud size={24} className="text-[#4285F4]" />;
  if (n.includes('vercel')) return <SiVercel size={24} className="text-white" />;
  if (n.includes('docker')) return <SiDocker size={24} className="text-[#2496ED]" />;
  if (n.includes('kubernetes')) return <SiKubernetes size={24} className="text-[#326CE5]" />;
  if (n.includes('openai') || n.includes('gpt')) return <SiOpenai size={24} className="text-white" />;
  if (n.includes('anthropic') || n.includes('claude')) return <SiAnthropic size={24} className="text-[#D97757]" />;
  if (n.includes('stripe')) return <SiStripe size={24} className="text-[#008CDD]" />;
  if (n.includes('tailwind')) return <SiTailwindcss size={24} className="text-[#06B6D4]" />;
  if (n.includes('typescript') || n.includes('ts')) return <SiTypescript size={24} className="text-[#3178C6]" />;
  if (n.includes('javascript') || n.includes('js')) return <SiJavascript size={24} className="text-[#F7DF1E]" />;
  if (n.includes('flutter')) return <SiFlutter size={24} className="text-[#02569B]" />;
  if (n.includes('android')) return <SiAndroid size={24} className="text-[#3DDC84]" />;
  if (n.includes('ios') || n.includes('apple')) return <SiApple size={24} className="text-white" />;
  if (n.includes('swift')) return <SiSwift size={24} className="text-[#FA7343]" />;
  if (n.includes('kotlin')) return <SiKotlin size={24} className="text-[#7F52FF]" />;
  if (n.includes('go') || n.includes('golang')) return <SiGo size={24} className="text-[#00ADD8]" />;
  if (n.includes('graphql')) return <SiGraphql size={24} className="text-[#E10098]" />;
  if (n.includes('java')) return <FaJava size={24} className="text-[#5382A1]" />;
  if (n.includes('razorpay')) return <SiRazorpay size={24} className="text-[#02042B]" />;
  
  // Generic / Functional keywords fallback
  if (n.includes('api') || n.includes('rest')) return <FaNetworkWired size={24} className="text-[#44A7FF]" />;
  if (n.includes('database') || n.includes('db')) return <FaDatabase size={24} className="text-[#6DB33F]" />;
  if (n.includes('cloud') || n.includes('weather')) return <FaCloud size={24} className="text-[#008CDD]" />;
  if (n.includes('server') || n.includes('backend')) return <FaServer size={24} className="text-secondary" />;
  if (n.includes('mobile') || n.includes('app')) return <FaMobileAlt size={24} className="text-tertiary" />;
  if (n.includes('ai') || n.includes('machine learning')) return <FaBrain size={24} className="text-[#D97757]" />;
  
  return <Sparkles size={24} className="text-tertiary" />;
};

export default function BlueprintGenerator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [blueprint, setBlueprint] = useState(null);
  const [formData, setFormData] = useState({
    projectType: '',
    targetAudience: '',
    targetUsers: '',
    features: '',
    timeline: '',
    budget: '',
    additionalInfo: '',
    name: '',
    email: '',
    phone: '',
  });

  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(c => c + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(c => c - 1);
  };

  const submitGenerator = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post(`/blueprint/generate?name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}&phone=${encodeURIComponent(formData.phone)}`, {
        projectType: formData.projectType,
        targetAudience: formData.targetAudience,
        targetUsers: formData.targetUsers,
        features: formData.features,
        timeline: formData.timeline,
        budget: formData.budget,
        additionalInfo: formData.additionalInfo
      });
      setBlueprint(response.data);
    } catch (err) {
      alert("Failed to generate blueprint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderSelectionCards = (key, options, icon) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => { updateForm(key, opt); nextStep(); }}
          className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
            formData[key] === opt 
              ? 'border-accent bg-accent/10 shadow-[0_0_15px_rgba(0,110,254,0.3)]' 
              : 'border-line bg-surface/50 hover:border-secondary hover:bg-surface'
          }`}
        >
          <div className={`p-2 rounded-lg ${formData[key] === opt ? 'bg-accent/20 text-accent' : 'bg-line/50 text-secondary'}`}>
            {icon}
          </div>
          <span className={`font-medium ${formData[key] === opt ? 'text-primary' : 'text-secondary'}`}>{opt}</span>
        </button>
      ))}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center py-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 text-accent mb-6">
              <Bot size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
              AI Project Blueprint
            </h1>
            <p className="text-xl text-secondary max-w-2xl mx-auto mb-10">
              Tell us what you want to build. Our AI Architect will instantly generate a complete technical roadmap, architecture recommendation, and cost estimate for FREE.
            </p>
            <button
              onClick={nextStep}
              className="bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-full font-bold text-lg inline-flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,110,254,0.4)]"
            >
              Generate My Blueprint <ArrowRight />
            </button>
          </div>
        );
      case 1:
        return (
          <div>
            <h2 className="text-3xl font-display font-bold text-primary">What are you building?</h2>
            <p className="text-secondary mt-2">Select the closest match or describe it later.</p>
            {renderSelectionCards('projectType', [
              'E-Commerce Platform', 'SaaS Application', 'AI Chatbot / Tool', 'Automation System', 'Mobile App', 'Internal Dashboard', 'Startup MVP', 'Corporate Website'
            ], <Rocket size={20} />)}
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-3xl font-display font-bold text-primary">Who is this for?</h2>
            <p className="text-secondary mt-2">What is the scale of the operation?</p>
            {renderSelectionCards('targetAudience', [
              'Startup / New Venture', 'Existing SME Business', 'Enterprise Corporation', 'Student / Academic', 'Personal Project', 'Non-Profit / NGO'
            ], <Building2 size={20} />)}
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-3xl font-display font-bold text-primary">Who are the target users?</h2>
            <p className="text-secondary mt-2">e.g., General public, internal employees, students...</p>
            <div className="mt-6">
              <input
                type="text"
                placeholder="e.g. Real estate agents and home buyers"
                className="w-full bg-surface border border-line rounded-xl px-4 py-4 text-primary focus:outline-none focus:border-accent transition-colors"
                value={formData.targetUsers}
                onChange={(e) => updateForm('targetUsers', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && formData.targetUsers && nextStep()}
                autoFocus
              />
              <button 
                onClick={nextStep}
                disabled={!formData.targetUsers}
                className="mt-6 w-full bg-accent text-white py-4 rounded-xl font-bold disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-3xl font-display font-bold text-primary">Key Features Needed?</h2>
            <p className="text-secondary mt-2">List the main functionalities (comma separated).</p>
            <div className="mt-6">
              <textarea
                placeholder="e.g. User login, Stripe payments, AI text generation, admin panel..."
                className="w-full bg-surface border border-line rounded-xl px-4 py-4 text-primary focus:outline-none focus:border-accent transition-colors h-32 resize-none"
                value={formData.features}
                onChange={(e) => updateForm('features', e.target.value)}
                autoFocus
              />
              <button 
                onClick={nextStep}
                disabled={!formData.features}
                className="mt-6 w-full bg-accent text-white py-4 rounded-xl font-bold disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        );
      case 5:
        return (
          <div>
            <h2 className="text-3xl font-display font-bold text-primary">Expected Timeline?</h2>
            <p className="text-secondary mt-2">How fast do you need this launched?</p>
            {renderSelectionCards('timeline', [
              'ASAP (Rush)', '2-4 Weeks', '1-2 Months', '3+ Months', 'Flexible'
            ], <Clock size={20} />)}
          </div>
        );
      case 6:
        return (
          <div>
            <h2 className="text-3xl font-display font-bold text-primary">Estimated Budget?</h2>
            <p className="text-secondary mt-2">This helps us recommend the right architecture tier.</p>
            {renderSelectionCards('budget', [
              'Under ₹10,000', '₹10,000 - ₹25,000', '₹25,000 - ₹50,000', '₹50,000+'
            ], <IndianRupee size={20} />)}
          </div>
        );
      case 7:
        return (
          <div>
            <h2 className="text-3xl font-display font-bold text-primary">Anything else?</h2>
            <p className="text-secondary mt-2">Any design preferences, specific integrations, or context?</p>
            <div className="mt-6">
              <textarea
                placeholder="Optional extra details..."
                className="w-full bg-surface border border-line rounded-xl px-4 py-4 text-primary focus:outline-none focus:border-accent transition-colors h-32 resize-none"
                value={formData.additionalInfo}
                onChange={(e) => updateForm('additionalInfo', e.target.value)}
                autoFocus
              />
              <button 
                onClick={nextStep}
                className="mt-6 w-full bg-accent text-white py-4 rounded-xl font-bold"
              >
                Continue
              </button>
            </div>
          </div>
        );
      case 8:
        return (
          <form onSubmit={submitGenerator} className="bg-surface/50 border border-accent/20 p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Lock size={100} />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-display font-bold text-primary mb-2 flex items-center gap-3">
                <Sparkles className="text-accent" /> Your Blueprint is Ready
              </h2>
              <p className="text-secondary mb-8">Enter your details to unlock the AI-generated architecture and roadmap.</p>
              
              <div className="space-y-4">
                <input
                  required
                  type="text"
                  placeholder="Full Name"
                  className="w-full bg-background border border-line rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-accent"
                  value={formData.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                />
                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-background border border-line rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-accent"
                  value={formData.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                />
                <input
                  required
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full bg-background border border-line rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-accent"
                  value={formData.phone}
                  onChange={(e) => updateForm('phone', e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent hover:bg-accent/90 text-white py-4 rounded-xl font-bold mt-4 flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Lock size={18} />}
                  {loading ? 'Generating Blueprint...' : 'Unlock My Blueprint'}
                </button>
                <p className="text-xs text-center text-tertiary mt-4">We respect your privacy. No spam.</p>
              </div>
            </div>
          </form>
        );
      default:
        return null;
    }
  };

  const renderBlueprint = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-500 mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h1 className="text-4xl font-display font-bold text-primary">Your Project Blueprint</h1>
        <p className="text-secondary mt-2">Generated successfully for {formData.name}</p>
      </div>

      <div className="bg-surface border border-line rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 space-y-10">
          
          <section>
            <h3 className="text-xs font-bold tracking-widest text-accent uppercase mb-3">01. Executive Summary</h3>
            <p className="text-lg text-primary leading-relaxed">{blueprint.projectSummary}</p>
          </section>

          <section>
            <h3 className="text-xs font-bold tracking-widest text-accent uppercase mb-3">02. Recommended Architecture</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {blueprint.suggestedArchitecture?.map((tech, i) => (
                <div key={i} className="bg-background rounded-xl p-4 border border-line flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full bg-surface/50 border border-line shadow-inner flex items-center justify-center mb-3">
                    {getTechIcon(tech.name)}
                  </div>
                  <p className="text-[10px] text-tertiary uppercase tracking-widest font-bold">{tech.category}</p>
                  <p className="font-bold text-primary mt-1 text-sm">{tech.name}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            <section>
              <h3 className="text-xs font-bold tracking-widest text-accent uppercase mb-3">03. Core Features</h3>
              <div className="bg-background rounded-xl p-6 border border-line h-full">
                <ul className="space-y-3">
                  {blueprint.recommendedFeatures?.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-accent shrink-0 mt-0.5" />
                      <span className="text-sm text-secondary">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold tracking-widest text-accent uppercase mb-3">04. Development Roadmap</h3>
              <div className="bg-background rounded-xl p-6 border border-line h-full">
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-line before:to-transparent">
                  {blueprint.developmentRoadmap?.map((phase, i) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-accent bg-background z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border border-line bg-surface/50">
                        <p className="font-bold text-primary text-sm mb-1">{phase.title}</p>
                        <p className="text-xs text-secondary">{phase.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface/50 border border-line rounded-xl p-4 text-center">
              <p className="text-tertiary text-xs uppercase tracking-wider mb-1">Estimated Complexity</p>
              <p className="text-primary font-bold">{blueprint.estimatedComplexity}</p>
            </div>
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 text-center">
              <p className="text-accent text-xs uppercase tracking-wider mb-1">Recommended Plan</p>
              <p className="text-primary font-bold">{blueprint.suggestedForgeLabsPlan}</p>
            </div>
          </div>

          <section>
            <h3 className="text-xs font-bold tracking-widest text-accent uppercase mb-3">Why This Approach?</h3>
            <p className="text-secondary leading-relaxed italic border-l-2 border-accent pl-4">{blueprint.whyThisPlan}</p>
          </section>

          <div className="pt-8 border-t border-line text-center">
            <h3 className="text-2xl font-display font-bold text-primary mb-2">Ready to build this?</h3>
            <p className="text-secondary mb-6">Bring this blueprint to life with ForgeLabs' elite engineering team.</p>
            <button onClick={() => window.location.href = '/contact'} className="bg-primary text-background hover:opacity-90 px-8 py-4 rounded-full font-bold text-lg inline-flex items-center gap-2 transition-all">
              Discuss Project <ArrowRight size={20} />
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-[#9b6cf3]/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-3xl mx-auto">
        {!blueprint && currentStep > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between text-sm font-medium text-tertiary mb-4">
              <button onClick={prevStep} className="hover:text-primary flex items-center gap-1 transition-colors">
                <ArrowLeft size={16} /> Back
              </button>
              <span>Step {currentStep} of {STEPS.length - 1}</span>
            </div>
            <div className="h-2 bg-line rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-accent"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl animate-pulse" />
              <div className="w-20 h-20 bg-surface border border-accent/30 rounded-full flex items-center justify-center relative z-10">
                <Loader2 size={32} className="text-accent animate-spin" />
              </div>
            </div>
            <h2 className="text-2xl font-display font-bold text-primary mb-2">Architecting your solution...</h2>
            <p className="text-secondary">Our AI is analyzing requirements and generating a premium blueprint.</p>
          </div>
        ) : blueprint ? (
          renderBlueprint()
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
