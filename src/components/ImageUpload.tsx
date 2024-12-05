"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCamera, FaSpinner, FaCheck, FaTimes } from "react-icons/fa";

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  defaultImage?: string;
}

export default function ImageUpload({
  onImageUpload,
  defaultImage,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setError(null);
    setIsUploading(true);

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      setIsUploading(false);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onImageUpload(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setPreview(null);
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
          <img
            src={preview}
            alt="Avatar preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <FaCamera className="text-2xl text-gray-400 group-hover:text-gray-300 transition-colors" />
          </div>
        )}

        {/* Upload Overlay */}
        <motion.div
          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 
          group-hover:opacity-100 transition-opacity"
        >
          <span className="text-white text-sm">Change Photo</span>
        </motion.div>
      </div>

      {/* Status Indicators */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full 
            flex items-center justify-center"
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
            text-sm px-3 py-1 rounded-lg whitespace-nowrap flex items-center gap-2"
          >
            <FaTimes />
            {error}
          </motion.div>
        )}

        {!isUploading && preview && !error && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full 
            flex items-center justify-center"
          >
            <FaCheck className="text-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
