import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { GetStartedButton } from "./get-started-button";
import clsx from "clsx";

export function PricingBlocks({ tiers, compact = false }) {
  // Rotations for the 3 cards to match the "Creative" styling
  const rotations = [-4, 0, 4];

  return (
    <section className="relative flex flex-col items-center py-12 w-full">
      <div className="flex w-full flex-col items-center justify-center gap-8 md:flex-row">
        {tiers.map((tier, i) => {
          // Highlight if explicitly marked, OR if it's the middle one in a 3-tier set
          const isFeatured = tier.featured || (tiers.length === 3 && i === 1);
          const rotation = rotations[i] || 0;

          return (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: isFeatured ? 60 : 40, rotate: rotation }}
              animate={{ opacity: 1, y: isFeatured ? -20 : 0, rotate: rotation }}
              transition={{ type: "spring", duration: isFeatured ? 0.7 : 0.5, delay: i * 0.1 }}
              className={clsx(
                "relative text-left px-8 flex flex-col transition-all duration-300 w-80",
                isFeatured
                  ? "z-20 py-12 rounded-3xl border-2 border-accent bg-surface shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all"
                  : "z-10 py-8 rounded-2xl border border-line bg-background shadow-sm hover:-translate-y-1"
              )}
            >
              {isFeatured && (
                <motion.div
                  animate={{ y: [10, 6, 10] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full border border-accent/20 bg-accent px-5 py-1 text-xs font-extrabold text-white shadow-md uppercase tracking-widest"
                >
                  Most Popular
                </motion.div>
              )}
              
              <div className="text-xs font-bold text-tertiary tracking-wider mb-2 mt-4 md:mt-0">{tier.prefix}</div>
              <div className="mb-2 text-xl font-display font-bold text-primary">{tier.name}</div>
              <div className="mb-4 text-4xl font-display font-bold text-primary">
                {tier.currency === 'USD' ? '$' : '₹'}{tier.price}
              </div>
              <p className="text-sm text-secondary mb-8">{tier.description}</p>
              
              <ul className="mb-6 space-y-3 border-t border-line/40 pt-6">
                {(compact ? tier.features.slice(0, 5) : tier.features).map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm text-primary">
                    <Check className="mr-3 text-accent shrink-0" size={16} />
                    <span className="line-clamp-1">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {compact && tier.features.length > 5 && (
                <Link to="/pricing" className="text-[10px] text-accent uppercase font-bold tracking-widest hover:underline mb-4 inline-block">
                  + {tier.features.length - 5} More Features
                </Link>
              )}
              
              <div className="flex-grow" />

              <GetStartedButton asChild text="Build With Us" variant={isFeatured ? "default" : "outline"} className="w-full mt-4">
                <Link to="/contact" />
              </GetStartedButton>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
