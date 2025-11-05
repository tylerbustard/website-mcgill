import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useSimpleAuth } from "@/hooks/useSimpleAuth";

export default function ResumeUploadSignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const { toast } = useToast();
  const { login } = useSimpleAuth();
  const [, setLocation] = useLocation();

  // Get the previous page from localStorage or default to home
  useEffect(() => {
    const storedPreviousPage = localStorage.getItem('previousPage');
    if (storedPreviousPage) {
      setPreviousPage(storedPreviousPage);
    } else {
      // Default to home page
      setPreviousPage('/');
    }
  }, []);

  const handleBack = () => {
    if (previousPage && previousPage !== '/sign-in') {
      setLocation(previousPage);
    } else {
      // Fallback to home page
      setLocation('/');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(username, password);
    
    if (result.success) {
      toast({
        title: "Login Successful",
        description: "Welcome! You can now upload and manage your content.",
      });
      // Clear the previous page from localStorage
      localStorage.removeItem('previousPage');
      // Navigate to the upload page
      setLocation('/upload');
    } else {
      toast({
        title: "Login Failed",
        description: result.error || "Invalid username or password. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="flex items-center justify-center min-h-screen px-6 py-12">
        <Card className="w-full max-w-lg bg-white shadow-xl border border-gray-200 rounded-2xl">
        <CardHeader className="text-center space-y-4 p-10 pb-6">
          {/* Back Button */}
          <div className="flex justify-start mb-8">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-900 font-medium p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
              data-testid="button-back"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2" style={{ 
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            letterSpacing: '-0.025em'
          }}>
            Upload Access
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed" style={{ 
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
          }}>
            Sign in to upload and manage your resume and introduction video
          </CardDescription>
        </CardHeader>
        <CardContent className="p-10 pt-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <Label htmlFor="username" className="text-sm font-semibold text-gray-700" style={{ 
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
              }}>
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                data-testid="input-username"
                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-4 text-base"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
              />
            </div>
            
            <div className="space-y-4">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700" style={{ 
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
              }}>
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  data-testid="input-password"
                  className="bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 pr-12 rounded-xl px-4 py-4 text-base"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-4 px-6 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl text-base"
                disabled={isLoading}
                data-testid="button-login"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}