import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, ArrowLeft, LogOut, Printer } from "lucide-react";
import Navigation from "@/components/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ResumeUpload } from "@shared/schema";
import { useSimpleAuth } from "@/hooks/useSimpleAuth";
import { Link, useLocation } from "wouter";

export default function UploadResumeDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { logout } = useSimpleAuth();
  const [location, setLocation] = useLocation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const { isAuthenticated, isLoading } = useSimpleAuth();

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('Not authenticated, redirecting to sign-in');
      localStorage.setItem('previousPage', location);
      setLocation('/sign-in');
    }
  }, [isAuthenticated, isLoading, location, setLocation]);

  // Fetch existing uploads (real API)
  const { data: uploads = [], isLoading: uploadsLoading } = useQuery<ResumeUpload[]>({
    queryKey: ["/api/resume-uploads"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await fetch('/api/resumes/employer');
      if (response.ok) {
        return await response.json();
      }
      return [];
    }
  });

  // Fetch existing videos
  const { data: videos = [], isLoading: videosLoading } = useQuery({
    queryKey: ["/api/videos"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await fetch('/api/videos');
      if (response.ok) {
        return await response.json();
      }
      return [];
    }
  });

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Resume file selected:', e.target.files?.[0]?.name, e.target.files?.[0]?.type);
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        console.log('Invalid file type for resume:', file.type);
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  // Handle video selection
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Video file selected:', e.target.files?.[0]?.name, e.target.files?.[0]?.type);
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['video/mp4', 'video/quicktime', 'video/avi', 'video/webm'];
      if (!allowedTypes.includes(file.type)) {
        console.log('Invalid file type for video:', file.type);
        toast({
          title: "Invalid file type",
          description: "Please select a video file (MP4, MOV, AVI, or WebM)",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        toast({
          title: "File too large",
          description: "Please select a file smaller than 100MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedVideo(file);
    }
  };

  // Upload mutation (real API implementation)
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile) return;
      
      setUploading(true);
      
      const formData = new FormData();
      formData.append('resume', selectedFile);
      if (description) {
        formData.append('title', description);
      }
      
      console.log('Uploading resume:', selectedFile.name, selectedFile.type, selectedFile.size);
      
      const response = await fetch('/api/resumes/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include cookies for session-based auth
      });
      
      console.log('Upload response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Upload error:', errorData);
        throw new Error(errorData.error || 'Failed to upload resume');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Resume uploaded successfully",
      });
      setSelectedFile(null);
      setDescription("");
      queryClient.invalidateQueries({ queryKey: ["/api/resume-uploads"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setUploading(false);
    },
  });

  // Video upload mutation
  const uploadVideoMutation = useMutation({
    mutationFn: async () => {
      if (!selectedVideo) return;
      
      setUploadingVideo(true);
      
      const formData = new FormData();
      formData.append('video', selectedVideo);
      if (videoTitle) {
        formData.append('title', videoTitle);
      }
      
      const response = await fetch('/api/videos/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include cookies for session-based auth
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload video');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Video uploaded successfully",
      });
      setSelectedVideo(null);
      setVideoTitle("");
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setUploadingVideo(false);
    },
  });

  // Delete mutation (real API implementation)
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/resumes/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete resume');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Resume deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/resume-uploads"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Preview functions
  const previewResume = (upload: ResumeUpload) => {
    if (upload.fileUrl) {
      window.open(upload.fileUrl, '_blank');
    }
  };

  const previewVideo = (video: any) => {
    if (video.fileUrl) {
      // Create video modal
      const overlay = document.createElement('div');
      overlay.id = 'video-preview-overlay';
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
      
      const videoElement = document.createElement('video');
      videoElement.src = video.fileUrl;
      videoElement.controls = true;
      videoElement.style.cssText = `
        max-width: 90vw;
        max-height: 90vh;
        border-radius: 8px;
      `;
      
      const closeButton = document.createElement('button');
      closeButton.innerHTML = '×';
      closeButton.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        font-size: 24px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      
      closeButton.onclick = () => overlay.remove();
      overlay.onclick = (e) => {
        if (e.target === overlay) overlay.remove();
      };
      
      overlay.appendChild(videoElement);
      overlay.appendChild(closeButton);
      document.body.appendChild(overlay);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f5f5f7" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8fafc" }}>
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => {
              window.location.href = '/resume';
            }}
            className="text-gray-600 hover:text-gray-900 font-medium"
            data-testid="button-back"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Resume
          </Button>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={async () => {
                try {
                  // Fetch the latest resume PDF
                  const response = await fetch('/api/latest-resume');
                  if (response.ok) {
                    // Create a blob from the PDF response
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    
                    // Open in new window for printing
                    const printWindow = window.open(url, '_blank');
                    if (printWindow) {
                      printWindow.addEventListener('load', () => {
                        setTimeout(() => {
                          printWindow.print();
                        }, 500);
                      });
                    }
                    
                    // Clean up the blob URL after a delay
                    setTimeout(() => {
                      window.URL.revokeObjectURL(url);
                    }, 60000);
                  } else if (response.status === 404) {
                    toast({
                      title: "No Resume Found",
                      description: "Please upload a resume first.",
                      variant: "destructive"
                    });
                  } else {
                    toast({
                      title: "Failed to Load Resume",
                      description: "Please try again.",
                      variant: "destructive"
                    });
                  }
                } catch (error) {
                  console.error('Error loading resume:', error);
                  toast({
                    title: "Error",
                    description: "Failed to load resume for printing.",
                    variant: "destructive"
                  });
                }
              }}
              data-testid="button-print-pdf"
              className="text-gray-600 hover:text-gray-900 font-medium"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
            >
              <Printer className="w-4 h-4 mr-2" />
              Print PDF
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => {
                logout();
                setLocation('/');
              }}
              data-testid="button-logout"
              className="text-gray-600 hover:text-gray-900 font-medium"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
            >
              Sign Out
            </Button>
          </div>
        </div>
        
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3" style={{ 
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              letterSpacing: '-0.025em'
            }}>
              Content Management
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ 
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
            }}>
              Upload and manage your resume and introduction video to enhance your professional profile
            </p>
          </div>
        </div>

        {/* Resume Upload Section */}
        <Card className="bg-white shadow-lg border border-gray-200 mb-8 rounded-xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900" style={{ 
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                  letterSpacing: '-0.025em'
                }}>
                  Resume Upload
                </h2>
                <p className="text-sm text-gray-600" style={{ 
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
                }}>
              Select a PDF file to upload (max: 10MB)
            </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="file" className="text-sm font-medium text-gray-700">Resume File</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors relative">
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    disabled={uploading}
                    className="cursor-pointer opacity-0 absolute inset-0 w-full h-full z-10"
                    data-testid="input-file"
                  />
                  <div className="space-y-2">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedFile ? selectedFile.name : 'Click to select a PDF file'}
                      </p>
                      {selectedFile && (
                        <p className="text-xs text-gray-500 mt-1">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">PDF files only, max 10MB</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description for this version..."
                  disabled={uploading}
                  rows={3}
                  data-testid="input-description"
                />
              </div>

              <Button
                onClick={() => uploadMutation.mutate()}
                disabled={!selectedFile || uploading}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 flex items-center gap-2 transition-all duration-200 hover:scale-105 font-medium"
                data-testid="button-upload"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload Resume
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Video Upload Section */}
        <Card className="bg-white shadow-lg border border-gray-200 mb-8 rounded-xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900" style={{ 
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                  letterSpacing: '-0.025em'
                }}>
                  Introduction Video
                </h2>
                <p className="text-sm text-gray-600" style={{ 
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
                }}>
                  Upload a video to enable the "Introduction" button on your homepage (max: 100MB)
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="video" className="text-sm font-medium text-gray-700">Video File</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors relative">
                  <Input
                    id="video"
                    type="file"
                    accept="video/mp4,video/quicktime,video/avi,video/webm"
                    onChange={handleVideoSelect}
                    disabled={uploadingVideo}
                    className="cursor-pointer opacity-0 absolute inset-0 w-full h-full z-10"
                    data-testid="input-video"
                  />
                  <div className="space-y-2">
                    <svg className="w-8 h-8 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedVideo ? selectedVideo.name : 'Click to select a video file'}
                      </p>
                      {selectedVideo && (
                        <p className="text-xs text-gray-500 mt-1">
                          {formatFileSize(selectedVideo.size)}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">MP4, MOV, AVI, WebM • max 100MB</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="videoTitle">Video Title (Optional)</Label>
                <Input
                  id="videoTitle"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Enter a title for this video..."
                  disabled={uploadingVideo}
                  data-testid="input-video-title"
                />
              </div>

              <Button
                onClick={() => uploadVideoMutation.mutate()}
                disabled={!selectedVideo || uploadingVideo}
                className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-6 py-3 flex items-center gap-2 transition-all duration-200 hover:scale-105 font-medium"
                data-testid="button-upload-video"
              >
                {uploadingVideo ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload Video
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Uploaded Resumes Section */}
        <Card className="bg-white shadow-lg border border-gray-200 mb-8 rounded-xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900" style={{ 
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                  letterSpacing: '-0.025em'
                }}>
                  Uploaded Resumes
                </h2>
                <p className="text-sm text-gray-600" style={{ 
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
                }}>
                  {uploads.length === 1 ? '1 resume uploaded' : `${uploads.length} resumes uploaded`}
                </p>
              </div>
            </div>
            <div>
              {uploadsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading uploads...</p>
                </div>
              ) : uploads.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes uploaded yet</h3>
                  <p className="text-gray-600 max-w-sm mx-auto">Upload your first resume to get started. You can upload multiple versions and manage them here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {uploads.map((upload) => (
                    <div
                      key={upload.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                      data-testid={`upload-item-${upload.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg">
                          <FileText className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900" style={{ 
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
                          }}>
                            {upload.fileName}
                          </p>
                          <p className="text-sm text-gray-500" style={{ 
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
                          }}>
                            Resume
                          </p>
                          <p className="text-xs text-gray-400 mt-1" style={{ 
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
                          }}>
                            {formatFileSize(upload.fileSize)} • {upload.uploadedAt ? formatDate(upload.uploadedAt) : "Unknown date"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => previewResume(upload)}
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-gray-600"
                          data-testid={`button-preview-${upload.id}`}
                        >
                          Preview
                        </Button>
                        <Button
                          onClick={() => deleteMutation.mutate(upload.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          data-testid={`button-delete-${upload.id}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Uploaded Videos Section */}
        <Card className="bg-white shadow-lg border border-gray-200 rounded-xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900" style={{ 
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                  letterSpacing: '-0.025em'
                }}>
                  Uploaded Videos
                </h2>
                <p className="text-sm text-gray-600" style={{ 
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' 
                }}>
                  {videos.length === 1 ? '1 video uploaded' : `${videos.length} videos uploaded`}
                </p>
              </div>
            </div>
            <div>
              {videosLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading videos...</p>
                </div>
              ) : videos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No videos uploaded yet</h3>
                  <p className="text-gray-600 max-w-sm mx-auto">Upload an introduction video to enable the "Introduction" button on your homepage.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {videos.map((video: { id: string; title?: string; fileName?: string; fileSize?: number; uploadedAt?: string }) => (
                    <div
                      key={video.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                      data-testid={`video-item-${video.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg">
                          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {video.title || video.fileName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(video.fileSize ?? 0)} • {formatDate(video.uploadedAt ?? new Date())}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => previewVideo(video)}
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-gray-600"
                          data-testid={`button-preview-video-${video.id}`}
                        >
                          Preview
                        </Button>
                        <Button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this video?')) {
                              // Call delete video API
                              fetch(`/api/videos/${video.id}`, {
                                method: 'DELETE',
                              })
                              .then(response => {
                                if (response.ok) {
                                  toast({
                                    title: "Success",
                                    description: "Video deleted successfully",
                                  });
                                  queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
                                } else {
                                  toast({
                                    title: "Error",
                                    description: "Failed to delete video",
                                    variant: "destructive",
                                  });
                                }
                              })
                              .catch(error => {
                                console.error('Error deleting video:', error);
                                toast({
                                  title: "Error",
                                  description: "Failed to delete video",
                                  variant: "destructive",
                                });
                              });
                            }
                          }}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          data-testid={`button-delete-video-${video.id}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}