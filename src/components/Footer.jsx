import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  MapPin,
  Send
} from "lucide-react";
import { SocialButton } from "../base/buttons/social-button";
import api from '../api/axios';

export default function Footer() {
  const [showToast, setShowToast] = useState(false);
  const [settings, setSettings] = useState(null);
  const [footerButtons, setFooterButtons] = useState([]);
  const [socialButtons, setSocialButtons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, footerRes, socialRes] = await Promise.all([
          api.get('/settings'),
          api.get('/ui-buttons?group=FOOTER'),
          api.get('/ui-buttons?group=FOOTER_SOCIAL')
        ]);
        setSettings(settingsRes.data);
        setFooterButtons(footerRes.data);
        setSocialButtons(socialRes.data);
      } catch (err) {
        // Error handled by UI state
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleShare = async (e) => {
    e.preventDefault();
    const shareData = {
      title: settings?.siteName || "ForgeLabs Studio",
      text: settings?.footerTagline || "Premium Digital Execution Studio",
      url: window.location.origin,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (err) {
      // Sharing error silently handled
    }
  };

  if (loading) return null;

  return (
    <>
      <footer className="bg-surface relative w-full overflow-hidden border-t border-line z-10 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* TOP: 4 Clean Aligned Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-32">

            {/* Column 1: Brand */}
            <div className="flex flex-col space-y-8">
              <Link to="/" className="font-display font-bold text-3xl tracking-tighter text-primary">
                {settings?.siteName || "ForgeLabs"}
              </Link>
              <p className="font-sans text-sm text-secondary leading-relaxed max-w-[260px]">
                {settings?.footerAboutText || "Premium digital execution studio. We build exceptional web products for startups, founders, and small businesses."}
              </p>
            </div>

            {/* Dynamic Columns: Services & Company */}
            {["SERVICES", "COMPANY"].map((group) => (
              <div key={group} className="flex flex-col">
                <h4 className="text-primary font-display text-lg font-bold mb-8">
                  {group === "SERVICES" ? "Services" : "Company"}
                </h4>
                <ul className="space-y-5 font-sans text-sm">
                  {footerButtons
                    .filter(btn => btn.pageKey === group)
                    .map((btn) => (
                      <li key={btn.id}>
                        <Link
                          to={btn.route?.routePath || "/"}
                          className="text-secondary hover:text-primary transition-colors"
                        >
                          {btn.buttonLabel}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}

            {/* Column 4: Contact */}
            <div className="flex flex-col">
              <h4 className="text-primary font-display text-lg font-bold mb-8">
                Contact
              </h4>
              <ul className="space-y-5 font-sans text-sm">
                <li className="flex items-center space-x-4 text-secondary group">
                  <div className="w-10 h-10 rounded-full bg-background border border-line flex items-center justify-center shrink-0 group-hover:border-primary transition-colors">
                    <Mail size={16} className="text-secondary" />
                  </div>
                  <a href={`mailto:${settings?.contactEmail}`} className="hover:text-primary transition-colors">
                    {settings?.contactEmail}
                  </a>
                </li>
                <li className="flex items-center space-x-4 text-secondary group">
                  <div className="w-10 h-10 rounded-full bg-background border border-line flex items-center justify-center shrink-0 group-hover:border-primary transition-colors">
                    <MapPin size={16} className="text-secondary" />
                  </div>
                  <span>{settings?.officeAddress || settings?.location}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-t border-line mb-10" />

          {/* BOTTOM: Single Balanced Row */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">

            {/* Left: Social Icons */}
            <div className="flex items-center space-x-3">
              {socialButtons.map((btn) => {
                const label = btn.buttonLabel.toLowerCase();
                const path = btn.route?.routePath || "#";
                
                const socialPlatform = label.includes('github') ? 'github' :
                                     label.includes('linkedin') ? 'linkedin' :
                                     label.includes('whatsapp') ? 'whatsapp' :
                                     label.includes('facebook') ? 'facebook' :
                                     label.includes('twitter') ? 'twitter' : 
                                     null;

                if (socialPlatform) {
                  return (
                    <SocialButton
                      key={btn.id}
                      social={socialPlatform}
                      href={path}
                      target="_blank"
                      rel="noopener noreferrer"
                      theme="brand"
                      size="md"
                      aria-label={btn.buttonLabel}
                      className="shadow-sm"
                    />
                  );
                }

                return (
                  <a
                    key={btn.id}
                    href={path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-background border border-line flex items-center justify-center text-secondary hover:text-primary hover:border-primary transition-all shadow-sm"
                    aria-label={btn.buttonLabel}
                  >
                    {label.includes('email') ? <Mail size={16} /> : <Send size={16} />}
                  </a>
                );
              })}

              <button
                onClick={handleShare}
                aria-label="Share"
                className="group relative inline-flex items-center justify-center p-2.5 rounded-lg bg-background text-secondary border border-line hover:border-primary hover:text-primary transition-all duration-200 shadow-sm"
              >
                <Send size={16} />
              </button>
            </div>

            {/* Center: Copyright */}
            <p className="text-sm text-secondary font-medium">
              {settings?.copyrightText || `© ${new Date().getFullYear()} ${settings?.siteName || 'ForgeLabs'}. All rights reserved.`}
            </p>

            {/* Right: Tagline */}
            <div className="text-xs font-bold tracking-widest text-tertiary uppercase">
              Built with Precision
            </div>
          </div>
        </div>
      </footer>

      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-surface border border-line text-primary px-4 py-3 rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.08)] text-sm font-medium z-[100] animate-in fade-in slide-in-from-bottom-5">
          Website link copied
        </div>
      )}
    </>
  );
}
