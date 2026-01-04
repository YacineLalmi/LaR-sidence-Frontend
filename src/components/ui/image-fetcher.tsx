// components/PropertyImage.tsx
"use client";
import { getFileBlob } from "@/actions/files/get-file-blob.action";
import { Image } from "lucide-react";
import React, { useEffect, useState } from "react";

interface PropertyImageProps {
  imageId: string;
  className?: string;
}

export function ImageFetcher({ imageId, className = "h-8 w-8" }: PropertyImageProps) {
  const [imageBlob, setImageBlob] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadImage() {
      try {
        const blob = await getFileBlob(imageId);
        if (mounted && blob) {
          setImageBlob(blob);
        }
      } catch (err) {
        console.error("Failed to load image:", err);
        if (mounted) {
          setError(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadImage();

    return () => {
      mounted = false;
    };
  }, [imageId]);

  if (loading) {
    return <div className={`${className} bg-gray-200 rounded animate-pulse`} />;
  }

  if (error || !imageBlob) {
    return <Image className={`${className} text-gray-400`} />;
  }

  return (
    <img
      src={`data:image/jpeg;base64,${imageBlob}`}
      alt="Property"
      className={`${className} object-cover rounded`}
    />
  );
}