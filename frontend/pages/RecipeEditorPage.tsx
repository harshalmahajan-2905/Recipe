import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipes } from '../contexts/RecipeContext';
import type { Recipe } from '../types';
import { RECIPE_CATEGORIES } from '../constants';
import { Loader2 } from 'lucide-react';

const RecipeEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRecipe, addRecipe, editRecipe, currentUser } = useRecipes();

  const [recipe, setRecipe] = useState<Partial<Recipe>>({
    title: '',
    description: '',
    imageUrl: '',
    ingredients: [''],
    instructions: [''],
    category: RECIPE_CATEGORIES[1],
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      getRecipe(id!).then(data => {
        if (data && data.authorId === currentUser.id) {
          setRecipe(data);
        } else {
          // If recipe not found or user is not the author, redirect
          navigate('/');
        }
        setLoading(false);
      });
    }
  }, [id, isEditing, getRecipe, navigate, currentUser.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };
  
  const handleListChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, field: 'ingredients' | 'instructions') => {
    const newList = [...(recipe[field] || [])];
    newList[index] = e.target.value;
    setRecipe({ ...recipe, [field]: newList });
  };
  
  const addListItem = (field: 'ingredients' | 'instructions') => {
    setRecipe({ ...recipe, [field]: [...(recipe[field] || []), ''] });
  };
  
  const removeListItem = (index: number, field: 'ingredients' | 'instructions') => {
    const newList = [...(recipe[field] || [])];
    newList.splice(index, 1);
    setRecipe({ ...recipe, [field]: newList });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditing && recipe.id) {
        await editRecipe(recipe.id, recipe);
        navigate(`/recipe/${recipe.id}`);
      } else {
        const newRecipe = await addRecipe(recipe as Omit<Recipe, 'id' | 'authorId' | 'authorName' | 'createdAt' | 'comments' | 'ratings'>);
        if(newRecipe) navigate(`/recipe/${newRecipe.id}`);
      }
    } catch (error) {
      console.error("Failed to save recipe", error);
      alert("Failed to save recipe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
    </div>
  );

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">{isEditing ? 'Edit Recipe' : 'Add a New Recipe'}</h1>
      <form onSubmit={handleSubmit}>
        <FormField label="Recipe Title">
          <input type="text" name="title" value={recipe.title} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md" required />
        </FormField>
        <FormField label="Description">
          <textarea name="description" value={recipe.description} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md" rows={3} required />
        </FormField>
        <FormField label="Image URL">
          <input type="text" name="imageUrl" value={recipe.imageUrl} onChange={handleChange} placeholder="https://picsum.photos/800/600" className="w-full p-2 border border-slate-300 rounded-md" required />
        </FormField>
         <FormField label="Category">
          <select name="category" value={recipe.category} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md">
            {RECIPE_CATEGORIES.filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </FormField>
        
        {/* Ingredients */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Ingredients</h2>
          {recipe.ingredients?.map((ing, i) => (
             <div key={i} className="flex items-center gap-2 mb-2">
              <input type="text" value={ing} onChange={(e) => handleListChange(e, i, 'ingredients')} className="w-full p-2 border border-slate-300 rounded-md" required />
              <button type="button" onClick={() => removeListItem(i, 'ingredients')} className="p-2 text-red-500 hover:bg-red-100 rounded-full">&times;</button>
             </div>
          ))}
          <button type="button" onClick={() => addListItem('ingredients')} className="text-sm text-primary hover:underline">+ Add Ingredient</button>
        </div>

        {/* Instructions */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Instructions</h2>
          {recipe.instructions?.map((step, i) => (
             <div key={i} className="flex items-start gap-2 mb-2">
              <span className="pt-2 font-semibold text-slate-500">{i+1}.</span>
              <textarea value={step} onChange={(e) => handleListChange(e, i, 'instructions')} className="w-full p-2 border border-slate-300 rounded-md" rows={2} required />
              <button type="button" onClick={() => removeListItem(i, 'instructions')} className="p-2 text-red-500 hover:bg-red-100 rounded-full mt-1">&times;</button>
             </div>
          ))}
          <button type="button" onClick={() => addListItem('instructions')} className="text-sm text-primary hover:underline">+ Add Step</button>
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-primary text-white font-bold rounded-md hover:bg-orange-700 disabled:bg-slate-400 transition-colors">
          {isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Submit Recipe')}
        </button>
      </form>
    </div>
  );
};

export default RecipeEditorPage;
