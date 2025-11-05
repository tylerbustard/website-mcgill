// Animation configuration system for consistent timing across the application
export interface AnimationConfig {
  section: {
    threshold: number;
    delay: number;
    rootMargin: string;
  };
  header: {
    threshold: number;
    delay: number;
    rootMargin: string;
  };
  staggered: {
    threshold: number;
    delay: number;
    staggerDelay: number;
    rootMargin: string;
  };
}

// Optimized animation timings for different device types
export const getAnimationConfig = (): AnimationConfig => {
  const isMobile = window.innerWidth <= 640;
  const isTablet = window.innerWidth <= 1024 && window.innerWidth > 640;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return {
      section: { threshold: 0.1, delay: 0, rootMargin: '0px' },
      header: { threshold: 0.1, delay: 0, rootMargin: '0px' },
      staggered: { threshold: 0.1, delay: 0, staggerDelay: 0, rootMargin: '0px' }
    };
  }

  if (isMobile) {
    return {
      section: { threshold: 0.1, delay: 0, rootMargin: '0px 0px -5% 0px' },
      header: { threshold: 0.15, delay: 50, rootMargin: '0px 0px -5% 0px' },
      staggered: { threshold: 0.08, delay: 100, staggerDelay: 60, rootMargin: '0px 0px -3% 0px' }
    };
  }

  if (isTablet) {
    return {
      section: { threshold: 0.12, delay: 0, rootMargin: '0px 0px -8% 0px' },
      header: { threshold: 0.2, delay: 80, rootMargin: '0px 0px -8% 0px' },
      staggered: { threshold: 0.1, delay: 150, staggerDelay: 70, rootMargin: '0px 0px -5% 0px' }
    };
  }

  // Desktop
  return {
    section: { threshold: 0.15, delay: 0, rootMargin: '0px 0px -10% 0px' },
    header: { threshold: 0.25, delay: 100, rootMargin: '0px 0px -10% 0px' },
    staggered: { threshold: 0.12, delay: 200, staggerDelay: 80, rootMargin: '0px 0px -8% 0px' }
  };
};

// Hook for consistent animation configuration
export const useAnimationConfig = () => {
  return getAnimationConfig();
};