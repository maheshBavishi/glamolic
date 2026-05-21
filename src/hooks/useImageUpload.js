import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const validateImageFile = (file, maxMB = 7) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSizeInBytes = maxMB * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: "Only JPG, JPEG, PNG, and WebP formats are allowed",
      };
    }

    if (file.size > maxSizeInBytes) {
      return {
        valid: false,
        error: `Image size must not exceed ${maxMB}MB`,
      };
    }

    return { valid: true };
  };

  const uploadImage = async (file, userId, folder = "uploads", bucket = "generated-images") => {
    if (!file) {
      throw new Error("No file provided for upload.");
    }
    if (!userId) {
      throw new Error("You must be logged in to upload an image.");
    }
    
    setIsUploading(true);
    try {
      const fileExt = file.name?.split(".").pop() || "png";
      const fileName = `${userId}/${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file);
      
      if (uploadError) {
        throw new Error("Failed to upload image: " + uploadError.message);
      }
      
      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
      return publicUrlData.publicUrl;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, validateImageFile, isUploading };
};
