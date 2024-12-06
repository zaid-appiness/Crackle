"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCamera, FaSpinner, FaCheck, FaTimes } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

interface ImageUploadProps {
  onUploadSuccess: (imageUrl: string) => void;
  defaultImage?: string;
  mode?: "signup" | "profile";
}

export default function ImageUpload({
  onUploadSuccess,
  defaultImage,
  mode = "profile",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Only check for user ID in profile mode
    if (mode === "profile" && !user?.id) {
      setError("Please login to update your profile image");
      return;
    }

    // Reset states
    setError(null);
    setIsUploading(true);

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      setIsUploading(false);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      setIsUploading(false);
      return;
    }

    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setPreview(reader.result);
            resolve(reader.result);
          } else {
            reject(new Error("Failed to read file"));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });

      if (mode === "signup") {
        // For signup, just pass the base64 string
        onUploadSuccess(base64);
      } else {
        // For profile update, send to API
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", user!.id);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Upload failed");
        }

        onUploadSuccess(data.user.image);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Upload failed");
      setPreview(defaultImage || null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative group">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        className="w-24 h-24 rounded-full relative overflow-hidden cursor-pointer
        border-4 border-gray-700 group-hover:border-blue-500 transition-colors"
      >
        {preview ? (
          <Image
            src={preview}
            alt="Avatar preview"
            className="w-full h-full object-cover"
            width={96}
            height={96}
            priority
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <FaCamera className="text-2xl text-gray-400 group-hover:text-gray-300 transition-colors" />
          </div>
        )}

        {/* Upload Overlay */}
        <div
          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 
          group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
        >
          {/* <span className="text-white text-sm font-medium px-2 py-1 bg-black/40 rounded-md">
            Change Photo
          </span> */}
        </div>
      </div>

      {/* Status Indicators */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full 
            flex items-center justify-center shadow-lg"
          >
            <FaSpinner className="text-white animate-spin" />
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-red-500 text-white 
            text-sm px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-2
            shadow-lg border border-red-400/20"
          >
            <FaTimes className="shrink-0" />
            <span className="text-xs font-medium">{error}</span>
          </motion.div>
        )}

        {!isUploading && preview && !error && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full 
            flex items-center justify-center shadow-lg"
          >
            <FaCheck className="text-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
