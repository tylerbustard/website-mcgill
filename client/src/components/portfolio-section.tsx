import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Github } from "lucide-react";
import { useScrollAnimation, useStaggeredScrollAnimation } from "@/hooks/useScrollAnimation";

interface Project {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  demoUrl: string;
  codeUrl: string;
}

export default function PortfolioSection() {
  const sectionAnimation = useScrollAnimation({ threshold: 0.15, triggerOnce: true });
  const headerAnimation = useScrollAnimation({ threshold: 0.25, triggerOnce: true, delay: 100 });
  const { ref: projectsRef, visibleItems } = useStaggeredScrollAnimation(3, { threshold: 0.15, triggerOnce: true, delay: 200 });
  
  const projects: Project[] = [
    {
      title: "AI-Driven Investment Analytics Platform",
      description: "Advanced equity research platform leveraging machine learning for portfolio optimization and risk assessment.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
      technologies: ["Python", "AI Analytics", "Financial Modeling"],
      demoUrl: "#",
      codeUrl: "#",
    },
    {
      title: "Portfolio Performance Dashboard",
      description: "Real-time portfolio tracking and performance analysis tool with interactive visualizations and custom reporting.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
      technologies: ["Power BI", "Tableau", "SQL"],
      demoUrl: "#",
      codeUrl: "#",
    },
    {
      title: "Financial Risk Assessment Model",
      description: "Comprehensive risk management system for evaluating investment opportunities and market volatility.",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
      technologies: ["Excel VBA", "Python", "Statistical Analysis"],
      demoUrl: "#",
      codeUrl: "#",
    },
  ];

  return (
    <section 
      ref={sectionAnimation.ref}
      id="portfolio" 
      className={`py-16 sm:py-24 lg:py-32 relative overflow-hidden bg-muted/20 scroll-fade-in ${sectionAnimation.isVisible ? 'visible' : ''}`}>
      <div className="container-width">
        <div 
          ref={headerAnimation.ref}
          className={`text-center mb-8 sm:mb-12 lg:mb-16 scroll-slide-up ${headerAnimation.isVisible ? 'visible' : ''}`}
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">Featured Projects</h2>
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A showcase of my recent work and technical achievements.
          </p>
        </div>

        <div ref={projectsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project, index) => (
            <Card 
              key={index} 
              className={`shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 scroll-scale-in scroll-stagger-${index + 1} ${visibleItems.has(index) ? 'visible' : ''}`}
              data-testid={`project-${index}`}
            >
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              
              <CardContent className="p-10">
                <h3 className="text-xl font-bold text-foreground mb-3">{project.title}</h3>
                <p className="text-base text-muted-foreground mb-4 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                      data-testid={`project-tech-${index}-${techIndex}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <a 
                    href={project.demoUrl} 
                    className="text-primary hover:text-primary/80 transition-all duration-500 flex items-center"
                    data-testid={`link-demo-${index}`}
                  >
                    <ExternalLink className="mr-1 h-4 w-4" />
                    Demo
                  </a>
                  <a 
                    href={project.codeUrl} 
                    className="text-secondary hover:text-foreground transition-all duration-500 flex items-center"
                    data-testid={`link-code-${index}`}
                  >
                    <Github className="mr-1 h-4 w-4" />
                    Code
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <a 
            href="#" 
            className="text-primary hover:text-primary/80 transition-all duration-500 font-medium flex items-center justify-center"
            data-testid="link-github-more"
          >
            <Github className="mr-2 h-4 w-4" />
            View more projects on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
