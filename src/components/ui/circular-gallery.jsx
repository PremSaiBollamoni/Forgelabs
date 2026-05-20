import { useEffect, useRef, useState, useMemo } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getDirectImageUrl } from "../../lib/utils";

function calculateGap(width) {
  const minWidth = 1024;
  const maxWidth = 1456;
  const minGap = 80;
  const maxGap = 120;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth)
    return Math.max(minGap, maxGap + 0.08 * (width - maxWidth));
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

export const CircularGallery = ({
  items = [],
  autoplay = true,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);

  const imageContainerRef = useRef(null);
  const autoplayIntervalRef = useRef(null);

  const itemsLength = useMemo(() => (items?.length || 0), [items]);
  const activeItem = useMemo(
    () => items?.[activeIndex] || null,
    [activeIndex, items]
  );

  useEffect(() => {
    function handleResize() {
      if (imageContainerRef.current) {
        setContainerWidth(imageContainerRef.current.offsetWidth);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (autoplay && itemsLength > 0) {
      autoplayIntervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % itemsLength);
      }, 5000);
    }
    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
    };
  }, [autoplay, itemsLength]);

  const handleNext = () => {
    if (itemsLength === 0) return;
    setActiveIndex((prev) => (prev + 1) % itemsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  };
  
  const handlePrev = () => {
    if (itemsLength === 0) return;
    setActiveIndex((prev) => (prev - 1 + itemsLength) % itemsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  };

  if (itemsLength === 0) return null;

  function getImageStyle(index) {
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.8; // Match stick-up from testimonials
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + itemsLength) % itemsLength === index;
    const isRight = (activeIndex + 1) % itemsLength === index;
    
    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        transform: `translateX(0px) translateY(0px) scale(1) rotateY(0deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 1,
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isRight) {
      return {
        zIndex: 2,
        opacity: 1,
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    return {
      zIndex: 1,
      opacity: 0,
      transform: `translateX(0px) translateY(0px) scale(0.5) rotateY(0deg)`,
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    };
  }

  return (
    <div className="gallery-container w-full max-w-6xl mx-auto py-12">
      <div className="gallery-grid items-center">
        <div className="image-container" ref={imageContainerRef}>
          {items.map((item, index) => (
            <img
              key={item.src}
              src={getDirectImageUrl(item.src)}
              alt={item.title}
              className="gallery-image border-4 border-surface"
              style={getImageStyle(index)}
              referrerPolicy="no-referrer"
            />
          ))}
        </div>
        
        <div className="gallery-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-display font-bold text-primary mb-2 leading-tight">
                {activeItem.title}
              </h3>
              <p className="text-secondary leading-relaxed text-sm uppercase tracking-widest font-bold opacity-60">
                 Viewpoint {activeIndex + 1} / {itemsLength}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="arrow-buttons mt-8">
            <button
              onClick={handlePrev}
              className="arrow-button flex items-center justify-center border border-line bg-surface hover:bg-tertiary transition-colors"
              onMouseEnter={() => setHoverPrev(true)}
              onMouseLeave={() => setHoverPrev(false)}
              aria-label="Previous image"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="arrow-button flex items-center justify-center border border-line bg-surface hover:bg-tertiary transition-colors"
              onMouseEnter={() => setHoverNext(true)}
              onMouseLeave={() => setHoverNext(false)}
              aria-label="Next image"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .gallery-container {
          width: 100%;
        }
        .gallery-grid {
          display: grid;
          gap: 6rem;
        }
        .image-container {
          position: relative;
          width: 100%;
          height: 20rem;
          perspective: 1000px;
        }
        .gallery-image {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 1.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }
        .gallery-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-left: 2rem;
        }
        .arrow-buttons {
          display: flex;
          gap: 1rem;
        }
        .arrow-button {
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 50%;
          cursor: pointer;
        }
        @media (min-width: 1024px) {
          .gallery-grid {
            grid-template-columns: 1.1fr 0.9fr;
            gap: 10rem;
          }
          .image-container {
            height: 28rem;
          }
          .gallery-content {
            padding-left: 4rem;
          }
        }
      `}</style>
    </div>
  );
};
