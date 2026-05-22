import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import NavHeader from './ui/nav-header';
import { GetStartedButton } from './ui/get-started-button';
import { ThemeToggle } from './ui/curtain-theme-toggle';
import { UpgradeBanner } from './ui/upgrade-banner';
import api from '../api/axios';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Studio', path: '/about' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState(null);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    api.get('/settings').then(res => setSettings(res.data[0])).catch(() => {});
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Global Offer Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div 
            initial={{ y: -40 }}
            animate={{ y: 0 }}
            exit={{ y: -40, opacity: 0 }}
            className="absolute top-0 left-0 right-0 z-[60]"
          >
            <UpgradeBanner 
              buttonText="Launch Offer: ₹1999 for first 20 projects" 
              description="| Free Student Portfolios" 
              onClose={() => setShowBanner(false)}
              onClick={() => window.location.href = '/contact'}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <header
        className={clsx(
          'fixed left-0 right-0 z-50 transition-all duration-300',
          (!scrolled && showBanner) ? 'top-16' : 'top-0',
          scrolled ? 'bg-background/80 backdrop-blur-md border-b border-line py-4' : 'bg-transparent py-6 border-b border-transparent'
        )}
      >
        <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between relative">
        <Link to="/" className="font-display font-bold text-2xl tracking-tighter text-primary z-50">
          {settings?.siteName?.split('s')[0] || 'Forge'}<span className="text-tertiary">Labs</span>
        </Link>

        {/* Desktop Nav - Centered */}
        <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <NavHeader links={navLinks} />
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center gap-6">
          <ThemeToggle className="p-2 text-tertiary hover:text-primary transition-colors rounded-full" />
          <GetStartedButton asChild text="Get Your Free Blueprint" size="sm">
            <Link to="/blueprint" />
          </GetStartedButton>
        </div>

        <div className="flex items-center gap-4 md:hidden z-50">
          <ThemeToggle className="p-2 text-tertiary hover:text-primary transition-colors" />
          {/* Mobile Menu Toggle */}
          <button
            className="text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>
    </header>

    {/* Mobile Nav - Moved outside header to avoid backdrop-blur containing block bug */}
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 bg-background z-[45] flex flex-col items-center justify-center gap-8"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-display font-medium text-primary hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
          <GetStartedButton asChild text="Get Your Free Blueprint" className="mt-4 w-full max-w-[250px]" variant="default">
            <Link to="/blueprint" onClick={() => setMobileMenuOpen(false)} />
          </GetStartedButton>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
