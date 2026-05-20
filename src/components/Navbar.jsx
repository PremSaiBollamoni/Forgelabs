import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import NavHeader from './ui/nav-header';
import { GetStartedButton } from './ui/get-started-button';
import { ThemeToggle } from './ui/curtain-theme-toggle';
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    api.get('/settings').then(res => setSettings(res.data[0])).catch(err => console.error(err));
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent',
        scrolled ? 'bg-background/80 backdrop-blur-md border-line py-4' : 'bg-transparent py-6'
      )}
    >
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between relative">
        <Link to="/" className="font-display font-bold text-2xl tracking-tighter text-primary z-50">
          {settings?.siteName.split('s')[0] || 'Forge'}<span className="text-tertiary">Labs</span>
        </Link>

        {/* Desktop Nav - Centered */}
        <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <NavHeader links={navLinks} />
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center gap-6">
          <ThemeToggle className="p-2 text-tertiary hover:text-primary transition-colors rounded-full" />
          <GetStartedButton asChild text="Build With Us" size="sm">
            <Link to="/contact" />
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

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-background z-40 flex flex-col items-center justify-center gap-8"
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
            <GetStartedButton asChild text="Build With Us" className="mt-4 w-full max-w-[200px]" variant="default">
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} />
            </GetStartedButton>
          </motion.div>
        )}
      </div>
    </header>
  );
}
