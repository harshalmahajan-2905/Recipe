
import React from 'react';
import { Link } from 'react-router-dom';
import type { Recipe } from '../types';
import StarRating from './StarRating';
import { Heart } from 'lucide-react';
import { useRecipes } from '../contexts/RecipeContext';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { toggleFavorite, isFavorite } = useRecipes();
  const avgRating = recipe.ratings.length > 0
    ? recipe.ratings.reduce((acc, r) => acc + r.value, 0) / recipe.ratings.length
    : 0;
  
  const favorite = isFavorite(recipe.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(recipe.id);
  };

  return (
    <Link to={`/recipe/${recipe.id}`} className="block group bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
      <div className="relative">
        <img className="w-full h-48 object-cover" src={recipe.imageUrl} alt={recipe.title} />
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 p-2 bg-white/70 rounded-full text-red-500 hover:bg-white transition-colors"
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`h-6 w-6 ${favorite ? 'fill-current' : ''}`} />
        </button>
      </div>
      <div className="p-4">
        <span className="inline-block bg-primary/20 text-primary text-xs font-semibold px-2 py-1 rounded-full uppercase">{recipe.category}</span>
        <h3 className="mt-2 text-lg font-semibold text-dark group-hover:text-primary transition-colors">{recipe.title}</h3>
        <p className="mt-1 text-sm text-slate-600 line-clamp-2">{recipe.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <StarRating rating={avgRating} />
          <span className="text-xs text-slate-500">{recipe.ratings.length} review(s)</span>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
