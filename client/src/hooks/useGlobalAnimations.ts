import { useEffect } from 'react';

// Global animation coordinator to ensure smooth animations across the entire site
export const useGlobalAnimations = () => {
  useEffect(() => {
    // Set up global animation classes on body
    document.body.classList.add('animations-ready');
    
    // Optimize performance for animations with enhanced GPU acceleration
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      /* Ensure all animations use GPU acceleration */
      .scroll-fade-in,
      .scroll-slide-up,
      .scroll-scale-in,
      .page-load-fade-in {
        transform: translateZ(0);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        /* Removed will-change to reduce performance overhead */
      }
      
      /* Smooth entry animations for all sections */
      section {
        transition: opacity 0.3s ease-out;
      }
      
      /* Optimize backdrop filters for performance with consistent values */
      @media (max-width: 768px) {
        .backdrop-blur-xl, .backdrop-blur-lg {
          backdrop-filter: blur(10px) !important;
          -webkit-backdrop-filter: blur(10px) !important;
        }
        .backdrop-blur-md {
          backdrop-filter: blur(8px) !important;
          -webkit-backdrop-filter: blur(8px) !important;
        }
      }
      
      /* Reduce effects on low-power devices */
      @media (prefers-reduced-motion: reduce) {
        .backdrop-blur-xl, .backdrop-blur-lg, .backdrop-blur-md {
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          background: rgba(255, 255, 255, 0.95) !important;
        }
        
        .scroll-fade-in,
        .scroll-slide-up,
        .scroll-scale-in,
        .page-load-fade-in {
          transition-duration: 0.3s !important;
        }
      }
      
      /* Prevent animation flickers with enhanced stability */
      .scroll-fade-in,
      .scroll-slide-up,
      .scroll-scale-in,
      .page-load-fade-in {
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        -webkit-perspective: 1000;
        perspective: 1000;
        transform-style: preserve-3d;
      }
      
      /* Smooth scrolling handled by JavaScript */
      html {
        /* Removed scroll-behavior: smooth to prevent conflicts */
        scroll-padding-top: 100px;
      }
      
      /* Progressive enhancement for animations with consistent timing */
      @media (prefers-reduced-motion: no-preference) {
        .animations-ready .scroll-fade-in,
        .animations-ready .scroll-slide-up,
        .animations-ready .scroll-scale-in {
          transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        /* Smooth transition for visibility changes */
        .animations-ready .visible {
          transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }
      }
      
      /* Consistent glass morphism effect across all components */
      .glass-effect {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }
      
      .glass-effect:hover {
        background: rgba(255, 255, 255, 0.95);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      }
      
      /* Ensure smooth transitions between sections */
      .transition-smooth {
        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      }
      
      /* Consistent shadow system */
      .shadow-smooth {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        transition: box-shadow 0.3s ease;
      }
      
      .shadow-smooth:hover {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      }
    `;
    
    document.head.appendChild(styleSheet);
    
    // Initialize intersection observer for better performance
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -5% 0px',
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1]
    };
    
    // Enhanced animation initialization
    const initializeAnimations = () => {
      const animationElements = document.querySelectorAll('.scroll-fade-in, .scroll-slide-up, .scroll-scale-in');
      animationElements.forEach(el => {
        el.classList.add('animation-ready');
        // Add data attribute for enhanced control
        el.setAttribute('data-animation-state', 'ready');
      });
      
      // Initialize page load animations
      const pageLoadElements = document.querySelectorAll('.page-load-fade-in');
      pageLoadElements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('loaded');
        }, index * 100); // Staggered loading effect
      });
    };
    
    // Run initialization after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeAnimations);
    } else {
      initializeAnimations();
    }
    
    // Add smooth scroll velocity detection
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      document.body.classList.add('is-scrolling');
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        document.body.classList.remove('is-scrolling');
      }, 150);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      document.head.removeChild(styleSheet);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);
};