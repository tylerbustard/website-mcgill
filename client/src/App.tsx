import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Switch, Route } from "wouter";
import Home from "@/pages/home";
import Resume from "@/pages/resume";
import ResumeUploadSignIn from "@/pages/resume-upload-signin";
import UploadResumeDashboard from "@/pages/upload-resume-dashboard";
import { useGlobalAnimations } from "@/hooks/useGlobalAnimations";

function App() {
  // Initialize global animation system
  useGlobalAnimations();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Switch>
          {/* Main routes */}
          <Route path="/" component={Home} />
          <Route path="/resume" component={Resume} />
          <Route path="/upload" component={UploadResumeDashboard} />
          <Route path="/sign-in" component={ResumeUploadSignIn} />
          
          {/* 404 fallback */}
          <Route>404: Page not found</Route>
        </Switch>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;