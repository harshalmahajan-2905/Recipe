
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useRecipes } from '../contexts/RecipeContext';
import type { Recipe } from '../types';
import StarRating from '../components/StarRating';
import CommentSection from '../components/CommentSection';
import { Loader2, ChefHat, Edit, Trash2, CheckSquare, Square } from 'lucide-react';

const RecipeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRecipe, rateRecipe, currentUser, removeRecipe } = useRecipes();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedIngredients, setCheckedIngredients] = useState<boolean[]>([]);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;
      setLoading(true);
      const data = await getRecipe(id);
      if (data) {
        setRecipe(data);
        setCheckedIngredients(new Array(data.ingredients.length).fill(false));
      }
      setLoading(false);
    };
    fetchRecipe();
  }, [id, getRecipe]);

  const handleRating = async (value: number) => {
    if (!recipe) return;
    await rateRecipe(recipe.id, value);
    // Refetch to get updated ratings
    const updatedRecipe = await getRecipe(recipe.id);
    if(updatedRecipe) setRecipe(updatedRecipe);
  };
  
  const handleDelete = async () => {
    if (recipe && window.confirm('Are you sure you want to delete this recipe?')) {
      await removeRecipe(recipe.id);
      navigate('/');
    }
  };
  
  const toggleIngredient = (index: number) => {
    setCheckedIngredients(prev => {
      const newChecked = [...prev];
      newChecked[index] = !newChecked[index];
      return newChecked;
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  if (!recipe) {
    return <div className="text-center text-xl text-slate-600">Recipe not found.</div>;
  }

  const avgRating = recipe.ratings.length > 0 ? recipe.ratings.reduce((acc, r) => acc + r.value, 0) / recipe.ratings.length : 0;
  const userRating = recipe.ratings.find(r => r.userId === currentUser.id)?.value;
  const isAuthor = recipe.authorId === currentUser.id;

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="relative">
        <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-64 md:h-96 object-cover rounded-lg mb-4" />
        {isAuthor && (
          <div className="absolute top-4 right-4 flex gap-2">
            <Link to={`/edit/${recipe.id}`} className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-md">
              <Edit size={20} />
            </Link>
            <button onClick={handleDelete} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md">
              <Trash2 size={20} />
            </button>
          </div>
        )}
      </div>
      
      <h1 className="text-4xl font-bold text-dark mb-2">{recipe.title}</h1>
      <div className="flex items-center gap-2 text-slate-500 mb-4">
        <ChefHat size={18} />
        <span>By {recipe.authorName}</span>
        <span>&bull;</span>
        <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <StarRating rating={avgRating} />
        <span className="text-slate-600">({recipe.ratings.length} reviews)</span>
      </div>

      <p className="text-lg text-slate-700 mb-8">{recipe.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-primary pb-2">Ingredients</h2>
          <ul className="space-y-3">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex items-center gap-3 cursor-pointer" onClick={() => toggleIngredient(i)}>
                {checkedIngredients[i] ? <CheckSquare className="text-primary"/> : <Square className="text-slate-400"/>}
                <span className={`${checkedIngredients[i] ? 'line-through text-slate-500' : ''}`}>{ing}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-primary pb-2">Instructions</h2>
          <ol className="space-y-4 list-decimal list-inside">
            {recipe.instructions.map((step, i) => (
              <li key={i} className="text-slate-800 leading-relaxed">{step}</li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-8 border-t pt-6">
        <h3 className="text-xl font-semibold mb-2">Rate this recipe!</h3>
        <StarRating rating={userRating || 0} onRating={handleRating} size={28} />
      </div>

      <div className="border-t mt-8 pt-6">
        <CommentSection recipeId={recipe.id} comments={recipe.comments} />
      </div>
    </div>
  );
};

export default RecipeDetailPage;
