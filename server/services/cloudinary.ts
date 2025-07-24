import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { Request } from 'express';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Allow images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'));
    }
  },
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width?: number;
  height?: number;
  format: string;
  resource_type: 'image' | 'video';
  duration?: number;
}

export class CloudinaryService {
  /**
   * Upload an image to Cloudinary
   */
  static async uploadImage(
    buffer: Buffer,
    options: {
      folder?: string;
      public_id?: string;
      transformation?: any[];
    } = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: options.folder || 'technurture',
            public_id: options.public_id,
            transformation: options.transformation || [
              { quality: 'auto' },
              { fetch_format: 'auto' }
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        resource_type: 'image',
      };
    } catch (error) {
      console.error('Cloudinary image upload error:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  }

  /**
   * Upload a video to Cloudinary
   */
  static async uploadVideo(
    buffer: Buffer,
    options: {
      folder?: string;
      public_id?: string;
      transformation?: any[];
    } = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'video',
            folder: options.folder || 'technurture/videos',
            public_id: options.public_id,
            transformation: options.transformation || [
              { quality: 'auto' }
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        resource_type: 'video',
        duration: result.duration,
      };
    } catch (error) {
      console.error('Cloudinary video upload error:', error);
      throw new Error('Failed to upload video to Cloudinary');
    }
  }

  /**
   * Delete a media file from Cloudinary
   */
  static async deleteMedia(publicId: string, resourceType: 'image' | 'video' = 'image'): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error('Failed to delete media from Cloudinary');
    }
  }

  /**
   * Generate a signed upload URL for direct client uploads
   */
  static generateUploadSignature(
    timestamp: number,
    publicId?: string,
    folder?: string,
    resourceType: 'image' | 'video' = 'image'
  ): { signature: string; timestamp: number; api_key: string } {
    const params: any = {
      timestamp,
      resource_type: resourceType,
      folder: folder || 'technurture',
    };

    if (publicId) {
      params.public_id = publicId;
    }

    const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET!);

    return {
      signature,
      timestamp,
      api_key: process.env.CLOUDINARY_API_KEY!,
    };
  }

  /**
   * Get optimized image URL with transformations
   */
  static getOptimizedImageUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string | number;
      format?: string;
    } = {}
  ): string {
    return cloudinary.url(publicId, {
      ...options,
      secure: true,
      quality: options.quality || 'auto',
      fetch_format: options.format || 'auto',
    });
  }

  /**
   * Get video thumbnail URL
   */
  static getVideoThumbnail(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      start_offset?: string;
    } = {}
  ): string {
    return cloudinary.url(publicId, {
      resource_type: 'video',
      secure: true,
      format: 'jpg',
      start_offset: options.start_offset || '0',
      width: options.width || 400,
      height: options.height || 300,
      crop: 'fill',
    });
  }
}

export default CloudinaryService;