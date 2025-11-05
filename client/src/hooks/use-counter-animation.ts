import { useState, useEffect, useRef } from 'react';

interface UseCounterAnimationProps {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
}

export function useCounterAnimation({ 
  end, 
  start = 0, 
  duration = 2000, 
  delay = 0 
}: UseCounterAnimationProps) {
  const [count, setCount] = useState(start);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasStarted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          
          const startTime = Date.now() + delay;
          const animateCount = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            
            if (elapsed < 0) {
              requestAnimationFrame(animateCount);
              return;
            }
            
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (end - start) * easeOut);
            
            setCount(current);
            
            if (progress < 1) {
              requestAnimationFrame(animateCount);
            }
          };
          
          requestAnimationFrame(animateCount);
        }
      },
      {
        threshold: 0.3, // Start animation when 30% of element is visible
        rootMargin: '0px 0px -100px 0px' // Start slightly before element is fully visible
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [end, start, duration, delay, hasStarted]);

  return { count, elementRef };
}