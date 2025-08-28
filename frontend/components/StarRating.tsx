
import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRating?: (rating: number) => void;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRating, size = 20 }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className={`flex items-center ${onRating ? 'cursor-pointer' : ''}`}>
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <div key={index} onClick={() => onRating?.(starValue)} onMouseOver={() => {}} onMouseLeave={() => {}}>
            <Star
              size={size}
              className={`
                ${starValue <= rating ? 'text-yellow-400 fill-current' : 'text-slate-300'}
                ${onRating ? 'hover:text-yellow-400 hover:scale-110 transition-transform' : ''}
              `}
            />
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
