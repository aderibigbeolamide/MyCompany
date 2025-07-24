import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, ZoomIn, Download, ExternalLink } from "lucide-react";

interface MediaItem {
  url: string;
  type: 'image' | 'video';
  name?: string;
  width?: number;
  height?: number;
  duration?: number;
  format?: string;
  publicId?: string;
}

interface ImageGalleryProps {
  media: MediaItem[];
  onRemove?: (index: number) => void;
  onInsert?: (item: MediaItem) => void;
  className?: string;
}

export function ImageGallery({ media, onRemove, onInsert, className = '' }: ImageGalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const openPreview = (item: MediaItem) => {
    setSelectedMedia(item);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setSelectedMedia(null);
    setIsPreviewOpen(false);
  };

  if (media.length === 0) {
    return null;
  }

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        <h4 className="text-sm font-medium">Uploaded Media ({media.length})</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {media.map((item, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <CardContent className="p-0">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.name || `Image ${index + 1}`}
                    className="w-full h-32 object-cover cursor-pointer"
                    onClick={() => openPreview(item)}
                  />
                ) : (
                  <div className="relative">
                    <video
                      src={item.url}
                      className="w-full h-32 object-cover cursor-pointer"
                      onClick={() => openPreview(item)}
                      muted
                      preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                      <div className="w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[6px] border-l-black border-y-[4px] border-y-transparent ml-1"></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => openPreview(item)}
                    >
                      <ZoomIn className="h-3 w-3" />
                    </Button>
                    {onInsert && (
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => onInsert(item)}
                      >
                        Insert
                      </Button>
                    )}
                    {onRemove && (
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => onRemove(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Media info */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="truncate">{item.format?.toUpperCase()}</span>
                    {item.type === 'image' && item.width && item.height && (
                      <span>{item.width} × {item.height}</span>
                    )}
                    {item.type === 'video' && item.duration && (
                      <span>{Math.round(item.duration)}s</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedMedia?.name || 'Media Preview'}</span>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => selectedMedia && window.open(selectedMedia.url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (selectedMedia) {
                      const link = document.createElement('a');
                      link.href = selectedMedia.url;
                      link.download = selectedMedia.name || 'media';
                      link.click();
                    }
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-4">
            {selectedMedia?.type === 'image' ? (
              <img
                src={selectedMedia.url}
                alt={selectedMedia.name || 'Preview'}
                className="max-w-full max-h-[70vh] object-contain"
              />
            ) : selectedMedia?.type === 'video' ? (
              <video
                src={selectedMedia.url}
                controls
                className="max-w-full max-h-[70vh]"
                autoPlay
              />
            ) : null}
          </div>
          {selectedMedia && (
            <div className="px-4 pb-4 text-sm text-gray-600 space-y-1">
              <div className="grid grid-cols-2 gap-4">
                <div>Format: {selectedMedia.format?.toUpperCase()}</div>
                {selectedMedia.width && selectedMedia.height && (
                  <div>Dimensions: {selectedMedia.width} × {selectedMedia.height}</div>
                )}
                {selectedMedia.duration && (
                  <div>Duration: {Math.round(selectedMedia.duration)} seconds</div>
                )}
                <div>Type: {selectedMedia.type}</div>
              </div>
              <div className="mt-2">
                <strong>URL:</strong> 
                <code className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded break-all">
                  {selectedMedia.url}
                </code>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}