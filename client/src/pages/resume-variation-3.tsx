import { useState, useEffect, type CSSProperties } from "react";
import { useInitialPageAnimation } from "@/hooks/useScrollAnimation";
import { Mail, Phone, MapPin, Globe, ChevronUp, Briefcase, GraduationCap, Award, Heart, Target, Users, TrendingUp } from "lucide-react";

// Import logos from assets
import profileImage from "@assets/Untitled design (1)_1755896187722.png";
import unbLogo from "@assets/University_of_New_Brunswick_Logo.svg_1755912478863.png";
import bmoLogo from "@assets/BMO_Logo.svg_1755913265896.png";
import tdLogo from "@assets/Toronto-Dominion_Bank_logo.svg_1755913265896.png";
import rbcLogo from "@assets/RBC-Logo_1755913716813.png";
import unitedWayLogo from "@assets/United-Way-Logo_1755913265895.png";
import irvingLogo from "@assets/Irving_Oil.svg_1755913265895.png";
import grantThorntonLogo from "@assets/Grant_Thornton_logo_1755913265895.png";
import cfaLogo from "@assets/CFA_Institute_Logo_1755923720192.png";
import trainingTheStreetLogo from "@assets/trainning the street_1755938972014.png";
import csiLogo from "@assets/canadian securities institute_1755923720191.png";
import etsLogo from "@assets/ETS_1755939510188.png";
import bloombergLogo from "@assets/bloomberg_1755923720190.png";
import wallStreetPrepLogo from "@assets/wall street prep_1755923720193.png";
import courseraLogo from "@assets/Coursera_1755937682843.png";
import mcgillLogo from "@assets/mcgill_university_logo.png";

export default function ResumeVariation3() {
  const isPageLoaded = useInitialPageAnimation(400);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = "Tyler Bustard - Resume";

    return () => {
      document.title = originalTitle;
    };
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let lastKnownScrollY = 0;
    
    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        const scrollY = window.scrollY;
        if (Math.abs(scrollY - lastKnownScrollY) > 50) {
          setShowScrollToTop(scrollY > 300);
          lastKnownScrollY = scrollY;
        }
      }, 100);
    };

    setShowScrollToTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Resume Content - Variation 3: Leadership & Management Focus */}
      <div className="px-6 sm:px-8 lg:px-10 pb-12 pt-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Resume Container - Exact dimensions: 21.59cm x 55.88cm */}
          <div
            className={`resume-page bg-white rounded-2xl overflow-hidden shadow-lg mb-6 page-load-fade-in print:shadow-none print:border-0 print:rounded-none ${isPageLoaded ? 'loaded' : ''}`}
            style={{ "--resume-min-height": "55.88cm" } as CSSProperties}
          >
            
            {/* Header Section - Leadership Focus */}
            <div className="mb-6">
              <div className="flex items-start gap-4">
                {/* Profile Photo */}
                <img 
                  src={profileImage} 
                  alt="Tyler Bustard" 
                  className="w-28 h-28 rounded-2xl object-cover shadow-md"
                  data-testid="img-resume-profile"
                  style={{ border: '2px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />

                {/* Name and Contact Info */}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900" 
                      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif', letterSpacing: '-0.02em' }}>
                    Tyler Bustard
                  </h1>
                  <h2 className="text-lg text-blue-600 font-semibold mt-2">
                    Financial Services Leader & Strategic Advisor
                  </h2>
                  
                  {/* Contact Bar */}
                  <div id="contact" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 mt-4 scroll-mt-24">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-500" />
                      <span>tyler@tylerbustard.com</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-blue-500" />
                      <span>+1 (613) 985-1223</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-blue-500" />
                      <span>tylerbustard.com</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      <span>Toronto, Ontario</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Summary - Leadership Focus */}
              <div className="mt-5 bg-gradient-to-r from-blue-50 to-gray-50 rounded-xl p-4 border border-blue-100">
                <p className="text-sm leading-loose text-gray-700">
                  Results-driven financial services leader with expertise in team development, process optimization, and strategic client relationship management. Proven track record of driving performance improvements and fostering collaborative environments across diverse financial institutions.
                </p>
              </div>
            </div>

            {/* Leadership Competencies Section */}
            <section id="leadership-competencies" className="mb-5 scroll-mt-24">
              <h3 className="text-base font-bold text-gray-900 mb-4 uppercase tracking-wide" style={{ letterSpacing: '0.05em' }}>Leadership Competencies</h3>
              
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
                      <Users className="w-4 h-4 text-blue-500" />
                      Team Leadership
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {['Team Development', 'Mentoring', 'Cross-functional Collaboration', 'Conflict Resolution'].map(skill => (
                        <span key={skill} className="resume-skill-chip inline-block px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      Strategic Planning
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {['Process Improvement', 'Performance Optimization', 'Change Management', 'Goal Setting'].map(skill => (
                        <span key={skill} className="resume-skill-chip inline-block px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
                      <Target className="w-4 h-4 text-purple-500" />
                      Client Leadership
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {['Relationship Building', 'Stakeholder Management', 'Consultative Selling', 'Service Excellence'].map(skill => (
                        <span key={skill} className="resume-skill-chip inline-block px-2 py-1 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Professional Experience Section - Leadership Focus */}
            <section id="experience" className="mb-5 scroll-mt-24">
              <h3 className="text-base font-bold text-gray-900 mb-4 uppercase tracking-wide" style={{ letterSpacing: '0.05em' }}>Professional Experience</h3>
              
              <div className="space-y-4">
                {/* BMO Private Wealth - Leadership Focus */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center border border-blue-200">
                        <img src={bmoLogo} alt="BMO" className="w-7 h-7 object-contain" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">Portfolio Assistant & Team Coordinator</h4>
                          <p className="text-sm text-blue-600 font-semibold">BMO Private Wealth • Toronto, ON</p>
                        </div>
                        <span className="text-xs text-gray-600 px-1.5 py-0.5 rounded">2022-2023</span>
                      </div>
                      <ul className="space-y-1 mb-3">
                        <li className="text-sm text-gray-700 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>Led cross-functional collaboration with Investment Counsellors managing $100M+ AUM</span>
                        </li>
                        <li className="text-sm text-gray-700 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>Spearheaded process improvements that reduced team preparation time by 12%</span>
                        </li>
                        <li className="text-sm text-gray-700 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>Mentored junior staff and coordinated team workflows to enhance overall productivity</span>
                        </li>
                        <li className="text-sm text-gray-700 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>Developed client communication standards that improved satisfaction metrics by 9%</span>
                        </li>
                      </ul>
                      <div className="flex flex-wrap gap-2">
                        {['Team Leadership', 'Process Optimization', 'Staff Mentoring', 'Workflow Coordination', 'Standards Development'].map(skill => (
                          <span key={skill} className="resume-skill-chip inline-block px-1.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* TD Canada Trust - Leadership Focus */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center border border-green-200">
                        <img src={tdLogo} alt="TD" className="w-7 h-7 object-contain" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">Senior Financial Advisor</h4>
                          <p className="text-sm text-blue-600 font-semibold">TD Canada Trust • Kingston, ON</p>
                        </div>
                        <span className="text-xs text-gray-600 px-1.5 py-0.5 rounded">2021-2022</span>
                      </div>
                      <ul className="space-y-1 mb-3">
                        <li className="text-sm text-gray-700 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>Led district-wide initiatives that contributed to 11% sales growth across the team</span>
                        </li>
                        <li className="text-sm text-gray-700 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>Achieved top 15% performance ranking through strategic client relationship management</span>
                        </li>
                        <li className="text-sm text-gray-700 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>Championed best practices sharing sessions that elevated team performance standards</span>
                        </li>
                        <li className="text-sm text-gray-700 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>Developed comprehensive onboarding program for new team members</span>
                        </li>
                      </ul>
                      <div className="flex flex-wrap gap-2">
                        {['District Leadership', 'Performance Management', 'Best Practices Development', 'Training & Onboarding', 'Strategic Planning'].map(skill => (
                          <span key={skill} className="resume-skill-chip inline-block px-1.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* RBC Banking Advisor - Leadership Focus */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center border border-gray-200">
                        <img src={rbcLogo} alt="RBC" className="w-7 h-7 object-contain" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">Banking Advisor & Student Ambassador</h4>
                          <p className="text-sm text-blue-600 font-semibold">Royal Bank of Canada • Kingston, ON</p>
                        </div>
                        <span className="text-xs text-gray-600 px-1.5 py-0.5 rounded">2020-2021</span>
                      </div>
                      <ul className="space-y-1 mb-3">
                        <li className="text-sm text-gray-700 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>Led campus initiatives as RBC Student Ambassador, promoting financial literacy</span>
                        </li>
                        <li className="text-sm text-gray-700 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>Developed client retention strategies that increased repeat transactions by 13%</span>
                        </li>
                        <li className="text-sm text-gray-700 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>Coordinated team efforts to boost core product adoption by 8% through strategic planning</span>
                        </li>
                      </ul>
                      <div className="flex flex-wrap gap-2">
                        {['Campus Leadership', 'Strategic Coordination', 'Retention Strategies', 'Financial Education', 'Program Development'].map(skill => (
                          <span key={skill} className="resume-skill-chip inline-block px-1.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Leadership & Community Involvement */}
            <section id="leadership-involvement" className="mb-5 scroll-mt-24">
              <h3 className="text-base font-bold text-gray-900 mb-4 uppercase tracking-wide" style={{ letterSpacing: '0.05em' }}>Leadership & Community Involvement</h3>
              
              <div className="space-y-3">
                {/* UNB Student Investment Fund */}
                <div className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center border border-gray-200">
                        <img src={unbLogo} alt="UNB" className="w-7 h-7 object-contain" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">Portfolio Manager & Analyst</h4>
                        <p className="text-sm text-gray-600">UNB Student Investment Fund • $500K+ AUM</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 px-1.5 py-0.5 rounded">2018-2020</span>
                  </div>
                </div>

                {/* Finance Club */}
                <div className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center border border-gray-200">
                        <Award className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">Executive Member</h4>
                        <p className="text-sm text-gray-600">UNB Finance Club • Event Coordination</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 px-1.5 py-0.5 rounded">2017-2020</span>
                  </div>
                </div>

                {/* Community Involvement */}
                <div className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center border border-gray-200">
                        <Heart className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">Community Volunteer</h4>
                        <p className="text-sm text-gray-600">Local Financial Literacy Programs</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 px-1.5 py-0.5 rounded">Ongoing</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Education Section */}
            <section id="education" className="mb-5 scroll-mt-24">
              <h3 className="text-base font-bold text-gray-900 mb-4 uppercase tracking-wide" style={{ letterSpacing: '0.05em' }}>Education</h3>
              
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center border border-blue-200">
                      <img src={unbLogo} alt="UNB" className="w-7 h-7 object-contain" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">Bachelor of Business Administration</h4>
                        <p className="text-sm text-blue-600 font-medium">Finance Major • University of New Brunswick</p>
                      </div>
                      <span className="text-xs text-gray-600 px-1.5 py-0.5 rounded">2016-2020</span>
                    </div>
                    <ul className="space-y-2">
                      <li className="text-sm text-gray-700 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Leadership roles: Portfolio Manager, Finance Club Executive, RBC Student Ambassador</span>
                      </li>
                      <li className="text-sm text-gray-700 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>5 Academic Scholarships ($47,500) recognizing leadership excellence and academic achievement</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Professional Certifications */}
            <section id="certifications" className="mb-3 scroll-mt-24">
              <h3 className="text-base font-bold text-gray-900 mb-4 uppercase tracking-wide" style={{ letterSpacing: '0.05em' }}>Professional Certifications</h3>
              
              <div className="grid grid-cols-2 gap-3">
                {/* CFA */}
                <div className="bg-white rounded-xl border border-gray-200 p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center border border-gray-200">
                        <img src={cfaLogo} alt="CFA" className="w-7 h-7 object-contain" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-gray-900">CFA Level I Candidate</h4>
                        <p className="text-sm text-gray-600">CFA Institute</p>
                        <p className="text-sm text-gray-500 mt-0.5">Ethics & Professional Standards</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 px-1.5 py-0.5 rounded">2026</span>
                  </div>
                </div>

                {/* Training the Street */}
                <div className="bg-white rounded-xl border border-gray-200 p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center border border-gray-200">
                        <img src={trainingTheStreetLogo} alt="Training the Street" className="w-7 h-7 object-contain" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-gray-900">Financial Modeling</h4>
                        <p className="text-sm text-gray-600">Training the Street</p>
                        <p className="text-sm text-gray-500 mt-0.5">Advanced Excel & Leadership</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 px-1.5 py-0.5 rounded">2024</span>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 hover:scale-110 z-50"
          data-testid="button-scroll-to-top"
        >
          <ChevronUp size={20} />
        </button>
      )}

      <style>{`
        @media print {
          .resume-skill-chip {
            background: transparent !important;
            border: none !important;
            padding: 0 !important;
            border-radius: 0 !important;
            color: #1f2937 !important;
          }
        }
      `}</style>
    </div>
  );
}