"use client";

import { Camera, ImagePlus, X } from "lucide-react";
import { useState, useRef } from "react";
import Image from "next/image";

interface PhotoUploadProps {
  label: string;
  onPhotoSelect?: (file: File) => void;
}

export function PhotoUpload({ label, onPhotoSelect }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      if (onPhotoSelect) onPhotoSelect(file);
    }
  };

  const clearPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-700 ml-1">{label}</label>
      
      <div 
        onClick={() => inputRef.current?.click()}
        className={`relative w-48 aspect-square mx-auto rounded-[2rem] border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden group flex flex-col items-center justify-center
          ${preview 
            ? 'border-violet-200 bg-violet-50/30' 
            : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-violet-300'
          }`}
      >
        <input
          type="file"
          ref={inputRef}
          accept="image/*"
          capture="environment" // Hint to mobile browsers to open the back camera
          onChange={handleFileChange}
          className="hidden"
        />

        {preview ? (
           <>
            <Image src={preview} alt="Preview" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <p className="text-white text-sm font-medium flex items-center gap-2">
                 <Camera className="w-4 h-4" /> Retake Photo
               </p>
            </div>
            <button 
              onClick={clearPhoto}
              className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white p-1.5 rounded-full hover:bg-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
           </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-500 group-hover:text-violet-600 transition-colors">
            <div className="p-3 bg-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.04)] group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all">
              <ImagePlus className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium">Tap to take photo</span>
          </div>
        )}
      </div>
    </div>
  );
}
