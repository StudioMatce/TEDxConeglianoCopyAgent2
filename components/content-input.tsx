"use client";

import { useRef } from "react";
import Image from "next/image";

interface ContentInputProps {
  value: string;
  onChange: (value: string) => void;
  imageData: string | null;
  onImageChange: (data: string | null) => void;
}

export function ContentInput({ value, onChange, imageData, onImageChange }: ContentInputProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      onImageChange(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <label className="block text-[10px] font-semibold text-[#999] tracking-[0.06em] uppercase mb-2">
        Contenuto
      </label>
      <textarea
        placeholder="es. Annuncio nuovo speaker, lancio biglietti, dietro le quinte dell'evento..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full text-[13px] text-[#333] resize-none outline-none"
        style={{
          background: "#fafaf9",
          border: "1px solid #e8e8e6",
          borderRadius: "6px",
          padding: "10px 12px",
          lineHeight: 1.65,
          transition: "border-color 0.15s",
        }}
      />

      {/* Image upload */}
      <div className="mt-3">
        <label className="block text-[10px] font-semibold text-[#999] tracking-[0.06em] uppercase mb-2">
          Immagine del post
        </label>

        {imageData ? (
          <div className="relative">
            <div
              className="relative w-full rounded-md overflow-hidden"
              style={{ border: "1px solid #e8e8e6", maxHeight: "160px" }}
            >
              <Image
                src={imageData}
                alt="Post"
                width={260}
                height={160}
                className="w-full h-auto object-cover"
                style={{ maxHeight: "160px" }}
              />
            </div>
            <button
              type="button"
              onClick={() => onImageChange(null)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs cursor-pointer"
              style={{ background: "rgba(0,0,0,0.5)" }}
            >
              ✕
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="flex flex-col items-center justify-center gap-1.5 py-5 rounded-md cursor-pointer transition-colors hover:border-[#aaa]"
            style={{
              background: "#fafaf9",
              border: "1.5px dashed #ddd",
              borderRadius: "6px",
            }}
          >
            <span className="text-[#bbb] text-lg">↑</span>
            <span className="text-[11px] text-[#aaa]">
              Carica immagine o trascina qui
            </span>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
