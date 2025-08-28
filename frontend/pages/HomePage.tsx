
import React, { useState, useMemo } from 'react';
import RecipeCard from '../components/RecipeCard';
import { useRecipes } from '../contexts/RecipeContext';
import { RECIPE_CATEGORIES } from '../constants';
import { Loader2 } from 'lucide-react';

const HomePage = () => {
  const { recipes, loading, error } = useRecipes();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredRecipes = useMemo(() => {
    if (selectedCategory === 'All') {
      return recipes;
    }
    return recipes.filter(recipe => recipe.category === selectedCategory);
  }, [recipes, selectedCategory]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-dark">Discover Delicious Recipes</h1>
        <p className="text-slate-600 mt-2">Find your next favorite meal from our community's collection.</p>
      </div>

      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {RECIPE_CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              selectedCategory === category
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRecipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
