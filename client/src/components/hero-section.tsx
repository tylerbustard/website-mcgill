import { Play, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInitialPageAnimation } from "@/hooks/useScrollAnimation";
import { useQuery } from "@tanstack/react-query";
// VideoOverlay no longer needed - using YouTube directly
import profileImage from "@assets/89BBD451-CD8B-47EB-AA2E-C39D4637B01D_1_105_c_1755896148330.jpeg";
import bmoLogo from "@assets/BMO_Logo.svg_1755913265896.png";
import tdLogo from "@assets/Toronto-Dominion_Bank_logo.svg_1755913265896.png";
import rbcLogo from "@assets/RBC-Logo_1755913716813.png";
import irvingLogo from "@assets/Irving_Oil.svg_1755913265895.png";
import grantThorntonLogo from "@assets/Grant_Thornton_logo_1755913265895.png";
import cfaLogo from "@assets/CFA_Institute_Logo_1755923720192.png";
import csiLogo from "@assets/canadian securities institute_1755923720191.png";
import bloombergLogo from "@assets/bloomberg_1755923720190.png";
import courseraLogo from "@assets/Coursera_1755937682843.png";
import mcgillLogo from "@assets/mcgill_university_logo.png";
import unbLogo from "@assets/University_of_New_Brunswick_Logo.svg_1755912478863.png";
import wallStreetPrepLogo from "@assets/wall street prep_1755923720193.png";
import trainingTheStreetLogo from "@assets/trainning the street_1755938972014.png";
import etsLogo from "@assets/ETS_1755939510188.png";
import unitedWayLogo from "@assets/United-Way-Logo_1755913265895.png";
import seventyThreeStringsLogo from "@assets/73_strings_logo.webp";
import fiscalAiLogo from "@assets/fiscal_ai_logo_new.png";

export default function HeroSection() {
  const isPageLoaded = useInitialPageAnimation(400);
  
  // Fetch active video from backend
  const videosQuery = useQuery({
    queryKey: ['/api/videos'],
    staleTime: 60000, // 1 minute
  });

  // Smooth scroll to section function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };
  
  return (
    <section id="hero" className="relative overflow-hidden min-h-screen flex items-center justify-center py-20 sm:py-28 lg:py-36" style={{ backgroundColor: '#f5f5f7' }}>
      <div className="relative z-10 px-4 sm:px-6 w-full">
        <div className="max-w-7xl mx-auto">
          
          {/* Main Hero Card */}
          <div className={`bg-white/80 backdrop-blur-md border border-white/30 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-12 lg:p-16 shadow-2xl hover:shadow-3xl transition-all duration-500 page-load-fade-in ${isPageLoaded ? 'loaded' : ''}`}
               style={{
                 backdropFilter: 'blur(12px)',
                 WebkitBackdropFilter: 'blur(12px)',
                 boxShadow: '0 20px 80px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
               }}>
            
            <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-black/5 hover:scale-105 transition-all duration-500">
                    <img 
                      src={profileImage} 
                      alt="Tyler Bustard professional headshot" 
                      className="w-full h-full object-cover object-center"
                      data-testid="img-profile"
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-6 sm:space-y-8 text-center lg:text-left">
                {/* Name & Title */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-2 sm:space-y-3">
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl text-gray-900 dark:text-white tracking-tight leading-[0.9]" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                      <span className="font-bold">Tyler</span>{' '}
                      <span className="font-normal">Bustard</span>
                    </h1>
                  </div>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-primary" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                    Finance & Technology Professional
                  </p>
                </div>

                {/* Description */}
                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                  Driving innovation at the intersection of finance and technology. 
                  Delivering exceptional results through analytical expertise, strategic thinking, and client-focused solutions.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2 sm:pt-4">
                  {/* Only show video button if videos exist */}
                  {Boolean(videosQuery.data && Array.isArray(videosQuery.data) && videosQuery.data.length > 0) && (
                    <Button
                      onClick={() => {
                        console.log('Button clicked. Videos data:', videosQuery.data);
                        const activeVideo = videosQuery.data && 
                          Array.isArray(videosQuery.data) &&
                          videosQuery.data.find((video: any) => video.isActive);
                        
                        console.log('Active video found:', activeVideo);
                        
                        if (activeVideo) {
                          console.log('Creating video overlay for:', activeVideo.fileUrl);
                          
                          // Create simple video overlay
                          const overlay = document.createElement('div');
                          overlay.id = 'video-overlay';
                          overlay.style.cssText = `
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100vw;
                            height: 100vh;
                            background: rgba(0,0,0,0.9);
                            z-index: 999999;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 20px;
                          `;
                          
                          // Create close button
                          const closeBtn = document.createElement('button');
                          closeBtn.innerHTML = '✕ Close';
                          closeBtn.style.cssText = `
                            position: absolute;
                            top: 20px;
                            right: 20px;
                            background: white;
                            border: none;
                            padding: 10px 15px;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 16px;
                            z-index: 1000000;
                          `;
                          closeBtn.onclick = () => overlay.remove();
                          
                          // Create video element
                          const video = document.createElement('video');
                          video.controls = true;
                          video.autoplay = true;
                          video.muted = true;
                          video.style.cssText = `
                            max-width: 90%;
                            max-height: 90%;
                            width: auto;
                            height: auto;
                            background: black;
                          `;
                          video.src = '/api/introduction-video';
                          
                          // Add event listeners for debugging
                          video.addEventListener('loadstart', () => console.log('✅ Video loading started'));
                          video.addEventListener('loadeddata', () => {
                            console.log('✅ Video data loaded');
                            console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
                            console.log('Video element size:', video.offsetWidth, 'x', video.offsetHeight);
                          });
                          video.addEventListener('error', (e) => console.error('❌ Video error:', e));
                          video.addEventListener('canplay', () => console.log('✅ Video can play'));
                          
                          overlay.appendChild(video);
                          overlay.appendChild(closeBtn);
                          document.body.appendChild(overlay);
                          console.log('✅ Simple video overlay created');
                          
                          // Close on escape key
                          const handleEscape = (e: KeyboardEvent) => {
                            if (e.key === 'Escape') {
                              overlay.remove();
                              document.removeEventListener('keydown', handleEscape);
                            }
                          };
                          document.addEventListener('keydown', handleEscape);
                          
                          // Close on background click
                          overlay.addEventListener('click', (e) => {
                            if (e.target === overlay) {
                              overlay.remove();
                              document.removeEventListener('keydown', handleEscape);
                            }
                          });
                        } else {
                          console.log('No active video found, scrolling to introduction');
                          scrollToSection('introduction');
                        }
                      }}
                      className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 sm:px-8 py-4 sm:py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3 text-lg min-h-[56px]"
                      data-testid="button-introduction"
                    >
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <Play size={16} className="ml-0.5" />
                      </div>
                      {Boolean(videosQuery.data && Array.isArray(videosQuery.data) && videosQuery.data.length > 0 && videosQuery.data.find((video: any) => video.isActive)) ? 'Watch Introduction Video' : 'Introduction'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats/Highlights Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-6 sm:mt-8 mb-6">
            
            {/* Education Card */}
            <div 
              onClick={() => scrollToSection('education')}
              className={`group bg-white/90 backdrop-blur-[20px] border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl hover:shadow-3xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-[1.05] hover:-translate-y-2 page-load-fade-in cursor-pointer min-h-[200px] sm:min-h-[220px] flex flex-col justify-between hover:bg-gradient-to-br hover:from-white/95 hover:to-blue-50/80 ${isPageLoaded ? 'loaded' : ''}`}
                 style={{
                   backdropFilter: 'blur(20px)',
                   WebkitBackdropFilter: 'blur(20px)',
                   animationDelay: '0.5s'
                 }}
                 data-testid="card-education">
              <div className="flex items-center gap-4 mb-1">
                <div className="w-12 h-12 bg-primary/10 group-hover:bg-blue-500/20 rounded-xl flex items-center justify-center relative overflow-visible transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  {/* Two education logos stacked */}
                  <div className="flex relative group-hover:space-x-1 transition-all duration-300">
                    <div className="w-6 h-6 bg-white rounded-full border-2 border-white shadow-md flex items-center justify-center relative z-30 group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg">
                      <img src={mcgillLogo} alt="McGill University Education" className="w-4 h-4 object-contain" />
                    </div>
                    <div className="w-6 h-6 bg-white rounded-full border-2 border-white shadow-md flex items-center justify-center relative z-20 -ml-2 group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg">
                      <img src={unbLogo} alt="University of New Brunswick Education" className="w-4 h-4 object-contain" />
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-blue-600 transition-all duration-300 group-hover:translate-x-2">Education</h3>
              </div>
              <p className="text-base text-muted-foreground group-hover:text-gray-700 leading-relaxed transition-colors duration-300">
                Strategic business foundation with finance expertise
              </p>
            </div>

            {/* Experience Card */}
            <div 
              onClick={() => scrollToSection('experience')}
              className={`group bg-white/90 backdrop-blur-[20px] border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl hover:shadow-3xl hover:shadow-green-500/20 transition-all duration-500 hover:scale-[1.05] hover:-translate-y-2 page-load-fade-in cursor-pointer min-h-[200px] sm:min-h-[220px] flex flex-col justify-between hover:bg-gradient-to-br hover:from-white/95 hover:to-green-50/80 ${isPageLoaded ? 'loaded' : ''}`}
                 style={{
                   backdropFilter: 'blur(20px)',
                   WebkitBackdropFilter: 'blur(20px)',
                   animationDelay: '0.6s'
                 }}
                 data-testid="card-experience">
              <div className="flex items-center gap-4 mb-1">
                <div className="w-12 h-12 bg-primary/10 group-hover:bg-green-500/20 rounded-xl flex items-center justify-center relative overflow-visible transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  {/* Three most recent experience logos stacked */}
                  <div className="flex relative group-hover:space-x-1 transition-all duration-300">
                    <div className="w-6 h-6 bg-white rounded-full border-2 border-white shadow-md flex items-center justify-center relative z-30 group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg">
                      <img src={seventyThreeStringsLogo} alt="73 Strings Portfolio Monitoring" className="w-4 h-4 object-contain" />
                    </div>
                    <div className="w-6 h-6 bg-white rounded-full border-2 border-white shadow-md flex items-center justify-center relative z-20 -ml-2 group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg">
                      <img src={fiscalAiLogo} alt="Fiscal.ai Equity Analyst" className="w-4 h-4 object-contain" />
                    </div>
                    <div className="w-6 h-6 bg-white rounded-full border-2 border-white shadow-md flex items-center justify-center relative z-10 -ml-2 group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg">
                      <img src={bmoLogo} alt="BMO Bank of Montreal Financial Services" className="w-4 h-4 object-contain" />
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-green-600 transition-all duration-300 group-hover:translate-x-2">Experience</h3>
              </div>
              <p className="text-base text-muted-foreground group-hover:text-gray-700 leading-relaxed transition-colors duration-300">
                Professional experience in finance, banking and accounting
              </p>
            </div>

            {/* Certifications Card */}
            <div 
              onClick={() => scrollToSection('certifications')}
              className={`group bg-white/90 backdrop-blur-[20px] border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl hover:shadow-3xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-[1.05] hover:-translate-y-2 page-load-fade-in cursor-pointer min-h-[200px] sm:min-h-[220px] flex flex-col justify-between hover:bg-gradient-to-br hover:from-white/95 hover:to-purple-50/80 ${isPageLoaded ? 'loaded' : ''}`}
                 style={{
                   backdropFilter: 'blur(20px)',
                   WebkitBackdropFilter: 'blur(20px)',
                   animationDelay: '0.7s'
                 }}
                 data-testid="card-certifications">
              <div className="flex items-center gap-4 mb-1">
                <div className="w-12 h-12 bg-primary/10 group-hover:bg-purple-500/20 rounded-xl flex items-center justify-center relative overflow-visible transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  {/* Three most recent certification logos stacked */}
                  <div className="flex relative group-hover:space-x-1 transition-all duration-300">
                    <div className="w-6 h-6 bg-white rounded-full border-2 border-white shadow-md flex items-center justify-center relative z-30 group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg">
                      <img src={cfaLogo} alt="CFA Chartered Financial Analyst Institute" className="w-4 h-4 object-contain" />
                    </div>
                    <div className="w-6 h-6 bg-white rounded-full border-2 border-white shadow-md flex items-center justify-center relative z-20 -ml-2 group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg">
                      <img src={trainingTheStreetLogo} alt="Training the Street Financial Modeling Certification" className="w-4 h-4 object-contain" />
                    </div>
                    <div className="w-6 h-6 bg-white rounded-full border-2 border-white shadow-md flex items-center justify-center relative z-10 -ml-2 group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg">
                      <img src={etsLogo} alt="ETS Educational Testing Service Certification" className="w-4 h-4 object-contain" />
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-purple-600 transition-all duration-300 group-hover:translate-x-2">Certifications</h3>
              </div>
              <p className="text-base text-muted-foreground group-hover:text-gray-700 leading-relaxed transition-colors duration-300">
                Certifications in finance, technology, and banking
              </p>
            </div>

            {/* Community Card */}
            <div 
              onClick={() => scrollToSection('community')}
              className={`group bg-white/90 backdrop-blur-[20px] border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl hover:shadow-3xl hover:shadow-orange-500/20 transition-all duration-500 hover:scale-[1.05] hover:-translate-y-2 page-load-fade-in cursor-pointer min-h-[200px] sm:min-h-[220px] flex flex-col justify-between hover:bg-gradient-to-br hover:from-white/95 hover:to-orange-50/80 ${isPageLoaded ? 'loaded' : ''}`}
                 style={{
                   backdropFilter: 'blur(20px)',
                   WebkitBackdropFilter: 'blur(20px)',
                   animationDelay: '0.8s'
                 }}
                 data-testid="card-community">
              <div className="flex items-center gap-4 mb-1">
                <div className="w-12 h-12 bg-primary/10 group-hover:bg-orange-500/20 rounded-xl flex items-center justify-center relative overflow-visible transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  {/* Three most recent community logos stacked */}
                  <div className="flex relative group-hover:space-x-1 transition-all duration-300">
                    <div className="w-6 h-6 bg-white rounded-full border-2 border-white shadow-md flex items-center justify-center relative z-30 group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg">
                      <img src={unitedWayLogo} alt="United Way Community Volunteer Organization" className="w-4 h-4 object-contain" />
                    </div>
                    <div className="w-6 h-6 bg-white rounded-full border-2 border-white shadow-md flex items-center justify-center relative z-20 -ml-2 group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg">
                      <img src={rbcLogo} alt="RBC Royal Bank of Canada" className="w-4 h-4 object-contain" />
                    </div>
                    <div className="w-6 h-6 bg-white rounded-full border-2 border-white shadow-md flex items-center justify-center relative z-10 -ml-2 group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg">
                      <img src={irvingLogo} alt="Irving Oil Energy Company" className="w-4 h-4 object-contain" />
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-orange-600 transition-all duration-300 group-hover:translate-x-2">Community</h3>
              </div>
              <p className="text-base text-muted-foreground group-hover:text-gray-700 leading-relaxed transition-colors duration-300">
                Community leadership and volunteer service initiatives
              </p>
            </div>

          </div>
        </div>
      </div>
      
      {/* Video now opens directly on YouTube */}
    </section>
  );
}
