"use client";

import { Star } from "lucide-react";
import { useState } from "react";

interface RatingStarsProps {
  onRatingChange: (rating: number) => void;
}

export function RatingStars({ onRatingChange }: RatingStarsProps) {
  const [hover, setHover] = useState(0);
  const [selected, setSelected] = useState(0);

  const handleSelect = (index: number) => {
    setSelected(index);
    onRatingChange(index);
  };

  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => handleSelect(star)}
          className="transition-transform active:scale-90"
        >
          <Star
            size={48}
            className={`${
              star <= (hover || selected)
                ? "fill-yellow-400 text-black"
                : "text-black fill-transparent"
            } stroke-[1.5px] transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}