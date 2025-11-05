import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
  reducedMotion?: boolean;
}

// Enhanced scroll animation hook with better performance and accessibility
export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [scrollVelocity, setScrollVelocity] = useState<'slow' | 'fast'>('slow');
  const ref = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && !options.reducedMotion) {
      setIsVisible(true);
      return;
    }

    // Enhanced scroll direction and velocity tracking
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const deltaY = Math.abs(currentScrollY - lastScrollY.current);
      const deltaTime = currentTime - lastScrollTime.current;
      
      let velocity = 0;
      if (deltaTime > 0) {
        velocity = deltaY / deltaTime;
        setScrollVelocity(velocity > 1 ? 'fast' : 'slow');
      }
      
      setScrollDirection(currentScrollY > lastScrollY.current ? 'down' : 'up');
      lastScrollY.current = currentScrollY;
      lastScrollTime.current = currentTime;
      
      // Apply scroll velocity class to body for dynamic animations
      document.body.classList.toggle('scroll-fast', velocity > 1);
      document.body.classList.toggle('scroll-slow', velocity <= 1);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!options.triggerOnce || !hasTriggered.current)) {
          const baseDelay = options.delay || 0;
          // Get current scroll velocity for adaptive timing
          const currentVelocity = document.body.classList.contains('scroll-fast') ? 'fast' : 'slow';
          const adaptiveDelay = currentVelocity === 'fast' ? Math.max(baseDelay * 0.4, 100) : baseDelay;
          
          // Clear any existing timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          
          timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
            hasTriggered.current = true;
          }, adaptiveDelay);
          
          if (options.triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!options.triggerOnce && !entry.isIntersecting) {
          // Clear timeout if element goes out of view
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          setIsVisible(false);
          hasTriggered.current = false;
        }
      },
      {
        threshold: options.threshold || 0.15,
        rootMargin: options.rootMargin || '0px 0px -8% 0px',
      }
    );

    window.addEventListener('scroll', handleScroll, { passive: true });
    observer.observe(element);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.unobserve(element);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [options.threshold, options.rootMargin, options.triggerOnce, options.delay, options.reducedMotion]);

  return { ref, isVisible, scrollDirection, scrollVelocity };
}

export function useStaggeredScrollAnimation(
  itemCount: number,
  options: UseScrollAnimationOptions = {}
) {
  const [visibleItems, setVisibleItems] = useState(new Set<number>());
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [scrollVelocity, setScrollVelocity] = useState<'slow' | 'fast'>('slow');
  const ref = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && !options.reducedMotion) {
      // Show all items immediately if reduced motion is preferred
      setVisibleItems(new Set(Array.from({ length: itemCount }, (_, i) => i)));
      return;
    }

    // Enhanced scroll tracking
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const deltaY = Math.abs(currentScrollY - lastScrollY.current);
      const deltaTime = currentTime - lastScrollTime.current;
      
      if (deltaTime > 0) {
        const velocity = deltaY / deltaTime;
        setScrollVelocity(velocity > 1 ? 'fast' : 'slow');
      }
      
      setScrollDirection(currentScrollY > lastScrollY.current ? 'down' : 'up');
      lastScrollY.current = currentScrollY;
      lastScrollTime.current = currentTime;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!options.triggerOnce || !hasTriggered.current)) {
          const baseDelay = options.delay || 0;
          // Get current scroll velocity from body classes
          const currentVelocity = document.body.classList.contains('scroll-fast') ? 'fast' : 'slow';
          const staggerDelay = currentVelocity === 'fast' ? 40 : 80;
          const adaptiveBaseDelay = currentVelocity === 'fast' ? Math.max(baseDelay * 0.4, 100) : baseDelay;
          
          // Clear any existing timeouts
          timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
          timeoutsRef.current = [];
          
          // Trigger staggered animation
          for (let i = 0; i < itemCount; i++) {
            const timeout = setTimeout(() => {
              setVisibleItems(prev => new Set([...Array.from(prev), i]));
            }, adaptiveBaseDelay + (i * staggerDelay));
            timeoutsRef.current.push(timeout);
          }
          
          hasTriggered.current = true;
          
          if (options.triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!options.triggerOnce && !entry.isIntersecting) {
          // Clear timeouts when element goes out of view
          timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
          timeoutsRef.current = [];
          setVisibleItems(new Set());
          hasTriggered.current = false;
        }
      },
      {
        threshold: options.threshold || 0.12,
        rootMargin: options.rootMargin || '0px 0px -8% 0px',
      }
    );

    window.addEventListener('scroll', handleScroll, { passive: true });
    observer.observe(element);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.unobserve(element);
      // Clear all timeouts on cleanup
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, [itemCount, options.threshold, options.rootMargin, options.triggerOnce, options.delay, options.reducedMotion]);

  return { ref, visibleItems, scrollDirection, scrollVelocity };
}

// Hook for initial page load animations
export function useInitialPageAnimation(delay: number = 0) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return isLoaded;
}