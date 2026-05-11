"use client";

import { useState } from "react";

const STAR_PATH =
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

function StarIcon({
  fill,
  size = 20,
}: {
  fill: "none" | "half" | "full";
  size?: number;
}) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className="absolute inset-0 text-gray-200"
      >
        <path d={STAR_PATH} fill="currentColor" />
      </svg>
      {fill !== "none" && (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className="absolute inset-0 text-yellow-400"
          style={{ clipPath: fill === "half" ? "inset(0 50% 0 0)" : undefined }}
        >
          <path d={STAR_PATH} fill="currentColor" />
        </svg>
      )}
    </div>
  );
}

export function StarDisplay({
  rating,
  size = 16,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((k) => (
        <StarIcon
          key={k}
          size={size}
          fill={rating >= k ? "full" : rating >= k - 0.5 ? "half" : "none"}
        />
      ))}
    </div>
  );
}

export function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const displayed = hover ?? value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((k) => (
        <div
          key={k}
          className="relative cursor-pointer"
          style={{ width: 32, height: 32 }}
          onMouseLeave={() => setHover(null)}
        >
          <StarIcon
            size={32}
            fill={
              displayed >= k ? "full" : displayed >= k - 0.5 ? "half" : "none"
            }
          />
          <div
            className="absolute left-0 top-0 h-full w-1/2"
            onMouseEnter={() => setHover(k - 0.5)}
            onClick={() => onChange(k - 0.5)}
          />
          <div
            className="absolute right-0 top-0 h-full w-1/2"
            onMouseEnter={() => setHover(k)}
            onClick={() => onChange(k)}
          />
        </div>
      ))}
      {displayed > 0 && (
        <span className="ml-1 text-sm font-medium text-slate-500">
          {displayed}/5
        </span>
      )}
    </div>
  );
}
