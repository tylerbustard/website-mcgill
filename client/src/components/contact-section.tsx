import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";
import { IoSend } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const { toast } = useToast();
  const sectionAnimation = useScrollAnimation({ threshold: 0.15, triggerOnce: true });
  const headerAnimation = useScrollAnimation({ threshold: 0.25, triggerOnce: true, delay: 100 });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      const response = await apiRequest("/api/contact", "POST", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Thank you for your message! I'll get back to you soon.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    },
    onError: (error) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactInfo = [
    { icon: HiOutlineMail, label: "Email", value: "tyler@tylerbustard.com" },
    { icon: HiOutlinePhone, label: "Phone", value: "(613) 985-1223" },
    { icon: HiOutlineLocationMarker, label: "Location", value: "Toronto, Ontario, Canada" },
  ];


  return (
    <section 
      ref={sectionAnimation.ref}
      id="contact" 
      className={`py-16 sm:py-24 lg:py-32 relative overflow-hidden scroll-fade-in ${sectionAnimation.isVisible ? 'visible' : ''}`}>
      {/* Background */}
      <div className="absolute inset-0 bg-white" />
      
      <div className="container-width">
        <div className="bg-white/90 backdrop-blur-xl rounded-[20px] sm:rounded-[28px] p-6 sm:p-8 lg:p-10 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500">
          {/* Header Section - Apple's content-first approach */}
          <div 
            ref={headerAnimation.ref}
            className={`text-center mb-8 sm:mb-12 lg:mb-16 scroll-slide-up ${headerAnimation.isVisible ? 'visible' : ''}`}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">Contact</h2>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Ready to discuss your next project or opportunity? I'd love to hear from you.
            </p>
          </div>

        {/* Contact Cards Grid - Apple-style asymmetrical layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {contactInfo.map((info, index) => (
            <Card key={index} id={`contact-${info.label.toLowerCase()}`} className="bg-white/90 backdrop-blur-xl rounded-[20px] sm:rounded-[28px] border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] text-center" data-testid={`contact-card-${index}`}>
              <CardContent className="p-6 sm:p-8 lg:p-10">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-110">
                  <info.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{info.label}</h3>
                <p className="text-base font-medium text-muted-foreground">{info.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Contact Form - Apple's hero card design */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/90 backdrop-blur-xl rounded-[20px] sm:rounded-[28px] border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden">
            {/* Clean Background */}
            <div className="absolute inset-0 bg-white"></div>
            
            <CardContent className="p-6 sm:p-8 lg:p-10 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
                {/* Form Info Section */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Send a Message</h3>
                    <p className="text-sm text-muted-foreground">
                      Whether you're looking to discuss investment opportunities, portfolio management, or potential collaboration, I'm here to help.
                    </p>
                  </div>
                  
                  {/* Quick Stats - Apple style */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="font-medium text-muted-foreground">Typically responds within 24 hours</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="font-medium text-muted-foreground">Available for consulting opportunities</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="font-medium text-muted-foreground">Open to investment discussions</span>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="apple-label">
                          Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Your full name"
                          required
                          data-testid="input-name"
                          className="apple-input"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="apple-label">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="your.email@example.com"
                          required
                          data-testid="input-email"
                          className="apple-input"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="apple-label">
                        Subject
                      </label>
                      <input
                        id="subject"
                        type="text"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        placeholder="What's this about?"
                        required
                        data-testid="input-subject"
                        className="apple-input"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="apple-label">
                        Message
                      </label>
                      <textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Tell me about your project or opportunity..."
                        className="apple-input h-32 resize-none"
                        required
                        data-testid="input-message"
                      />
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        disabled={contactMutation.isPending}
                        className="w-full apple-button-primary text-lg h-14 font-semibold"
                        data-testid="button-send"
                      >
                        {contactMutation.isPending ? (
                          <AiOutlineLoading3Quarters className="mr-3 h-5 w-5 animate-spin" />
                        ) : (
                          <IoSend className="mr-3 h-5 w-5" />
                        )}
                        Send Message
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alternative Contact Methods - Apple style */}
        <div className="mt-16 text-center">
          <p className="font-medium text-muted-foreground mb-6">
            Prefer a different approach? You can also reach out directly:
          </p>
          <div className="flex justify-center gap-8">
            <a 
              href="mailto:tyler@tylerbustard.com"
              className="inline-flex items-center gap-2 font-medium text-primary hover:text-primary/80 transition-all duration-500"
              data-testid="link-email-direct"
            >
              <HiOutlineMail className="w-4 h-4" />
              Email Direct
            </a>
            <a 
              href="tel:+16139851223"
              className="inline-flex items-center gap-2 font-medium text-primary hover:text-primary/80 transition-all duration-500"
              data-testid="link-phone-direct"
            >
              <HiOutlinePhone className="w-4 h-4" />
              Call Direct
            </a>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
