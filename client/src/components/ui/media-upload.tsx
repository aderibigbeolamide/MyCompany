import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Image, Video, FileText } from "lucide-react";

interface MediaUploadProps {
  onUpload: (result: UploadResult) => void;
  acceptedTypes?: 'image' | 'video' | 'both';
  maxSize?: number; // in MB
  className?: string;
}

interface UploadResult {
  url: string;
  publicId: string;
  type: 'image' | 'video';
  width?: number;
  height?: number;
  duration?: number;
  format: string;
  thumbnail?: string;
}

export function MediaUpload({ 
  onUpload, 
  acceptedTypes = 'both', 
  maxSize = 100,
  className = '' 
}: MediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getAcceptedFileTypes = () => {
    switch (acceptedTypes) {
      case 'image':
        return 'image/*';
      case 'video':
        return 'video/*';
      case 'both':
      default:
        return 'image/*,video/*';
    }
  };

  const validateFile = (file: File): boolean => {
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxSize}MB`,
        variant: "destructive"
      });
      return false;
    }

    // Check file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (acceptedTypes === 'image' && !isImage) {
      toast({
        title: "Invalid file type",
        description: "Only image files are allowed",
        variant: "destructive"
      });
      return false;
    }
    
    if (acceptedTypes === 'video' && !isVideo) {
      toast({
        title: "Invalid file type",
        description: "Only video files are allowed",
        variant: "destructive"
      });
      return false;
    }
    
    if (acceptedTypes === 'both' && !isImage && !isVideo) {
      toast({
        title: "Invalid file type",
        description: "Only image and video files are allowed",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const uploadFile = async (file: File) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      const isImage = file.type.startsWith('image/');
      
      if (isImage) {
        formData.append('image', file);
      } else {
        formData.append('video', file);
      }

      const endpoint = isImage ? '/api/upload/image' : '/api/upload/video';
      const token = localStorage.getItem('accessToken');

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(percentComplete);
        }
      });

      const uploadPromise = new Promise<UploadResult>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              resolve({
                url: response.data.url,
                publicId: response.data.publicId,
                type: isImage ? 'image' : 'video',
                width: response.data.width,
                height: response.data.height,
                duration: response.data.duration,
                format: response.data.format,
                thumbnail: response.data.thumbnail
              });
            } else {
              reject(new Error(response.message || 'Upload failed'));
            }
          } else {
            reject(new Error('Upload failed'));
          }
        };

        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.ontimeout = () => reject(new Error('Upload timeout'));
      });

      xhr.open('POST', endpoint);
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      xhr.timeout = 300000; // 5 minutes timeout
      xhr.send(formData);

      const result = await uploadPromise;
      
      toast({
        title: "Upload successful",
        description: `${isImage ? 'Image' : 'Video'} uploaded successfully`
      });
      
      onUpload(result);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const getIcon = () => {
    switch (acceptedTypes) {
      case 'image':
        return <Image className="w-8 h-8" />;
      case 'video':
        return <Video className="w-8 h-8" />;
      case 'both':
      default:
        return <Upload className="w-8 h-8" />;
    }
  };

  const getTypeText = () => {
    switch (acceptedTypes) {
      case 'image':
        return 'images';
      case 'video':
        return 'videos';
      case 'both':
      default:
        return 'images and videos';
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptedFileTypes()}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />
      
      <Card 
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-primary/50'
        } ${isUploading ? 'pointer-events-none' : ''}`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          {isUploading ? (
            <div className="w-full max-w-xs space-y-4">
              <div className="animate-spin">
                <Upload className="w-8 h-8 mx-auto text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Uploading...</p>
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-xs text-gray-500">
                  {Math.round(uploadProgress)}% complete
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="text-gray-400 mb-4">
                {getIcon()}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Drop {getTypeText()} here or click to browse
                </p>
                <p className="text-xs text-gray-500">
                  Max file size: {maxSize}MB
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface MediaPreviewProps {
  result: UploadResult;
  onRemove?: () => void;
  className?: string;
}

export function MediaPreview({ result, onRemove, className = '' }: MediaPreviewProps) {
  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <CardContent className="p-0">
        {result.type === 'image' ? (
          <img
            src={result.url}
            alt="Uploaded media"
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="relative">
            <video
              src={result.url}
              className="w-full h-48 object-cover"
              controls
              preload="metadata"
            />
            {result.thumbnail && (
              <img
                src={result.thumbnail}
                alt="Video thumbnail"
                className="absolute inset-0 w-full h-48 object-cover pointer-events-none"
              />
            )}
          </div>
        )}
        
        {onRemove && (
          <Button
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2"
            onClick={onRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
        
        <div className="p-3 bg-white border-t">
          <p className="text-xs text-gray-600 truncate">
            {result.url.split('/').pop()}
          </p>
          <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
            <span>{result.format.toUpperCase()}</span>
            {result.type === 'image' && result.width && result.height && (
              <span>{result.width} × {result.height}</span>
            )}
            {result.type === 'video' && result.duration && (
              <span>{Math.round(result.duration)}s</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}