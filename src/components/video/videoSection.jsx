"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Upload, X, VideoIcon, Loader2, Play, Trash2 } from "lucide-react"
import useAccessToken from "@/hooks/useSession"
import { reelAPI } from "@/lib/api"

export default function VideoUploadSection({ product, onChange }) {
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [videoTitle, setVideoTitle] = useState("")
  const [videos, setVideos] = useState([])
  const [loadingVideos, setLoadingVideos] = useState(false)
  const [deletingVideo, setDeletingVideo] = useState(null)
  const { toast } = useToast()
  const { accessToken } = useAccessToken()

  // Fetch videos on component mount
  useEffect(() => {
    if (accessToken) {
      fetchVideos()
    }
  }, [accessToken])

  const fetchVideos = async () => {
    if (!accessToken) return

    setLoadingVideos(true)
    try {
      const response =    await reelAPI.getAll(accessToken)

    //   await fetch(`${process.env.NEXT_PUBLIC_API_URL}/video`, {
    //     method: "GET",
    //     headers: {
    //       "Authorization": `Bearer ${accessToken}`,
    //       "Content-Type": "application/json",
    //     },
    //   })

    console.log(response.data.data, "response from reelAPI.getAll")
      if (!response.data.success) {
        throw new Error(`Failed to fetch videos: ${response.statusText}`)
      }

      if (response.data.success && Array.isArray(response.data.data)) {
        setVideos(response.data.data)
      } else {
        setVideos([])
      }
    } catch (error) {
      console.error("Failed to fetch videos:", error)
      toast({
        title: "Failed to load videos",
        description: error.message || "Could not load existing videos.",
        variant: "destructive",
      })
    } finally {
      setLoadingVideos(false)
    }
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please select a video file (MP4, MOV, AVI, etc.).",
        variant: "destructive",
      })
      return
    }

    // Validate file size (10MB limit for videos)
    if (file.size >= 10 * 1024 * 1024 /* 10MB */) {
      toast({
        title: "File too large",
        description: "Please select a video smaller than 10MB.",
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)
    
    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleUpload = async () => {
    if (!selectedFile || !accessToken) return

    setUploadingVideo(true)

    try {
      // Step 1: Upload video to get CDN link
      const formData = new FormData()
      formData.append("media", selectedFile)

      const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload-media`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.message || uploadResponse.statusText}`)
      }

      const uploadResult = await uploadResponse.json()
      
      if (!uploadResult.success || !uploadResult.data?.url) {
        throw new Error("Upload response was not successful")
      }

      // Step 2: Save video URL to database
      const videoData = {
        video: uploadResult.data.url,
        title: videoTitle.trim() || `Video ${videos.length + 1}`,
        // You can add more fields here if needed
        duration: uploadResult.data.duration || null,
        size: uploadResult.data.bytes || selectedFile.size,
        format: uploadResult.data.format || selectedFile.type,
      }

      const saveResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/video`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(videoData),
      })

      if (!saveResponse.ok) {
        throw new Error(`Failed to save video: ${saveResponse.statusText}`)
      }

      const saveResult = await saveResponse.json()
      
      if (saveResult.success) {
        // Reset the file selection and title
        setSelectedFile(null)
        setPreviewUrl(null)
        setVideoTitle("")
        
        // Reset the file input /////
        const fileInput = document.getElementById('video-upload')
        if (fileInput) {
          fileInput.value = ''
        }

        // Refresh videos list ///
        await fetchVideos()

        toast({
          title: "Video uploaded",
          description: "Video has been successfully uploaded and saved.",
        })
      } else {
        throw new Error("Failed to save video to database")
      }
    } catch (error) {
      console.log("tttt", error)
      toast({
        title: "Upload failed",
        description: error.status || "Failed to upload video.",
        variant: "destructive",
      })
    } finally {
      setUploadingVideo(false)
    }
  }

  const clearSelection = () => {
    setSelectedFile(null)
    setVideoTitle("")
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    
    // Reset the file input
    const fileInput = document.getElementById('video-upload')
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const handleDeleteVideo = async (videoId) => {
    if (!accessToken || !videoId) return

    setDeletingVideo(videoId)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/video/${videoId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to delete video: ${response.statusText}`)
      }

      const result = await response.json()
      
      if (result.success) {
        // Refresh videos list
        await fetchVideos()

        toast({
          title: "Video deleted",
          description: "Video has been successfully deleted.",
        })
      } else {
        throw new Error("Failed to delete video")
      }
    } catch (error) {
      console.error("Video deletion failed:", error)
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete video.",
        variant: "destructive",
      })
    } finally {
      setDeletingVideo(null)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="text-[#BA8E49]">Product Videos</CardTitle>
        <CardDescription>Upload high-quality videos of your product</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Selection Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#BA8E49] transition-colors">
          <input
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
            id="video-upload"
            disabled={uploadingVideo}
          />
          
          {!selectedFile ? (
            <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center space-y-2">
              <Upload className="h-8 w-8 text-gray-400" />
              <div className="text-sm text-gray-600">
                <span className="font-medium text-[#BA8E49]">Click to select video</span>
              </div>
              <div className="text-xs text-gray-500">MP4, MOV, AVI less than 10MB</div>
            </label>
          ) : (
            <div className="space-y-4">
              {/* Preview of selected video */}
              {previewUrl && (
                <div className="relative inline-block">
                  <video
                    src={previewUrl}
                    controls
                    className="max-w-full max-h-32 rounded-lg object-cover"
                    style={{ maxWidth: '300px' }}
                  />
                  <button
                    onClick={clearSelection}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    disabled={uploadingVideo}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              
              <div className="text-sm text-gray-600">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              
              {/* Video Title Input */}
              <div className="space-y-2 text-left">
                <Label htmlFor="video-title" className="text-sm font-medium text-gray-700">
                  Video Title
                </Label>
                <Input
                  id="video-title"
                  type="text"
                  placeholder="e.g., Ruby 360° view, Sapphire clarity demo"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  disabled={uploadingVideo}
                  className="text-sm"
                />
                <p className="text-xs text-gray-500">
                  Optional: Give your video a descriptive title
                </p>
              </div>
              
              {/* Upload Button */}
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={handleUpload}
                  disabled={uploadingVideo || !accessToken}
                  className="bg-[#BA8E49] hover:bg-[#A67B3C] text-white"
                >
                  {uploadingVideo ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Video
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={clearSelection}
                  disabled={uploadingVideo}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Uploaded Videos Display */}
        {loadingVideos ? (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-spin" />
            <p className="text-sm text-gray-500">Loading videos...</p>
          </div>
        ) : videos.length > 0 ? (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">
              Uploaded Videos ({videos.length})
            </h4>
            <div className="space-y-3">
              {videos.map((video) => (
                <div key={video._id} className="relative group border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Play className="h-6 w-6 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {video.title || 'Untitled Video'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {video.format && `${video.format.toUpperCase()} • `}
                        {video.size && formatFileSize(video.size)}
                      </p>
                      <a
                        href={video.video}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#BA8E49] hover:underline inline-flex items-center mt-1"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        View Video
                      </a>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteVideo(video._id)}
                      disabled={deletingVideo === video._id}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      {deletingVideo === video._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          !selectedFile && (
            <div className="text-center py-8">
              <VideoIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No videos uploaded yet</p>
            </div>
          )
        )}
      </CardContent>
    </Card>
  )
}