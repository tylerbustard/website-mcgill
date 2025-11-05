import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiGoogle } from "react-icons/si";
import { useScrollAnimation, useStaggeredScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCounterAnimation } from "@/hooks/use-counter-animation";
import { slugify } from "@/lib/utils";
import { FaCertificate, FaGraduationCap, FaTrophy, FaStar, FaChartLine, FaCalculator, FaHeart, FaRunning, FaUsers, FaHandshake } from "react-icons/fa";
import unitedWayLogo from "@assets/United-Way-Logo_1755913265895.png";
import rbcLogo from "@assets/RBC-Logo_1755913716813.png";
import irvingLogo from "@assets/Irving_Oil.svg_1755913265895.png";
import cfaLogo from "@assets/CFA_Institute_Logo_1755923720192.png";
import csiLogo from "@assets/canadian securities institute_1755923720191.png";
import wallStreetPrepLogo from "@assets/wall street prep_1755923720193.png";
import mcgillLogo from "@assets/mcgill_university_logo.png";
import trainingTheStreetLogo from "@assets/trainning the street_1755938972014.png";
import bloombergLogo from "@assets/bloomberg_1755939196335.png";
import courseraLogo from "@assets/Coursera_1755939373919.png";
import etsLogo from "@assets/ETS_1755939510188.png";

interface Certification {
  name: string;
  year: string;
  institution: string;
  description: string;
  highlight?: boolean;
  percentile?: string;
  logoSrc?: string;
}

interface CertificationCategory {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  certifications: Certification[];
}

// Counter components for certifications section
interface CounterStatProps {
  end: number;
  suffix?: string;
  prefix?: string;
  label: string;
  className?: string;
  delay?: number;
}

function CertificationCounter({ end, suffix = '', prefix = '', label, className = '', delay = 0 }: CounterStatProps) {
  const { count, elementRef } = useCounterAnimation({ end, delay });
  
  return (
    <div className="text-center" ref={elementRef}>
      <div className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 ${className}`}>
        {prefix}{count}{suffix}
      </div>
      <div className="text-base text-muted-foreground font-medium">{label}</div>
    </div>
  );
}

export default function CertificationsSection() {
  const sectionAnimation = useScrollAnimation({ threshold: 0.15, triggerOnce: true });
  const headerAnimation = useScrollAnimation({ threshold: 0.25, triggerOnce: true, delay: 100 });
  const { ref: certificationsRef, visibleItems } = useStaggeredScrollAnimation(4, { threshold: 0.15, triggerOnce: true, delay: 200 });
  const communityAnimation = useScrollAnimation({ threshold: 0.15, triggerOnce: true });
  const communityHeaderAnimation = useScrollAnimation({ threshold: 0.25, triggerOnce: true, delay: 100 });
  const { ref: communityRef, visibleItems: communityItems } = useStaggeredScrollAnimation(3, { threshold: 0.15, triggerOnce: true, delay: 200 });

  const certificationCategories: CertificationCategory[] = [
    {
      title: "Financial Certifications",
      icon: FaChartLine,
      color: "bg-blue-500",
      certifications: [
        { name: "CFA Level I Candidate", year: "2026", institution: "CFA Institute", description: "Comprehensive training in investment analysis, portfolio management, and ethical standards for investment professionals.", highlight: true, logoSrc: cfaLogo },
        { name: "Discounted Cash Flow Analysis", year: "2024", institution: "Training the Street", description: "Advanced financial modeling techniques for valuation using discounted cash flow methodology and sensitivity analysis.", logoSrc: trainingTheStreetLogo },
        { name: "Financial Planning 1", year: "2023", institution: "Canadian Securities Institute", description: "Foundational principles of personal financial planning including budgeting, insurance, and retirement planning strategies.", logoSrc: csiLogo },
        { name: "Certificate in Financial Services Advice", year: "2022", institution: "Canadian Securities Institute", description: "Professional qualification for providing financial advisory services and investment recommendations to clients.", logoSrc: csiLogo },
        { name: "Personal Financial Service Advice", year: "2021", institution: "Canadian Securities Institute", description: "Client relationship management and personalized financial advisory services for individual investors.", logoSrc: csiLogo },
        { name: "Canadian Securities Course", year: "2021", institution: "Canadian Securities Institute", description: "Comprehensive overview of Canadian capital markets, securities regulation, and investment products.", logoSrc: csiLogo },
        { name: "Financial & Valuation Modeling", year: "2020", institution: "Wall Street Prep", description: "Excel-based financial modeling for company valuation, mergers & acquisitions, and investment banking analysis.", logoSrc: wallStreetPrepLogo },
        { name: "Investment Funds in Canada", year: "2020", institution: "Canadian Securities Institute", description: "Mutual funds, ETFs, and alternative investment vehicles available in the Canadian market.", logoSrc: csiLogo },
        { name: "Bloomberg Market Concepts Certificate", year: "2020", institution: "Bloomberg", description: "Financial markets fundamentals using Bloomberg Terminal for market analysis and economic indicators.", logoSrc: bloombergLogo },
        { name: "Personal Finance Essentials", year: "2020", institution: "McGill University", description: "Core concepts of personal financial management including investing, debt management, and financial planning.", logoSrc: mcgillLogo }
      ]
    },
    {
      title: "Data Science & Technology Certifications",
      icon: SiGoogle,
      color: "bg-emerald-500",
      certifications: [
        { name: "Data Analytics Professional", year: "2023", institution: "Google", description: "End-to-end data analysis workflow including data cleaning, analysis, visualization, and presentation of insights.", highlight: true, logoSrc: courseraLogo },
        { name: "Data Visualization with Tableau", year: "2023", institution: "UC Davis", description: "Creating interactive dashboards and visualizations to communicate data insights effectively using Tableau.", logoSrc: courseraLogo },
        { name: "Python for Everybody", year: "2023", institution: "University of Michigan", description: "Programming fundamentals in Python including data structures, web scraping, and database interactions.", logoSrc: courseraLogo },
        { name: "Machine Learning", year: "2020", institution: "Stanford University", description: "Supervised and unsupervised learning algorithms, neural networks, and practical machine learning applications.", logoSrc: courseraLogo },
        { name: "SQL for Data Science", year: "2020", institution: "UC Davis", description: "Database querying, data manipulation, and analysis using SQL for data science applications.", logoSrc: courseraLogo },
        { name: "Power BI Data Visualization", year: "2020", institution: "Microsoft", description: "Business intelligence reporting and dashboard creation using Microsoft Power BI platform.", logoSrc: courseraLogo }
      ]
    },
    {
      title: "Mathematical & Statistical Certifications",
      icon: FaCalculator,
      color: "bg-purple-500",
      certifications: [
        { name: "Econometrics: Methods & Applications", year: "2024", institution: "Erasmus University", description: "Statistical methods for economic analysis including regression modeling, hypothesis testing, and causal inference.", logoSrc: courseraLogo },
        { name: "Matrix Algebra for Engineers", year: "2024", institution: "HKUST", description: "Linear algebra applications in engineering including matrix operations, eigenvalues, and system analysis.", logoSrc: courseraLogo },
        { name: "Introduction to Calculus", year: "2023", institution: "University of Sydney", description: "Fundamental calculus concepts including derivatives, integrals, and applications to optimization problems.", logoSrc: courseraLogo },
        { name: "Inferential Statistics", year: "2020", institution: "Duke University", description: "Statistical inference methods including confidence intervals, hypothesis testing, and regression analysis.", logoSrc: courseraLogo },
        { name: "Excel Skills for Business", year: "2020", institution: "Macquarie University", description: "Advanced Excel techniques for business analysis including formulas, pivot tables, and data visualization.", logoSrc: courseraLogo }
      ]
    },
    {
      title: "Standardized Exam",
      icon: FaGraduationCap,
      color: "bg-amber-500",
      certifications: [
        { 
          name: "GRE General Test", 
          year: "2024", 
          institution: "ETS", 
          description: "Standardized test measuring verbal reasoning, quantitative reasoning, and analytical writing skills for graduate school admission.",
          highlight: true,
          logoSrc: etsLogo
        }
      ]
    }
  ];

  // Get featured certifications (highlighted ones)
  const featuredCerts = certificationCategories.flatMap(category => 
    category.certifications
      .filter(cert => cert.highlight)
      .map(cert => ({ ...cert, category: category.title, icon: category.icon }))
  );

  return (
    <section 
      ref={sectionAnimation.ref}
      id="certifications" 
      className={`py-20 sm:py-28 lg:py-36 relative overflow-hidden scroll-fade-in ${sectionAnimation.isVisible ? 'visible' : ''}`}
    >
      {/* Background - inherits Apple grey from parent */}
      
      <div className="container-width">
        {/* Header - Outside the card */}
        <div 
          ref={headerAnimation.ref}
          className={`text-center mb-12 sm:mb-16 lg:mb-20 scroll-slide-up ${headerAnimation.isVisible ? 'visible' : ''}`}
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
            Certifications
          </h2>
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
            Certifications in finance, technology, and banking
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-[28px] p-8 sm:p-10 lg:p-12 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500">

        {/* All Certifications */}
        <div ref={certificationsRef} className="space-y-8 sm:space-y-10 mb-12 sm:mb-16 lg:mb-20 certifications-container">
            {certificationCategories.map((category, categoryIndex) => (
              <div 
                key={categoryIndex} 
                id={`certifications-${slugify(category.title)}`} 
                ref={categoryIndex === 0 ? certificationsRef : undefined}
                className={`relative overflow-hidden rounded-[20px] sm:rounded-[28px] bg-gradient-to-r from-gray-100/50 to-gray-200/50 backdrop-blur-sm border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 scroll-scale-in scroll-stagger-${categoryIndex + 1} ${visibleItems.has(categoryIndex) ? 'visible' : ''}`}
              >
                <div className="absolute inset-0 bg-white/85" />
                <div className="relative p-6 sm:p-8 lg:p-10">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                    {/* Category Title */}
                    <div className="lg:w-1/4 text-center sm:text-left">
                      <h4 className="text-xl sm:text-2xl font-bold text-foreground mb-3" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                        {category.title}
                      </h4>
                      <div className="w-12 h-1 bg-gradient-to-r from-primary to-blue-500 rounded-full mx-auto sm:mx-0 mb-3" />
                      <p className="text-base text-muted-foreground" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>{category.certifications.length} professional certifications</p>
                    </div>

                    {/* Certification Items */}
                    <div className="lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {category.certifications.map((cert, certIndex) => (
                        <div 
                          key={certIndex}
                          id={`cert-${slugify(cert.name)}`}
                          className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-lg hover:shadow-xl hover:bg-white/95 transition-all duration-500 hover:scale-[1.02] flex flex-col h-full min-h-[160px]"
                          data-testid={`cert-${categoryIndex}-${certIndex}`}
                        >
                          {/* Header with title and year */}
                          <div className="flex items-start justify-between mb-4">
                            <h5 className="font-bold text-foreground text-lg flex-1 leading-tight pr-3" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                              {cert.name}
                            </h5>
                            <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full flex-shrink-0" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>{cert.year}</span>
                          </div>
                          
                          {/* Institution with logo */}
                          <div className="flex items-center gap-3 mb-4">
                            {cert.logoSrc && (
                              <img 
                                src={cert.logoSrc} 
                                alt={`${cert.institution} Logo`} 
                                className="w-6 h-6 object-contain flex-shrink-0"
                              />
                            )}
                            <p className="text-muted-foreground font-semibold text-base" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>{cert.institution}</p>
                          </div>
                          
                          {/* Description */}
                          <div className="flex-1 mb-4">
                            <p className="text-muted-foreground text-sm leading-relaxed" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>{cert.description}</p>
                          </div>
                          
                          {/* Footer badges */}
                          <div className="flex items-center justify-start gap-2 mt-auto pt-4">
                            {cert.percentile && (
                              <div className="text-xs text-blue-600 font-semibold bg-blue-50 px-3 py-1.5 rounded-full">
                                {cert.percentile}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Achievement Metrics - Clean stats */}
        <div className="bg-white/90 backdrop-blur-xl rounded-[28px] border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-100/50 to-gray-200/50 p-8 sm:p-10 lg:p-12">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-6 sm:mb-8 text-center">
              Professional Development Highlights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <CertificationCounter 
                end={22} 
                label="Total Certifications" 
                className="text-foreground"
                delay={0}
              />
              <CertificationCounter 
                end={4} 
                label="Expertise Areas" 
                className="text-green-600"
                delay={200}
              />
              <CertificationCounter 
                end={17} 
                label="Different Organizations" 
                className="text-primary"
                delay={400}
              />
            </div>
          </div>
        </div>
        </div>

      </div>
    </section>
  );
}

// Community Impact Section Component
interface CommunityActivity {
  title: string;
  organization: string;
  period: string;
  duration: string;
  location: string;
  description: string;
  achievements: string[];
  skills: string[];
  icon?: React.ComponentType<{ className?: string }>;
  logoSrc?: string;
  color: string;
}

// Counter components for community section
function CommunityCounter({ end, suffix = '', prefix = '', label, className = '', delay = 0 }: CounterStatProps) {
  const { count, elementRef } = useCounterAnimation({ end, delay });
  
  return (
    <div className="text-center" ref={elementRef}>
      <div className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 ${className}`}>
        {prefix}{count}{suffix}
      </div>
      <div className="text-base text-muted-foreground font-medium">{label}</div>
    </div>
  );
}

export function CommunitySection() {
  const communityAnimation = useScrollAnimation({ threshold: 0.15, triggerOnce: true });
  const communityHeaderAnimation = useScrollAnimation({ threshold: 0.25, triggerOnce: true, delay: 100 });
  const { ref: communityRef, visibleItems: communityItems } = useStaggeredScrollAnimation(3, { threshold: 0.15, triggerOnce: true, delay: 200 });
  
  const communityActivities: CommunityActivity[] = [
    {
      title: "Next Gen Ambassador",
      organization: "United Way",
      period: "2020-Present",
      duration: "4+ years",
      location: "Toronto, Ontario",
      description: "",
      achievements: [
        "Led implementation of fundraising strategies achieving 20% increase in funds raised over three years",
        "Spearheaded engagement initiatives resulting in 15% rise in participation and awareness within workplace community",
      ],
      skills: [
        "Fundraising Strategy",
        "Leadership",
        "Event Planning",
        "Community Engagement",
        "Stakeholder Management",
      ],
      logoSrc: unitedWayLogo,
      color: "#FF5A28"
    },
    {
      title: "Student Ambassador",
      organization: "Royal Bank of Canada",
      period: "2019-2020",
      duration: "1 year",
      location: "Fredericton, New Brunswick",
      description: "",
      achievements: [
        "Organized and executed campus-wide events resulting in 25% increase in student engagement and awareness",
        "Developed targeted outreach strategy achieving 30% increase in student participation in RBC-sponsored events",
      ],
      skills: [
        "Event Management",
        "Strategic Outreach",
        "Campus Relations",
        "Brand Promotion",
        "Student Engagement",
      ],
      logoSrc: rbcLogo,
      color: "#005DAA"
    },
    {
      title: "Volunteer Staff",
      organization: "Irving Oil Limited",
      period: "2018",
      duration: "Seasonal",
      location: "Saint John, New Brunswick",
      description: "",
      achievements: [
        "Successfully organized and executed engaging activities for over 100 children ensuring safe and enjoyable experience",
        "Demonstrated leadership through collaboration with fellow volunteers for well-coordinated event execution",
      ],
      skills: [
        "Youth Engagement",
        "Event Coordination",
        "Team Collaboration",
        "Community Relations",
        "Safety Management",
      ],
      logoSrc: irvingLogo,
      color: "#1E40AF"
    }
  ];

  return (
    <section 
      ref={communityAnimation.ref}
      id="community" 
      className={`py-16 sm:py-24 lg:py-32 relative overflow-hidden scroll-fade-in ${communityAnimation.isVisible ? 'visible' : ''}`}
    >
      {/* Background - inherits Apple grey from parent */}
      
      <div className="container-width">
        {/* Header - Outside the card */}
        <div 
          ref={communityHeaderAnimation.ref}
          className={`text-center mb-8 sm:mb-10 lg:mb-12 scroll-slide-up ${communityHeaderAnimation.isVisible ? 'visible' : ''}`}
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Community
          </h2>
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Community leadership and volunteer service initiatives
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-[28px] p-8 sm:p-10 lg:p-12 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500">

        {/* Community Activities Timeline */}
        <div ref={communityRef} className="relative">
          {/* Clean Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200 hidden md:block"></div>
          
          <div className="space-y-6 sm:space-y-8">
            {communityActivities.map((activity, index) => (
              <div 
                key={index} 
                id={`community-${slugify(activity.organization)}`} 
                ref={index === 0 ? communityRef : undefined}
                className={`relative scroll-scale-in scroll-stagger-${index + 1} ${communityItems.has(index) ? 'visible' : ''}`}
                data-testid={`community-activity-${index}`}
              >
                {/* Beautiful Timeline Marker */}
                <div className="absolute left-5 w-6 h-6 rounded-full bg-gradient-to-br from-white to-gray-50 border border-gray-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.12)] hidden md:block backdrop-blur-sm">
                  <div className="absolute inset-1 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-inner"></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-transparent to-transparent"></div>
                </div>
                
                {/* Content */}
                <div className="md:ml-24">
                  <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative p-8">
                      {/* Header Section - Match Experience formatting */}
                      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-6 text-center sm:text-left">
                        {/* Logo on left */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-110">
                          {activity.logoSrc ? (
                            <img 
                              src={activity.logoSrc} 
                              alt={`${activity.organization} Logo`} 
                              className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                            />
                          ) : activity.icon ? (
                            <activity.icon className="w-12 h-12 sm:w-16 sm:h-16 text-foreground" />
                          ) : null}
                        </div>
                        {/* Content on right */}
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-0 sm:gap-0">
                            <h3 className="text-xl font-bold text-foreground">{activity.title}</h3>
                            <span className="hidden sm:block text-base font-medium text-gray-500">{activity.period}</span>
                          </div>
                          <div className="space-y-0">
                            <p className="text-lg font-semibold text-primary">{activity.organization}</p>
                            <p className="text-base text-muted-foreground">{activity.location}</p>
                            <span className="block sm:hidden text-base font-medium text-gray-500">{activity.period}</span>
                          </div>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="mt-4">
                        {activity.achievements && activity.achievements.length > 0 && (
                          <div className="mb-6">
                            <h4 className="font-semibold text-foreground mb-4">Key Achievements</h4>
                            <div className="space-y-3">
                              {activity.achievements.map((ach, i) => (
                                <div key={i} className="flex items-start gap-3">
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5 flex-shrink-0"></div>
                                  <p className="text-base text-muted-foreground font-medium leading-relaxed">{ach}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {activity.skills && activity.skills.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-3">Core Competencies</h4>
                            {/* Mobile version - Row format */}
                            <div className="sm:hidden space-y-2">
                              {activity.skills.map((skill, i) => (
                                <div key={i} className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-medium border border-primary/20 w-full text-center">
                                  {skill}
                                </div>
                              ))}
                            </div>
                            {/* Desktop version - Wrap format (exact match with Experience) */}
                            <div className="hidden sm:flex flex-wrap gap-2">
                              {activity.skills.map((skill, i) => (
                                <span key={i} className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium hover:bg-primary/20 transition-colors duration-300">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Impact Summary */}
        <div className="mt-16 sm:mt-20 lg:mt-24">
          <div className="bg-white/90 backdrop-blur-xl rounded-[28px] border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-100/50 to-gray-200/50 p-8 sm:p-10 lg:p-12">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-8 sm:mb-12 text-center">
                Community Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                <CommunityCounter 
                  end={6} 
                  suffix="+" 
                  label="Years of Service" 
                  className="text-foreground"
                  delay={0}
                />
                <CommunityCounter 
                  end={500} 
                  suffix="+" 
                  label="People Helped" 
                  className="text-primary"
                  delay={200}
                />
                <CommunityCounter 
                  end={3} 
                  label="Organizations Served" 
                  className="text-green-600"
                  delay={400}
                />
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
