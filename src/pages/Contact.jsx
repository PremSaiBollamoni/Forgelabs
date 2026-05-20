import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiquidButton } from '../components/ui/liquid-glass-button';
import { GLSLHills } from '../components/ui/glsl-hills';
import api from '../api/axios';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    projectType: 'Web Application / MVP',
    budgetRange: 'Growth (₹2999)',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    
    try {
      await api.post('/inquiries', {
        ...formData,
        sourcePage: window.location.pathname
      });
      setStatus('success');
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen pt-32 pb-24 px-6 overflow-hidden"
    >
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-100 dark:opacity-60 flex items-center justify-center">
        <div className="absolute top-0 w-full h-full bg-gradient-to-b from-background via-transparent to-background z-20 pointer-events-none"></div>
        <div className="relative z-10 w-[110%] h-[110%] transform -translate-y-8 md:-translate-y-12 blur-[1.5px] opacity-70">
          <GLSLHills cameraZ={120} speed={0.4} className="w-full h-full" />
        </div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">Let's Build.</h1>
            <p className="text-xl text-secondary mb-10">
              Tell us about your project, timeline, and goals. We aim to respond to all serious inquiries within 24 hours.
            </p>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-tertiary uppercase tracking-wider mb-2">Email</h4>
                <p className="text-lg text-primary">hello@forgelabs.studio</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-tertiary uppercase tracking-wider mb-2">Location</h4>
                <p className="text-lg text-primary">Remote / Worldwide Execution</p>
              </div>
            </div>
          </div>
          
          <div className="bg-surface/80 backdrop-blur-md border border-line p-8 md:p-10 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="text-green-500" size={40} />
                  </div>
                  <h3 className="text-3xl font-display font-bold mb-4">Inquiry Sent!</h3>
                  <p className="text-secondary mb-8">We've received your request and will get back to you shortly.</p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="text-accent font-medium hover:underline"
                  >
                    Send another inquiry
                  </button>
                </motion.div>
              ) : (
                <motion.form 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6" 
                  onSubmit={handleSubmit}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="fullName" className="text-sm font-medium text-primary">Name</label>
                      <input 
                        required 
                        type="text" 
                        id="fullName" 
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full bg-background border border-line rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-accent transition-colors" 
                        placeholder="John Doe" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-primary">Email</label>
                      <input 
                        required 
                        type="email" 
                        id="email" 
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-background border border-line rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-accent transition-colors" 
                        placeholder="john@company.com" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="projectType" className="text-sm font-medium text-primary">Project Type</label>
                    <select 
                      id="projectType" 
                      value={formData.projectType}
                      onChange={handleChange}
                      className="w-full bg-background border border-line rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-accent transition-colors appearance-none"
                    >
                      <option>Landing Page / Website</option>
                      <option>Web Application / MVP</option>
                      <option>Mobile Application</option>
                      <option>AI Integration</option>
                      <option>Automation</option>
                      <option>Other</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="budgetRange" className="text-sm font-medium text-primary">Estimated Budget</label>
                    <select 
                      id="budgetRange" 
                      value={formData.budgetRange}
                      onChange={handleChange}
                      className="w-full bg-background border border-line rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-accent transition-colors appearance-none"
                    >
                      <option>Starter (₹999)</option>
                      <option>Growth (₹2999)</option>
                      <option>Premium (₹4999)</option>
                      <option>Custom (₹5k+)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-primary">Project Details</label>
                    <textarea 
                      required 
                      id="message" 
                      value={formData.message}
                      onChange={handleChange}
                      rows={5} 
                      className="w-full bg-background border border-line rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-accent transition-colors resize-none" 
                      placeholder="Tell us about what you want to build..."
                    ></textarea>
                  </div>
                  
                  {status === 'error' && (
                    <div className="flex items-center gap-2 text-red-500 text-sm p-4 bg-red-500/10 rounded-lg">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}

                  <LiquidButton 
                    type="submit" 
                    className="w-full"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? <Loader2 className="animate-spin mx-auto" /> : 'Submit Inquiry'}
                  </LiquidButton>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
