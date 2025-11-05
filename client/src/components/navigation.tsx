import { useState, useEffect, useMemo, useRef } from "react";
import { ChevronDown, Menu, X, ArrowLeft, Printer, Download } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import profileImage from "@assets/Untitled design (1)_1755896187722.png";
import { slugify } from "@/lib/utils";

export default function Navigation() {
  const [location] = useLocation();
  const isHomePage = location === '/';
  const isResumePage = location === '/resume';
  const isUploadPage = location === '/upload';
  const isSignInPage = location === '/sign-in';

  const getExperienceId = (company: string, title: string) => `#experience-${slugify(company)}-${slugify(title)}`;
  const getCertificationId = (name: string) => `#cert-${slugify(name)}`;
  const getCertificationCategoryId = (title: string) => `#certifications-${slugify(title)}`;
  const getCommunityId = (organization: string) => `#community-${slugify(organization)}`;
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSection, setCurrentSection] = useState(isHomePage ? 'hero' : '');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<string | null>(null);

  // Helper functions for dropdown hover behavior with improved stability
  const handleDropdownEnter = (dropdownName: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    dropdownRef.current = dropdownName;
    setOpenDropdown(dropdownName);
  };

  const handleDropdownLeave = () => {
    const timeout = setTimeout(() => {
      if (dropdownRef.current) {
        dropdownRef.current = null;
        setOpenDropdown(null);
      }
    }, 150); // Optimized delay for better UX
    setHoverTimeout(timeout);
  };

  // Enhanced function to handle dropdown content hover
  const handleDropdownContentEnter = (dropdownName: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    dropdownRef.current = dropdownName;
    setOpenDropdown(dropdownName);
  };

  // Enhanced function to handle dropdown content leave
  const handleDropdownContentLeave = () => {
    const timeout = setTimeout(() => {
      if (dropdownRef.current) {
        dropdownRef.current = null;
        setOpenDropdown(null);
      }
    }, 150); // Consistent delay
    setHoverTimeout(timeout);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (openDropdown) {
        const target = event.target as HTMLElement;
        if (!target.closest('.dropdown-container')) {
          setOpenDropdown(null);
        }
      }
    };
    
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (openDropdown) {
          setOpenDropdown(null);
        } else if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('touchend', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchend', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [openDropdown, hoverTimeout, isMobileMenuOpen]);

  useEffect(() => {
    let rafId: number | null = null;
    let lastScrollY = 0;
    
    const handleScroll = () => {
      if (rafId) return;
      
      rafId = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        // Only update if there's a significant change
        if (Math.abs(currentScrollY - lastScrollY) > 3) {
          setScrollY(currentScrollY);
          setIsScrolled(currentScrollY > 100);
          lastScrollY = currentScrollY;
        }
        rafId = null;
      });
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);


  useEffect(() => {
    if (!isHomePage && !isResumePage && !isUploadPage && !isSignInPage) {
      setCurrentSection('');
      return;
    }

    // Set initial section based on page
    setCurrentSection(isHomePage ? 'hero' : 'academic-highlights');

    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -65% 0px',
      threshold: [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1]
    };

    let visibleSections = new Map();

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSections.set(entry.target.id, entry.intersectionRatio);
        } else {
          visibleSections.delete(entry.target.id);
        }
      });

      // Find the section with the highest intersection ratio
      let maxRatio = 0;
      let activeSection = isHomePage ? 'hero' : 'academic-highlights';
      
      Array.from(visibleSections.entries()).forEach(([sectionId, ratio]) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          activeSection = sectionId;
        }
      });

      setCurrentSection(activeSection);
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Add a small delay to ensure sections are rendered before observing
    const setupObserver = () => {
      const sections = document.querySelectorAll('section[id]');
      sections.forEach((section) => observer.observe(section));
    };
    
    // Setup immediately and also after a short delay to catch any late-rendered sections
    setupObserver();
    const delayTimer = setTimeout(setupObserver, 100);

    return () => {
      clearTimeout(delayTimer);
      const sections = document.querySelectorAll('section[id]');
      sections.forEach((section) => observer.unobserve(section));
      visibleSections.clear();
    };
  }, [isHomePage, isResumePage, isUploadPage, isSignInPage]);

  const scrollToSection = (href: string) => {
    // Close dropdown immediately for better UX
    setOpenDropdown(null);
    
    // If on resume page, scroll to resume sections
    if (isResumePage) {
      const element = document.querySelector(href);
      if (element) {
        const navHeight = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navHeight;
        
        // Use requestAnimationFrame for smoother scrolling
        requestAnimationFrame(() => {
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        });
      }
      setIsMobileMenuOpen(false);
      return;
    }
    
    // If not on home page, navigate to home page first
    if (!isHomePage) {
      window.location.href = href;
      return;
    }
    
    const element = document.querySelector(href);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Navigation Bar with Clean Glass Effect */}
      <nav 
        className="fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ease-out will-change-transform"
        style={{
          transform: 'translateZ(0)',
          background: isScrolled 
            ? 'rgba(255, 255, 255, 0.88)' 
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: isScrolled 
            ? '1px solid rgba(0, 0, 0, 0.08)' 
            : '1px solid rgba(0, 0, 0, 0.04)',
          boxShadow: isScrolled 
            ? '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)' 
            : '0 2px 8px rgba(0, 0, 0, 0.02), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            
            {/* Left side - Logo/Name */}
            <div className="flex items-center">
              {isHomePage && (
                <button 
                  onClick={() => {
                    // Use a slight delay to prevent conflict with other animations
                    setTimeout(() => {
                      window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                      });
                    }, 50);
                  }}
                  className="flex items-center space-x-4 transition-transform duration-200 hover:scale-105 cursor-pointer"
                >
                  <img 
                    src={profileImage} 
                    alt="Tyler Bustard" 
                    className="w-9 h-9 rounded-xl object-cover ring-1 ring-black/10 shadow-sm"
                  />
                  <div className="relative">
                    <span className="text-lg tracking-tight apple-heading-nav text-gray-900 dark:text-white">
                      <span className="font-bold">Tyler</span>{' '}
                      <span className="font-normal">Bustard</span>
                    </span>
                  </div>
                </button>
              )}
              {isResumePage && (
                <button 
                  onClick={() => {
                    // Always go to home page, not back in history
                    window.location.href = '/';
                  }}
                  className="flex items-center space-x-4 transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <img 
                    src={profileImage} 
                    alt="Tyler Bustard" 
                    className="w-9 h-9 rounded-xl object-cover ring-1 ring-black/10 shadow-sm"
                  />
                  <div className="relative">
                    <span className="text-lg tracking-tight apple-heading-nav text-gray-900 dark:text-white">
                      <span className="font-bold">Tyler</span>{' '}
                      <span className="font-normal">Bustard</span>
                    </span>
                  </div>
                </button>
              )}
            </div>

            {/* Center - Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              
              {/* Resume Page Navigation - With Dropdowns */}
              {isResumePage && (
                <>
                  {/* Education */}
                  <div 
                    className="relative dropdown-container"
                    onMouseEnter={() => handleDropdownEnter('education')}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      onClick={() => scrollToSection('#education')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 ${
                        currentSection === 'education' 
                          ? 'text-blue-600 font-semibold bg-blue-50/50' 
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/30'
                      }`}
                    >
                      Education
                      <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'education' ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Education Dropdown */}
                    {openDropdown === 'education' && (
                      <div className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                        <div 
                          className="glass-panel glass-elevated rounded-xl p-4 transition-all duration-200 mt-1"
                          onMouseEnter={() => handleDropdownContentEnter('education')}
                          onMouseLeave={handleDropdownContentLeave}
                        >
                          <div className="space-y-3">
                            {/* McGill University (Resume: scroll to top of Education) */}
                            <button 
                              onClick={() => {
                                scrollToSection('#education');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">McGill University</div>
                                <div className="text-xs text-gray-600">Desautels Faculty of Management</div>
                                <div className="text-xs text-gray-500">Master of Management in Finance Candidate</div>
                              </div>
                            </button>
                            
                            {/* University of New Brunswick (Resume: scroll to top of Education) */}
                            <button 
                              onClick={() => {
                                scrollToSection('#education');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">University of New Brunswick</div>
                                <div className="text-xs text-gray-600">Bachelor of Business Administration</div>
                                <div className="text-xs text-gray-500">Finance Major</div>
                              </div>
                            </button>
                            
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Experience */}
                  <div 
                    className="relative dropdown-container"
                    onMouseEnter={() => handleDropdownEnter('experience')}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      onClick={() => scrollToSection('#experience')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 ${
                        currentSection === 'experience' 
                          ? 'text-blue-600 font-semibold bg-blue-50/50' 
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/30'
                      }`}
                    >
                      Experience
                      <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'experience' ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Experience Dropdown */}
                    {openDropdown === 'experience' && (
                      <div className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                        <div 
                          className="glass-panel glass-elevated rounded-xl p-4 transition-all duration-200 mt-1"
                          onMouseEnter={() => handleDropdownContentEnter('experience')}
                          onMouseLeave={handleDropdownContentLeave}
                        >
                          <div className="space-y-3">
                            {/* Senior Associate, Portfolio Monitoring */}
                            <button 
                              onClick={() => {
                                scrollToSection(getExperienceId('73 Strings', 'Senior Associate, Portfolio Monitoring'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Senior Associate, Portfolio Monitoring</div>
                                <div className="text-xs text-gray-600">73 Strings</div>
                              </div>
                            </button>

                            {/* Portfolio Assistant */}
                            <button 
                              onClick={() => {
                                scrollToSection(getExperienceId('BMO Private Wealth', 'Portfolio Assistant'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Portfolio Assistant</div>
                                <div className="text-xs text-gray-600">BMO Private Wealth</div>
                              </div>
                            </button>

                            {/* Financial Advisor */}
                            <button 
                              onClick={() => {
                                scrollToSection(getExperienceId('TD Canada Trust', 'Financial Advisor'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Financial Advisor</div>
                                <div className="text-xs text-gray-600">TD Canada Trust</div>
                              </div>
                            </button>

                            {/* Banking Advisor */}
                            <button 
                              onClick={() => {
                                scrollToSection(getExperienceId('Royal Bank of Canada', 'Banking Advisor'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Banking Advisor</div>
                                <div className="text-xs text-gray-600">Royal Bank of Canada</div>
                              </div>
                            </button>

                            {/* Client Advisor Intern */}
                            <button 
                              onClick={() => {
                                scrollToSection(getExperienceId('Royal Bank of Canada', 'Client Advisor Intern'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Client Advisor Intern</div>
                                <div className="text-xs text-gray-600">Royal Bank of Canada</div>
                              </div>
                            </button>

                            {/* Marketing Intern */}
                            <button 
                              onClick={() => {
                                scrollToSection(getExperienceId('Irving Oil Limited', 'Marketing Intern'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Marketing Intern</div>
                                <div className="text-xs text-gray-600">Irving Oil Limited</div>
                              </div>
                            </button>

                            {/* Tax Return Intern */}
                            <button 
                              onClick={() => {
                                scrollToSection(getExperienceId('Grant Thornton LLP', 'Tax Return Intern'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Tax Return Intern</div>
                                <div className="text-xs text-gray-600">Grant Thornton LLP</div>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Certifications */}
                  <div 
                    className="relative dropdown-container"
                    onMouseEnter={() => handleDropdownEnter('certifications')}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      onClick={() => scrollToSection('#certifications')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 ${
                        currentSection === 'certifications' 
                          ? 'text-blue-600 font-semibold bg-blue-50/50' 
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/30'
                      }`}
                    >
                      Certifications
                      <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'certifications' ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Certifications Dropdown */}
                    {openDropdown === 'certifications' && (
                      <div className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                        <div 
                          className="glass-panel glass-elevated rounded-xl p-4 transition-all duration-200 mt-1"
                          onMouseEnter={() => handleDropdownContentEnter('certifications')}
                          onMouseLeave={handleDropdownContentLeave}
                        >
                          <div className="space-y-3">
                            {/* CFA Level I Candidate */}
                            <button 
                              onClick={() => {
                                scrollToSection(getCertificationId('CFA Level I Candidate'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">CFA Level I Candidate</div>
                                <div className="text-xs text-gray-600">CFA Institute</div>
                              </div>
                            </button>

                          {/* GRE General Test */}
                            <button 
                              onClick={() => {
                                scrollToSection(getCertificationId('GRE General Test'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">GRE General Test</div>
                                <div className="text-xs text-gray-600">Educational Testing Service</div>
                              </div>
                            </button>

                            {/* Finance Certifications */}
                            <button 
                              onClick={() => {
                                scrollToSection(getCertificationCategoryId('Financial Certifications'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Finance Certifications</div>
                                <div className="text-xs text-gray-600">CSI, WSP, Bloomberg</div>
                              </div>
                            </button>

                            {/* Technology Certifications */}
                            <button 
                              onClick={() => {
                                scrollToSection(getCertificationCategoryId('Technology Certifications'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Technology Certifications</div>
                                <div className="text-xs text-gray-600">Coursera</div>
                              </div>
                            </button>

                            {/* Analytics Certifications */}
                            <button 
                              onClick={() => {
                                scrollToSection(getCertificationCategoryId('Analytics Certifications'));
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Analytics Certifications</div>
                                <div className="text-xs text-gray-600">Coursera</div>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Community */}
                  <div 
                    className="relative dropdown-container"
                    onMouseEnter={() => handleDropdownEnter('community')}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      onClick={() => scrollToSection('#community')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 ${
                        currentSection === 'community' 
                          ? 'text-blue-600 font-semibold bg-blue-50/50' 
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/30'
                      }`}
                    >
                      Community
                      <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'community' ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Community Dropdown */}
                    {openDropdown === 'community' && (
                      <div className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                        <div 
                          className="glass-panel glass-elevated rounded-xl p-4 transition-all duration-200 mt-1"
                          onMouseEnter={() => handleDropdownEnter('community')}
                          onMouseLeave={handleDropdownLeave}
                        >
                          <div className="space-y-3">
                            {/* Next Gen Ambassador */}
                            <button 
                              onClick={() => {
                                scrollToSection('#community');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Next Gen Ambassador</div>
                                <div className="text-xs text-gray-600">United Way</div>
                              </div>
                            </button>

                            {/* Student Ambassador */}
                            <button 
                              onClick={() => {
                                scrollToSection('#community');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Student Ambassador</div>
                                <div className="text-xs text-gray-600">Royal Bank of Canada</div>
                              </div>
                            </button>

                            {/* Volunteer Staff */}
                            <button 
                              onClick={() => {
                                scrollToSection('#community');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Volunteer Staff</div>
                                <div className="text-xs text-gray-600">Irving Oil Limited</div>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contact */}
                  <div 
                    className="relative dropdown-container"
                    onMouseEnter={() => handleDropdownEnter('contact')}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      onClick={() => scrollToSection('#contact')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 ${
                        currentSection === 'contact' 
                          ? 'text-blue-600 font-semibold bg-blue-50/50' 
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/30'
                      }`}
                    >
                      Contact
                      <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'contact' ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Contact Dropdown */}
                    {openDropdown === 'contact' && (
                      <div className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                        <div 
                          className="glass-panel glass-elevated rounded-xl p-4 transition-all duration-200 mt-1"
                          onMouseEnter={() => handleDropdownEnter('contact')}
                          onMouseLeave={handleDropdownLeave}
                        >
                          <div className="space-y-3">
                            {/* Email */}
                            <button 
                              onClick={() => {
                                scrollToSection('#contact');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Email</div>
                <div className="text-xs text-gray-600">tyler@tylerbustard.com</div>
                              </div>
                            </button>

                            {/* Phone */}
                            <button 
                              onClick={() => {
                                scrollToSection('#contact');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Phone</div>
                                <div className="text-xs text-gray-600">(613) 985-1223</div>
                              </div>
                            </button>

                            {/* Location */}
                            <button 
                              onClick={() => {
                                scrollToSection('#contact');
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Location</div>
                                <div className="text-xs text-gray-600">Toronto, Ontario</div>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Home Page Navigation - With Dropdowns */}
              
              {/* Education */}
              {isHomePage && (
                <div 
                  className="relative dropdown-container"
                  onMouseEnter={() => handleDropdownEnter('education')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    onClick={() => scrollToSection('#education')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 ${
                      currentSection === 'education' 
                        ? 'text-blue-600 font-semibold bg-blue-50/50' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/30'
                    }`}
                  >
                    Education
                    <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'education' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Education Dropdown */}
                  {openDropdown === 'education' && (
                    <div className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                      <div 
                        className="rounded-xl p-4 shadow-xl transition-all duration-200 mt-1"
                        style={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                          border: '1px solid rgba(0, 0, 0, 0.08)',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                        }}
                        onMouseEnter={() => handleDropdownContentEnter('education')}
                        onMouseLeave={handleDropdownContentLeave}
                      >
                        <div className="space-y-3">
                          {/* McGill University */}
                          <button 
                            onClick={() => {
                              scrollToSection('#mcgill-education');
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">McGill University</div>
                              <div className="text-xs text-gray-600">Desautels Faculty of Management</div>
                              <div className="text-xs text-gray-500">Master of Management in Finance Candidate</div>
                            </div>
                          </button>
                          
                          {/* University of New Brunswick */}
                          <button 
                            onClick={() => {
                              scrollToSection('#unb-education');
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">University of New Brunswick</div>
                              <div className="text-xs text-gray-600">Bachelor of Business Administration</div>
                              <div className="text-xs text-gray-500">Finance Major</div>
                            </div>
                          </button>
                          
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Experience */}
              {isHomePage && (
                <div 
                  className="relative dropdown-container"
                  onMouseEnter={() => handleDropdownEnter('experience')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    onClick={() => scrollToSection('#experience')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 ${
                      currentSection === 'experience' 
                        ? 'text-blue-600 font-semibold bg-blue-50/50' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/30'
                    }`}
                  >
                    Experience
                    <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'experience' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Experience Dropdown */}
                  {openDropdown === 'experience' && (
                    <div className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                      <div 
                        className="rounded-xl p-4 shadow-xl transition-all duration-200 mt-1"
                        style={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                          border: '1px solid rgba(0, 0, 0, 0.08)',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                        }}
                        onMouseEnter={() => handleDropdownEnter('experience')}
                        onMouseLeave={handleDropdownLeave}
                      >
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {/* Senior Associate, Portfolio Monitoring */}
                          <button 
                            onClick={() => {
                              scrollToSection(getExperienceId('73 Strings', 'Senior Associate, Portfolio Monitoring'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Senior Associate, Portfolio Monitoring</div>
                              <div className="text-xs text-gray-600">73 Strings</div>
                            </div>
                          </button>
                          
                          {/* Equity Analyst */}
                          <button 
                            onClick={() => {
                              scrollToSection(getExperienceId('Fiscal.ai', 'Equity Analyst'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Equity Analyst</div>
                              <div className="text-xs text-gray-600">Fiscal.ai</div>
                            </div>
                          </button>
                          
                          {/* Portfolio Assistant */}
                          <button 
                            onClick={() => {
                              scrollToSection(getExperienceId('BMO Private Wealth', 'Portfolio Assistant'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Portfolio Assistant</div>
                              <div className="text-xs text-gray-600">BMO Private Wealth</div>
                            </div>
                          </button>
                          
                          {/* Financial Advisor */}
                          <button 
                            onClick={() => {
                              scrollToSection(getExperienceId('TD Canada Trust', 'Financial Advisor'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Financial Advisor</div>
                              <div className="text-xs text-gray-600">TD Canada Trust</div>
                            </div>
                          </button>
                          
                          {/* Banking Advisor */}
                          <button 
                            onClick={() => {
                              scrollToSection(getExperienceId('Royal Bank of Canada', 'Banking Advisor'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Banking Advisor</div>
                              <div className="text-xs text-gray-600">Royal Bank of Canada</div>
                            </div>
                          </button>
                          
                          {/* Client Advisor Intern */}
                          <button 
                            onClick={() => {
                              scrollToSection(getExperienceId('Royal Bank of Canada', 'Client Advisor Intern'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Client Advisor Intern</div>
                              <div className="text-xs text-gray-600">Royal Bank of Canada</div>
                            </div>
                          </button>
                          
                          {/* Marketing Intern */}
                          <button 
                            onClick={() => {
                              scrollToSection(getExperienceId('Irving Oil Limited', 'Marketing Intern'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Marketing Intern</div>
                              <div className="text-xs text-gray-600">Irving Oil Limited</div>
                            </div>
                          </button>
                          
                          {/* Tax Return Intern */}
                          <button 
                            onClick={() => {
                              scrollToSection(getExperienceId('Grant Thornton LLP', 'Tax Return Intern'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Tax Return Intern</div>
                              <div className="text-xs text-gray-600">Grant Thornton LLP</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Certifications */}
              {isHomePage && (
                <div 
                  className="relative dropdown-container"
                  onMouseEnter={() => handleDropdownEnter('certifications')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    onClick={() => scrollToSection('#certifications')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 ${
                      currentSection === 'certifications' || currentSection === 'skills' 
                        ? 'text-blue-600 font-semibold bg-blue-50/50' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/30'
                    }`}
                  >
                    Certifications
                    <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'certifications' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Certifications Dropdown */}
                  {openDropdown === 'certifications' && (
                    <div className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                      <div 
                        className="rounded-xl p-4 shadow-xl transition-all duration-200 mt-1"
                        style={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                          border: '1px solid rgba(0, 0, 0, 0.08)',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                        }}
                      >
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {/* Financial Certifications */}
                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('CFA Level I Candidate'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">CFA Level I Candidate</div>
                              <div className="text-xs text-gray-600">CFA Institute</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Discounted Cash Flow Analysis'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Discounted Cash Flow Analysis</div>
                              <div className="text-xs text-gray-600">Training the Street</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Financial Planning 1'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Financial Planning 1</div>
                              <div className="text-xs text-gray-600">Canadian Securities Institute</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Certificate in Financial Services Advice'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Certificate in Financial Services Advice</div>
                              <div className="text-xs text-gray-600">Canadian Securities Institute</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Personal Financial Service Advice'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Personal Financial Service Advice</div>
                              <div className="text-xs text-gray-600">Canadian Securities Institute</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Canadian Securities Course'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Canadian Securities Course</div>
                              <div className="text-xs text-gray-600">Canadian Securities Institute</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Financial & Valuation Modeling'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Financial & Valuation Modeling</div>
                              <div className="text-xs text-gray-600">Wall Street Prep</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Investment Funds in Canada'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Investment Funds in Canada</div>
                              <div className="text-xs text-gray-600">Canadian Securities Institute</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Bloomberg Market Concepts Certificate'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Bloomberg Market Concepts Certificate</div>
                              <div className="text-xs text-gray-600">Bloomberg</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Personal Finance Essentials'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Personal Finance Essentials</div>
                              <div className="text-xs text-gray-600">McGill University</div>
                            </div>
                          </button>

                          {/* Data Science & Technology Certifications */}
                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Data Analytics Professional'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Data Analytics Professional</div>
                              <div className="text-xs text-gray-600">Google</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Data Visualization with Tableau'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Data Visualization with Tableau</div>
                              <div className="text-xs text-gray-600">UC Davis</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Python for Everybody'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Python for Everybody</div>
                              <div className="text-xs text-gray-600">University of Michigan</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Machine Learning'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Machine Learning</div>
                              <div className="text-xs text-gray-600">Stanford University</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('SQL for Data Science'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">SQL for Data Science</div>
                              <div className="text-xs text-gray-600">UC Davis</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Power BI Data Visualization'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Power BI Data Visualization</div>
                              <div className="text-xs text-gray-600">Microsoft</div>
                            </div>
                          </button>

                          {/* Mathematical & Statistical Certifications */}
                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Econometrics: Methods & Applications'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Econometrics: Methods & Applications</div>
                              <div className="text-xs text-gray-600">Erasmus University</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Matrix Algebra for Engineers'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Matrix Algebra for Engineers</div>
                              <div className="text-xs text-gray-600">HKUST</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Introduction to Calculus'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Introduction to Calculus</div>
                              <div className="text-xs text-gray-600">University of Sydney</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Inferential Statistics'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Inferential Statistics</div>
                              <div className="text-xs text-gray-600">Duke University</div>
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('Excel Skills for Business'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Excel Skills for Business</div>
                              <div className="text-xs text-gray-600">Macquarie University</div>
                            </div>
                          </button>

                          {/* Standardized Exam */}
                          <button 
                            onClick={() => {
                              scrollToSection(getCertificationId('GRE General Test'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">GRE General Test</div>
                              <div className="text-xs text-gray-600">ETS</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Community */}
              {isHomePage && (
                <div 
                  className="relative dropdown-container"
                  onMouseEnter={() => handleDropdownEnter('community')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    onClick={() => scrollToSection('#community')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 ${
                      currentSection === 'community' 
                        ? 'text-blue-600 font-semibold bg-blue-50/50' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/30'
                    }`}
                  >
                    Community
                    <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'community' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Community Dropdown */}
                  {openDropdown === 'community' && (
                    <div className="absolute top-full left-0 -mt-1 w-80 z-[55] pt-1">
                      <div 
                        className="rounded-xl p-4 shadow-xl transition-all duration-200 mt-1"
                        style={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                          border: '1px solid rgba(0, 0, 0, 0.08)',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                        }}
                        onMouseEnter={() => handleDropdownContentEnter('community')}
                        onMouseLeave={handleDropdownContentLeave}
                      >
                        <div className="space-y-3">
                          {/* Next Gen Ambassador */}
                          <button 
                            onClick={() => {
                              scrollToSection(getCommunityId('United Way'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Next Gen Ambassador</div>
                              <div className="text-xs text-gray-600">United Way</div>
                            </div>
                          </button>
                          
                          {/* Student Ambassador */}
                          <button 
                            onClick={() => {
                              scrollToSection(getCommunityId('Royal Bank of Canada'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Student Ambassador</div>
                              <div className="text-xs text-gray-600">Royal Bank of Canada</div>
                            </div>
                          </button>

                          {/* Volunteer Staff */}
                          <button 
                            onClick={() => {
                              scrollToSection(getCommunityId('Irving Oil Limited'));
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Volunteer Staff</div>
                              <div className="text-xs text-gray-600">Irving Oil Limited</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Contact */}
              {isHomePage && (
                <div 
                  className="relative dropdown-container"
                  onMouseEnter={() => handleDropdownEnter('contact')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    onClick={() => scrollToSection('#contact')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 ${
                      currentSection === 'contact' 
                        ? 'text-blue-600 font-semibold bg-blue-50/50' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/30'
                    }`}
                  >
                    Contact
                    <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'contact' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Contact Dropdown */}
                  {openDropdown === 'contact' && (
                    <div className="absolute top-full left-0 -mt-1 w-72 z-[55] pt-1">
                      <div 
                        className="rounded-xl p-4 shadow-xl transition-all duration-200 mt-1"
                        style={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                          border: '1px solid rgba(0, 0, 0, 0.08)',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                        }}
                      >
                        <div className="space-y-3">
                          {/* Email */}
                          <button 
                            onClick={() => {
                              scrollToSection('#contact');
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Email</div>
                              <div className="text-xs text-gray-600">tyler@tylerbustard.com</div>
                            </div>
                          </button>

                          {/* Phone */}
                          <button 
                            onClick={() => {
                              scrollToSection('#contact');
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Phone</div>
                              <div className="text-xs text-gray-600">(613) 985-1223</div>
                            </div>
                          </button>

                          {/* Location */}
                          <button 
                            onClick={() => {
                              scrollToSection('#contact');
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left hover:bg-gray-100/50 rounded-lg p-3 transition-all duration-200 group"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Location</div>
                              <div className="text-xs text-gray-600">Toronto, Ontario</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right side */}
            {!isSignInPage && (
            <div className="flex items-center space-x-3">
              
              {/* Desktop Resume Button */}
              <div className="hidden lg:flex items-center space-x-2">
                {isResumePage && (
                  <button 
                    onClick={() => window.print()}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-sm flex items-center gap-2"
                  >
                    <Printer size={16} />
                    Download PDF
                  </button>
                )}
                <button 
                  onClick={() => {
                    if (isResumePage) {
                      // Always go to home page, not back in history
                      window.location.href = '/';
                    } else if (isUploadPage || isSignInPage) {
                      // Go to home page for upload-resume and sign-in pages
                      window.location.href = '/';
                      } else {
                      window.location.href = '/resume';
                    }
                  }}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-all duration-200 hover:scale-105 shadow-sm"
                >
                  {isResumePage ? 'Close' : isUploadPage ? 'Home' : 'Resume'}
                </button>
              </div>

              {/* Mobile Menu Button */}
              {(isResumePage || isUploadPage || isSignInPage) ? (
                <div className="flex items-center space-x-2 lg:hidden">
                  {isResumePage && (
                    <button
                      onClick={() => window.print()}
                      className="p-2 rounded-lg hover:bg-gray-100/50 transition-all duration-200 active:scale-95"
                      aria-label="Download resume as PDF"
                    >
                      <Printer size={20} />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      // Always go to home page, not back in history
                      window.location.href = '/';
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100/50 transition-all duration-200 active:scale-95"
                    aria-label={isResumePage ? "Close resume" : "Go to home"}
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100/50 transition-all duration-200 active:scale-95"
                  aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                >
                  {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              )}
            </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Clean Glass Effect */}
      {isMobileMenuOpen && !isResumePage && !isUploadPage && !isSignInPage && (
        <div className="fixed inset-0 z-[60] lg:hidden animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div 
            className="absolute inset-x-0 top-0 h-full overflow-y-auto animate-in slide-in-from-top duration-300"
            style={{
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)'
            }}
          >
            <div className="p-6 pt-20">
              {/* Close Button at top */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100/50 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Mobile Navigation Links */}
                {isHomePage && (
                  <>
                    <button 
                      onClick={() => {
                        scrollToSection('#education');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-lg font-medium text-gray-900 hover:bg-gray-100/50 rounded-lg transition-all duration-200 active:scale-98"
                    >
                      Education
                    </button>
                    <button 
                      onClick={() => {
                        scrollToSection('#experience');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-lg font-medium text-gray-900 hover:bg-gray-100/50 rounded-lg transition-all duration-200 active:scale-98"
                    >
                      Experience
                    </button>
                    <button 
                      onClick={() => {
                        scrollToSection('#certifications');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-lg font-medium text-gray-900 hover:bg-gray-100/50 rounded-lg transition-all duration-200 active:scale-98"
                    >
                      Certifications
                    </button>
                    <button 
                      onClick={() => {
                        scrollToSection('#community');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-lg font-medium text-gray-900 hover:bg-gray-100/50 rounded-lg transition-colors"
                    >
                      Community
                    </button>
                    <button 
                      onClick={() => {
                        scrollToSection('#contact');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-lg font-medium text-gray-900 hover:bg-gray-100/50 rounded-lg transition-colors"
                    >
                      Contact
                    </button>
                  </>
                )}
                
                {/* Resume Button */}
                <button 
                  onClick={() => {
                    if (isResumePage) {
                      // Always go to home page, not back in history
                      window.location.href = '/';
                    } else if (isUploadPage || isSignInPage) {
                      // Go to home page for upload-resume and sign-in pages
                      window.location.href = '/';
                      } else {
                      window.location.href = '/resume';
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full px-4 py-3 text-lg font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {isResumePage ? 'Close Resume' : isUploadPage ? 'Home' : 'Resume'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </>
  );
}