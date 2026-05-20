import { motion } from 'framer-motion';
import { ParticleTextEffect } from '../components/ui/particle-text-effect';
import { GetStartedButton } from '../components/ui/get-started-button';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-24 px-6 min-h-screen flex flex-col items-center justify-center relative"
    >
      <div className="container mx-auto max-w-4xl text-center z-10">
        <ParticleTextEffect 
          words={["404", "PAGE", "NOT", "FOUND"]} 
          className="mb-8"
        />
        
        <div className="mt-8">
          <GetStartedButton asChild text="Return Home">
            <Link to="/" />
          </GetStartedButton>
        </div>
      </div>
    </motion.div>
  );
}
