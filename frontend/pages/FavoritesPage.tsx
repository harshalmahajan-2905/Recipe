
import React from 'react';
import { useRecipes } from '../contexts/RecipeContext';
import RecipeCard from '../components/RecipeCard';
import { Heart } from 'lucide-react';

const FavoritesPage = () => {
  const { recipes, favorites } = useRecipes();

  const favoriteRecipes = recipes.filter(recipe => favorites.includes(recipe.id));

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-dark flex items-center justify-center gap-3">
          <Heart className="text-red-500" size={36}/> My Favorite Recipes
        </h1>
        <p className="text-slate-600 mt-2">Your hand-picked collection of delicious meals.</p>
      </div>

      {favoriteRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
            <Heart className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-2 text-xl font-semibold text-gray-900">No favorites yet!</h3>
            <p className="mt-1 text-slate-500">Click the heart icon on any recipe to save it here.</p>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
