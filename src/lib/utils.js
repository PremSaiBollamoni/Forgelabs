import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getDirectImageUrl(url) {
  if (!url) return '';
  
  // Google Drive conversion
  if (url.includes('drive.google.com')) {
    // Extract ID from various GDrive URL formats
    const match = url.match(/(?:\/d\/|id=)([\w-]+)/);
    const fileId = match ? match[1] : null;
    
    if (fileId) {
      // thumbnail endpoint is much more reliable for direct embedding than uc?export=view
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
    }
  }
  
  return url;
}
