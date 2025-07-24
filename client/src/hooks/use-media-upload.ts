import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface MediaUploadResult {
  url: string;
  publicId: string;
  type: 'image' | 'video';
  width?: number;
  height?: number;
  duration?: number;
  format: string;
  thumbnail?: string;
}

export function useMediaUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const uploadMedia = async (
    file: File,
    options: {
      folder?: string;
      onProgress?: (progress: number) => void;
    } = {}
  ): Promise<MediaUploadResult> => {
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

      const response = await new Promise<MediaUploadResult>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            setUploadProgress(percentComplete);
            options.onProgress?.(percentComplete);
          }
        });

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

        xhr.open('POST', endpoint);
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
        xhr.timeout = 300000; // 5 minutes timeout
        xhr.send(formData);
      });

      toast({
        title: "Upload successful",
        description: `${isImage ? 'Image' : 'Video'} uploaded successfully`
      });

      return response;
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteMedia = async (publicId: string, resourceType: 'image' | 'video' = 'image') => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/upload/${publicId.replace(/\//g, '-')}?resourceType=${resourceType}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete media');
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to delete media');
      }

      toast({
        title: "Media deleted",
        description: "Media file has been removed successfully"
      });

    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Failed to delete media",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    uploadMedia,
    deleteMedia,
    isUploading,
    uploadProgress
  };
}