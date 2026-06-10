// components/PropertyImage.tsx
"use client";
import { getFileBlob } from "@/actions/files/get-file-blob.action";
import { getMediaAsBlobAction } from "@/actions/media/get-media.actions";
import { Media } from "@/schemas/global/media.schema";
import { Image } from "lucide-react";
import React, { useEffect, useState } from "react";

interface PropertyImageProps {
  image: Media | null;
  className?: string;
}

export function ImageFetcher({ image, className = "h-8 w-8" }: PropertyImageProps) {
  const [fetchedImage, setFetchedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadImage() {
      try {
        if (!image) return;
        setLoading(true);
        const img = await getMediaAsBlobAction(image);
        setLoading(false);
        if (img) {
          const binaryString = window.atob(img.base64);
          const bytes = new Uint8Array(binaryString.length);

          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          setFetchedImage(new File([bytes], img.name + "#" + img.uuid, { type: img.mimeType }));
        }
      } catch (err) {
        setLoading(false);
        setError(true);
        console.error("Failed to load image:", err);
      }
    }

    loadImage();
  }, [image]);

  if (loading) {
    return <div className={`${className} bg-gray-200 rounded animate-pulse`} />;
  }

  if (!image || error || !fetchedImage) {
    return <Image className={`${className} text-gray-400`} />;
  }

  return <img src={URL.createObjectURL(fetchedImage)} alt="Property" className={`${className} object-cover rounded`} />;
}
