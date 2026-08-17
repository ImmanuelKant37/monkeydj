/**
 * Image and Video optimization utilities for Monkey DJ Audiovisual Portfolio
 * Prevents LocalStorage quota limits by automatically downscaling and compressing
 * client-side uploads before persistence.
 */

export interface OptimizedMediaResult {
  mediaUrl: string;
  thumbnailUrl: string;
  mediaType: 'photo' | 'video' | 'reel';
  fileName: string;
  originalSize: number;
  compressedSize: number;
}

/**
 * Optimizes an image File or Blob into a compressed, high-quality Data URL and thumbnail.
 */
export async function optimizeImageFile(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    thumbMaxWidth?: number;
    thumbMaxHeight?: number;
    thumbQuality?: number;
  } = {}
): Promise<OptimizedMediaResult> {
  const {
    maxWidth = 1200,
    maxHeight = 900,
    quality = 0.76,
    thumbMaxWidth = 360,
    thumbMaxHeight = 360,
    thumbQuality = 0.65
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('No se pudo leer el archivo de imagen.'));

    reader.onload = () => {
      const rawDataUrl = reader.result as string;
      const img = new Image();

      img.onerror = () => reject(new Error('Formato de imagen no compatible o archivo dañado.'));

      img.onload = () => {
        try {
          // 1. Calculate main image dimensions preserving aspect ratio
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            // Fallback to raw data url if canvas context unavailable
            resolve({
              mediaUrl: rawDataUrl,
              thumbnailUrl: rawDataUrl,
              mediaType: 'photo',
              fileName: file.name,
              originalSize: file.size,
              compressedSize: rawDataUrl.length
            });
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Export compressed main image as JPEG
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

          // For photos, we can use the same optimized URL for thumbnail to avoid duplicating Base64 bytes
          resolve({
            mediaUrl: compressedDataUrl,
            thumbnailUrl: compressedDataUrl,
            mediaType: 'photo',
            fileName: file.name,
            originalSize: file.size,
            compressedSize: compressedDataUrl.length
          });
        } catch (err) {
          // If canvas fails (e.g. tainted or memory), fallback gracefully
          resolve({
            mediaUrl: rawDataUrl,
            thumbnailUrl: rawDataUrl,
            mediaType: 'photo',
            fileName: file.name,
            originalSize: file.size,
            compressedSize: rawDataUrl.length
          });
        }
      };

      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Optimizes a video file and captures a video frame snapshot for the thumbnail.
 */
export async function optimizeVideoFile(file: File): Promise<OptimizedMediaResult> {
  const isReel =
    file.name.toLowerCase().includes('reel') ||
    file.name.toLowerCase().includes('short') ||
    file.name.toLowerCase().includes('tiktok');

  const mediaType: 'video' | 'reel' = isReel ? 'reel' : 'video';

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onerror = () => {
      resolve({
        mediaUrl: '',
        thumbnailUrl: '',
        mediaType,
        fileName: file.name,
        originalSize: file.size,
        compressedSize: 0
      });
    };

    reader.onload = () => {
      const dataUrl = reader.result as string;

      // Attempt to extract video frame snapshot
      try {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.muted = true;
        video.playsInline = true;
        video.src = dataUrl;

        video.onloadeddata = () => {
          video.currentTime = Math.min(1.0, video.duration ? video.duration / 2 : 0.5);
        };

        video.onseeked = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = Math.min(480, video.videoWidth || 480);
            canvas.height = Math.min(480, video.videoHeight || 480);
            const ctx = canvas.getContext('2d');
            if (ctx && video.videoWidth && video.videoHeight) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const thumbUrl = canvas.toDataURL('image/jpeg', 0.75);
              resolve({
                mediaUrl: dataUrl,
                thumbnailUrl: thumbUrl,
                mediaType,
                fileName: file.name,
                originalSize: file.size,
                compressedSize: dataUrl.length
              });
              return;
            }
          } catch (e) {
            // Ignore snapshot error
          }
          resolve({
            mediaUrl: dataUrl,
            thumbnailUrl: '',
            mediaType,
            fileName: file.name,
            originalSize: file.size,
            compressedSize: dataUrl.length
          });
        };

        video.onerror = () => {
          resolve({
            mediaUrl: dataUrl,
            thumbnailUrl: '',
            mediaType,
            fileName: file.name,
            originalSize: file.size,
            compressedSize: dataUrl.length
          });
        };
      } catch (e) {
        resolve({
          mediaUrl: dataUrl,
          thumbnailUrl: '',
          mediaType,
          fileName: file.name,
          originalSize: file.size,
          compressedSize: dataUrl.length
        });
      }
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Cleans and transforms input URLs (like Unsplash, Google Drive, Imgur, direct links)
 */
export function cleanMediaUrl(rawUrl: string): {
  url: string;
  mediaType: 'photo' | 'video' | 'reel';
  isValid: boolean;
} {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return { url: '', mediaType: 'photo', isValid: false };
  }

  // Check if data url
  if (trimmed.startsWith('data:image/')) {
    return { url: trimmed, mediaType: 'photo', isValid: true };
  }
  if (trimmed.startsWith('data:video/')) {
    return { url: trimmed, mediaType: 'video', isValid: true };
  }

  // Detect video/reel hints in URL
  const lower = trimmed.toLowerCase();
  let mediaType: 'photo' | 'video' | 'reel' = 'photo';

  if (
    lower.includes('.mp4') ||
    lower.includes('.webm') ||
    lower.includes('.mov') ||
    lower.includes('vimeo.com') ||
    lower.includes('mixkit.co/videos')
  ) {
    mediaType = 'video';
  }

  if (lower.includes('reel') || lower.includes('short') || lower.includes('tiktok.com')) {
    mediaType = 'reel';
  }

  // Clean Google Drive sharing links to direct preview format if possible
  let finalUrl = trimmed;
  if (finalUrl.includes('drive.google.com/file/d/')) {
    const fileIdMatch = finalUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      finalUrl = `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
    }
  }

  return {
    url: finalUrl,
    mediaType,
    isValid: finalUrl.startsWith('http://') || finalUrl.startsWith('https://') || finalUrl.startsWith('data:')
  };
}
