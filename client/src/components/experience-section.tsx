import { Card, CardContent } from "@/components/ui/card";
import { useScrollAnimation, useStaggeredScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCounterAnimation } from "@/hooks/use-counter-animation";
import { slugify } from "@/lib/utils";
import bmoLogo from "@assets/BMO_Logo.svg_1755913265896.png";
import tdLogo from "@assets/Toronto-Dominion_Bank_logo.svg_1755913265896.png";
import rbcLogo from "@assets/RBC-Logo_1755913716813.png";
import irvingLogo from "@assets/Irving_Oil.svg_1755913265895.png";
import grantThorntonLogo from "@assets/Grant_Thornton_logo_1755913265895.png";
import seventyThreeStringsLogo from "@assets/73_strings_logo.webp";
import fiscalAiLogo from "@assets/fiscal_ai_logo_new.png";

interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  duration: string;
  achievements: string[];
  technologies: string[];
  logoSrc: string;
  color: string;
}

interface CounterStatProps {
  end: number;
  suffix?: string;
  prefix?: string;
  label: string;
  className?: string;
  delay?: number;
}

function CounterStat({ end, suffix = '', prefix = '', label, className = '', delay = 0 }: CounterStatProps) {
  const { count, elementRef } = useCounterAnimation({ end, delay });
  
  return (
    <div className="text-center" ref={elementRef}>
      <div className={`text-4xl lg:text-5xl font-bold mb-3 ${className}`}>
        {prefix}{count}{suffix}
      </div>
      <div className="text-muted-foreground font-medium">{label}</div>
    </div>
  );
}

export default function ExperienceSection() {
  const sectionAnimation = useScrollAnimation({ threshold: 0.15, triggerOnce: true });
  
  // Mobile fallback - ensure content is visible on small screens
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  
  // Reduce delays significantly on mobile for faster appearance
  const headerAnimation = useScrollAnimation({ 
    threshold: 0.25, 
    triggerOnce: true, 
    delay: isMobile ? 0 : 100 
  });
  
  const { ref: experiencesRef, visibleItems } = useStaggeredScrollAnimation(8, { 
    threshold: 0.1, 
    triggerOnce: true, 
    delay: isMobile ? 0 : 150 
  });

  // Base experiences array
  const baseExperiences: Experience[] = [
    {
      title: "Equity Analyst",
      company: "Fiscal.ai",
      location: "Toronto, Ontario",
      period: "2023-2025",
      duration: "2+ years",
      achievements: [
        "Analyzed and compiled public company financial statements, cutting reporting turnaround by 13%",
        "Collaborated with product and engineering to implement AI-driven data features, boosting adoption by 12%",
      ],
      technologies: ["Financial Analysis", "AI Integration", "Data Analytics", "Python", "SQL"],
      logoSrc: fiscalAiLogo,
      color: "#00A97F"
    },
    {
      title: "Portfolio Assistant",
      company: "BMO Private Wealth",
      location: "Toronto, Ontario",
      period: "2022-2023",
      duration: "1 year",
      achievements: [
        "Advised two Investment Counsellors managing portfolios over $100M and cut preparation time by 12%",
        "Bolstered client communications, boosting response rates by 9% heightening client satisfaction and retention",
      ],
      technologies: ["Portfolio Management", "Client Relations", "Financial Analysis", "Excel"],
      logoSrc: bmoLogo,
      color: "#005EB8"
    },
    {
      title: "Financial Advisor",
      company: "TD Canada Trust",
      location: "Kingston, Ontario",
      period: "2021-2022",
      duration: "1 year",
      achievements: [
        "Cultivated strong client relationships by assessing individual financial needs, resulting in an 11% increase in sales",
        "Exceeded sales targets, achieving a top 15% performance ranking within the district",
      ],
      technologies: ["Financial Planning", "Sales", "Client Advisory", "Product Knowledge"],
      logoSrc: tdLogo,
      color: "#00AC46"
    },
    {
      title: "Banking Advisor",
      company: "Royal Bank of Canada",
      location: "Kingston, Ontario",
      period: "2020-2021",
      duration: "1 year",
      achievements: [
        "Strengthened client relationships by advising on personalized solutions, increased repeat transactions by 13%",
        "Excelled in needs-based advising, boosting adoption of core products like GICs, mutual funds, and TFSAs by 8%",
      ],
      technologies: ["Banking Products", "Financial Advisory", "Client Relationship Management", "Digital Banking"],
      logoSrc: rbcLogo,
      color: "#005DAA"
    },
    {
      title: "Client Advisor Intern",
      company: "Royal Bank of Canada",
      location: "Fredericton, New Brunswick",
      period: "2019-2020",
      duration: "1 year",
      achievements: [
        "Resolved complex client issues, achieving a 15% boost in positive feedback scores for the branch",
        "Promoted RBC's digital banking tools, leading to a 10% increase in online and mobile banking adoption",
      ],
      technologies: ["Client Service", "Digital Banking", "Problem Resolution", "Customer Support"],
      logoSrc: rbcLogo,
      color: "#005DAA"
    },
    {
      title: "Marketing Intern",
      company: "Irving Oil Limited",
      location: "Saint John, New Brunswick",
      period: "2018",
      duration: "4 months",
      achievements: [
        "Conducted competitor analysis driving insights that improved targeted marketing by 11%",
        "Developed a Customer Lifecycle model that increased targeted promotions, boosting customer engagement by 8%",
      ],
      technologies: ["Market Research", "Customer Analytics", "Competitive Analysis", "Marketing Strategy"],
      logoSrc: irvingLogo,
      color: "#FF6B35"
    },
    {
      title: "Tax Return Intern",
      company: "Grant Thornton LLP",
      location: "Saint John, New Brunswick",
      period: "2018",
      duration: "5 months",
      achievements: [
        "Streamlined client financial data, boosting accuracy by 10% ensuring timely submission of 100+ tax returns",
        "Improved tax return preparation processes, cutting filing errors by 15%",
      ],
      technologies: ["Tax Preparation", "Financial Analysis", "Data Management", "Client Service"],
      logoSrc: grantThorntonLogo,
      color: "#8B5CF6"
    },
  ];

  // Current experience at 73 Strings
  const seventyThreeStringsExperience: Experience = {
    title: "Senior Associate, Portfolio Monitoring",
    company: "73 Strings",
    location: "Toronto, Ontario",
    period: "2025-Present",
    duration: "1+ months",
    achievements: [
      "Monitor daily NAV inputs, validate holdings and cash flows; support accurate fund valuations",
      "Review reconciliation workflows, investigate exceptions, and liaise with operations risk and PMs",
    ],
    technologies: ["Monitoring Controls", "Reconciliation", "NAV Validation", "SQL", "Excel"],
    logoSrc: seventyThreeStringsLogo,
    color: "#1e5ba8"
  };

  // Create final experiences array with all experiences
  const experiences: Experience[] = [seventyThreeStringsExperience, ...baseExperiences];

  return (
    <section 
      ref={sectionAnimation.ref}
      id="experience" 
      className={`py-20 sm:py-28 lg:py-36 relative overflow-hidden scroll-fade-in ${sectionAnimation.isVisible || isMobile ? 'visible' : ''}`}
    >
      {/* Background - inherits Apple grey from parent */}
      
      <div className="container-width">
        {/* Header - Outside the card */}
        <div 
          ref={headerAnimation.ref}
          className={`text-center mb-12 sm:mb-16 lg:mb-20 scroll-slide-up ${headerAnimation.isVisible || isMobile ? 'visible' : ''}`}
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
            Experience
          </h2>
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
            Professional experience in finance, banking and accounting
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-[28px] p-8 sm:p-10 lg:p-12 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500">

        {/* Experience Timeline */}
        <div ref={experiencesRef} className="relative">
          {/* Clean Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200 hidden md:block"></div>
          
          <div className="space-y-8 sm:space-y-10">
            {experiences.map((exp, index) => (
              <div 
                key={index} 
                id={`experience-${slugify(exp.company)}-${slugify(exp.title)}`} 
                className={`relative scroll-scale-in ${isMobile ? '' : `scroll-stagger-${index + 1}`} ${visibleItems.has(index) || isMobile ? 'visible' : ''}`}
                data-testid={`experience-${index}`}
                style={isMobile ? { 
                  opacity: 1, 
                  transform: 'scale(1) translateY(0)',
                  transition: 'opacity 0.2s ease-out, transform 0.2s ease-out'
                } : {}}
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
                      {/* Header Section */}
                      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-6 text-center sm:text-left">
                        {/* Logo on left */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-110">
                          <img 
                            src={exp.logoSrc} 
                            alt={`${exp.company} Logo`} 
                            className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                          />
                        </div>
                        
                        {/* Content on right */}
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-0 sm:gap-0">
                            <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                              {exp.title}
                            </h3>
                            <span className="hidden sm:block text-base font-medium text-gray-500" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>{exp.period}</span>
                          </div>
                          <div className="space-y-0">
                            <p className="text-lg font-semibold text-primary" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>{exp.company}</p>
                            <p className="text-base text-muted-foreground" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>{exp.location}</p>
                            <span className="block sm:hidden text-base font-medium text-gray-500" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>{exp.period}</span>
                          </div>
                        </div>
                      </div>

                      {/* Key Achievements */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-foreground mb-4" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Key Achievements</h4>
                        <div className="space-y-3">
                          {exp.achievements.map((achievement, achievementIndex) => (
                            <div key={achievementIndex} className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5 flex-shrink-0"></div>
                              <p className="text-base text-muted-foreground font-medium leading-relaxed" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>{achievement}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Skills & Technologies */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-3" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Core Competencies</h4>
                        
                        {/* Mobile version - Row format */}
                        <div className="sm:hidden space-y-2">
                          {exp.technologies.map((tech, techIndex) => (
                            <div
                              key={techIndex}
                              className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-medium border border-primary/20 w-full text-center"
                              data-testid={`tech-${index}-${techIndex}`}
                            >
                              {tech}
                            </div>
                          ))}
                        </div>
                        
                        {/* Desktop version - Wrap format */}
                        <div className="hidden sm:flex flex-wrap gap-2">
                          {exp.technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium hover:bg-primary/20 transition-colors duration-300"
                              data-testid={`tech-${index}-${techIndex}`}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Career Summary */}
        <div className="mt-16">
          <div className="bg-white/90 backdrop-blur-xl rounded-[28px] border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-100/50 to-gray-200/50 p-8 lg:p-12">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-12 text-center">
                Career Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                <CounterStat 
                  end={6} 
                  suffix="+" 
                  label="Years Experience" 
                  className="text-foreground"
                  delay={0}
                />
                <CounterStat 
                  end={7} 
                  label="Companies" 
                  className="text-green-600"
                  delay={200}
                />
                <CounterStat 
                  end={3} 
                  label="Industries" 
                  className="text-primary"
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
