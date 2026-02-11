"use client";

import Image from "next/image";

interface TechnicianAvatarProps {
  src?: string;
  alt: string;
  size?: number; // Ukuran dalam pixel (default 128)
}

export function TechnicianAvatar({ src, alt, size = 128 }: TechnicianAvatarProps) {
  return (
    <div 
      className="relative flex items-center justify-center mb-3 overflow-hidden rounded-full border-4 border-[#007BFF] bg-white shadow-md"
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 128px"
        />
      ) : (
        /* Placeholder jika gambar tidak ada */
        <div className="flex h-full w-full items-center justify-center bg-gray-100">
          <svg
            className="h-1/2 w-1/2 text-gray-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
      )}
    </div>
  );
}