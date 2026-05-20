import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { ParticleTextEffect } from '../components/ui/particle-text-effect';

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-24 px-6"
    >
      <div className="container mx-auto max-w-4xl">
        <ParticleTextEffect 
          words={["FORGE", "LABS", "STUDIO", "CRAFT", "ENGINEERING"]} 
          className="mb-8"
        />
        
        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-2xl text-primary leading-relaxed font-light mb-12">
            ForgeLabs is a premium digital execution studio led by Prem Sai Bollamoni. 
            We bridge the gap between advanced AI research and practical industrial applications.
          </p>
          
          <div className="w-full h-px bg-zinc-800 my-16"></div>
          
          <h2 className="text-3xl font-display font-bold text-primary mb-6">The Founder</h2>
          <p className="text-secondary mb-8">
            I am a Final-year Computer Science Engineering student (9.3 CGPA) and Agentic AI Developer specializing in building autonomous workflows and intelligent systems. I leverage tools like Gemini API, React.js, and Flutter to create scalable automation. Having earned a Runner-Up spot at the IEEE Rapid Innovation Challenge and seven consecutive "Best Project" awards, my focus is strictly on high-performance execution.
          </p>

          <h2 className="text-3xl font-display font-bold text-primary mb-6 mt-12">Our Philosophy</h2>
          <p className="text-secondary mb-8">
            We believe in high-trust, low-friction execution. When you work with ForgeLabs, you're partnering directly with a dedicated builder who treats your product as their own. We don't do "placeholder" work. Every pixel is intentional, and every line of code is production-ready.
          </p>
          
          <div className="mt-16 p-8 bg-surface border border-line rounded-lg flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-primary mb-2">Ready to build?</h3>
              <p className="text-secondary m-0">Let's discuss your project and see if we're a good fit.</p>
            </div>
            <Link to="/contact" className="px-6 py-3 bg-[#2D5BFF] text-white border-transparent hover:bg-opacity-90 font-bold rounded hover:scale-105 transition-transform flex items-center gap-2 whitespace-nowrap">
              Contact Us <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
