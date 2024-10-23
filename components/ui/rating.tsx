"use client";

import { Star } from "lucide-react";
import { useState } from "react";

interface RatingProps {
  initialRating?: number;
  maxRating?: number;
  onChange?: (rating: number) => void;
}

export default function Rating({
  initialRating = 0,
  onChange,
  maxRating,
}: RatingProps = {}) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const maxRatingArray = Array.from(
    { length: maxRating ?? 5 },
    (_, i) => i + 1
  );

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    if (onChange) {
      onChange(newRating);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {maxRatingArray.map((star) => (
        <button
          key={star}
          className={`${
            (hover || rating) >= star ? "text-yellow-400" : "text-gray-300"
          }`}
          onClick={() => handleRatingChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}>
          <Star className="w-6 h-6 fill-current" />
        </button>
      ))}
    </div>
  );
}
