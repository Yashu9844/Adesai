import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryService = {
  /**
   * Method 1: Upload an image file (Buffer) directly from server storage/memory
   */
  async uploadImageBuffer(fileBuffer: Buffer, folder: string = 'rentals'): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) reject(error);
          else resolve(result?.secure_url || '');
        }
      );
      uploadStream.end(fileBuffer);
    });
  },

  /**
   * Method 2: Upload a base64 encoded string from PWA Camera Capture or File Input 
   */
  async uploadBase64Image(base64Image: string, folder: string = 'rentals'): Promise<string> {
    try {
      // Base64 format e.g. "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
      const result = await cloudinary.uploader.upload(base64Image, {
        folder,
        // Optional optimizations for mobile uploads
        transformation: [
          { width: 1000, height: 1000, crop: 'fill', gravity: 'auto' },
          { quality: 'auto' },
          { fetch_format: 'auto' },
        ],
      });
      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary base64 upload error:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  },
};
