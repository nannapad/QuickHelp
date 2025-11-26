// File upload utilities with validation and optimization
import { useState } from "react";

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export const ALLOWED_FILE_TYPES = [...ALLOWED_IMAGE_TYPES, "application/pdf"];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

export const validateFile = (
  file,
  allowedTypes = ALLOWED_FILE_TYPES,
  maxSize = MAX_FILE_SIZE
) => {
  const errors = [];

  if (!file) {
    errors.push("No file selected");
    return { valid: false, errors };
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push(
      `File type not allowed. Allowed types: ${allowedTypes.join(", ")}`
    );
  }

  if (file.size > maxSize) {
    errors.push(
      `File too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const compressImage = (
  file,
  maxWidth = 800,
  maxHeight = 600,
  quality = 0.8
) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    let objectUrl = null;

    img.onload = () => {
      // Revoke the object URL after loading
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }

      // Calculate new dimensions
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Create new file with same name and type
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error("Canvas compression failed"));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      reject(new Error("Image loading failed"));
    };

    objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;
  });
};

export const createFileUrl = (file) => {
  if (!file) return null;
  // Use data URI instead of blob URL for persistence
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const createBlobUrl = (file) => {
  // Only use this for temporary previews that won't be persisted
  if (!file) return null;
  return URL.createObjectURL(file);
};

export const revokeFileUrl = (url) => {
  // Only revoke blob URLs, not data URIs
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
};

export const uploadFile = async (file, onProgress) => {
  // In a real application, this would upload to a server
  // For demo purposes, we'll simulate an upload and return a data URI
  return new Promise((resolve, reject) => {
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (onProgress) onProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);

        // Convert file to data URI instead of blob URL
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            url: reader.result, // data URI instead of blob URL
            name: file.name,
            size: file.size,
            type: file.type,
          });
        };
        reader.onerror = () => reject(new Error("File read failed"));
        reader.readAsDataURL(file);
      }
    }, 100);

    // Simulate potential upload failure
    if (Math.random() < 0.05) {
      // 5% chance of failure
      clearInterval(interval);
      reject(new Error("Upload failed"));
    }
  });
};

// Hook for file upload with state management
export const useFileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadErrors, setUploadErrors] = useState({});

  const handleFileUpload = async (file, fileId = Date.now().toString()) => {
    try {
      setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));
      setUploadErrors((prev) => ({ ...prev, [fileId]: null }));

      const result = await uploadFile(file, (progress) => {
        setUploadProgress((prev) => ({ ...prev, [fileId]: progress }));
      });

      setUploadProgress((prev) => ({ ...prev, [fileId]: 100 }));
      return result;
    } catch (error) {
      setUploadErrors((prev) => ({ ...prev, [fileId]: error.message }));
      setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));
      throw error;
    }
  };

  return {
    uploadFile: handleFileUpload,
    uploadProgress,
    uploadErrors,
  };
};
