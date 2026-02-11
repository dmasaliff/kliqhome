"use client";

import { Star, StarHalf } from "lucide-react";

interface TechnicianRatingProps {
  rating: number;
  size?: number;
}

export function TechnicianRating({ rating, size = 24 }: TechnicianRatingProps) {
  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3, 4, 5].map((index) => {
        // Logika untuk menentukan apakah bintang penuh, setengah, atau kosong
        const isFull = index <= Math.floor(rating);
        const isHalf = !isFull && index <= Math.ceil(rating) && rating % 1 !== 0;

        return (
          <div key={index} className="relative">
            {/* Layer Bawah: Bintang Kosong (sebagai background) */}
            <Star
              size={size}
              className="text-gray-300 fill-transparent stroke-[1.5px]"
            />
            
            {/* Layer Atas: Sisi Berwarna */}
            <div className="absolute inset-0">
              {isFull ? (
                <Star
                  size={size}
                  className="fill-yellow-400 text-yellow-500 stroke-[1.5px]"
                />
              ) : isHalf ? (
                <StarHalf
                  size={size}
                  className="fill-yellow-400 text-yellow-500 stroke-[1.5px]"
                />
              ) : null}
            </div>
          </div>
        );
      })}
      {/* Opsional: Tampilkan angka rating di sebelah bintang */}
      <span className="ml-1 font-black text-gray-800" style={{ fontSize: size * 0.8 }}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
}