
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import type { Recipe, Comment, User } from '../types';
import { getRecipes as apiGetRecipes, getRecipe as apiGetRecipe, createRecipe as apiCreateRecipe, updateRecipe as apiUpdateRecipe, deleteRecipe as apiDeleteRecipe, addComment as apiAddComment, addRating as apiAddRating } from '../services/api';
import { MOCK_USER } from '../constants';

interface RecipeContextType {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  currentUser: User;
  favorites: string[];
  getRecipe: (id: string) => Promise<Recipe | undefined>;
  addRecipe: (recipe: Omit<Recipe, 'id' | 'authorId' | 'authorName' | 'createdAt' | 'comments' | 'ratings'>) => Promise<Recipe | undefined>;
  editRecipe: (id: string, recipe: Partial<Recipe>) => Promise<Recipe | undefined>;
  removeRecipe: (id: string) => Promise<void>;
  postComment: (recipeId: string, text: string) => Promise<Comment | undefined>;
  rateRecipe: (recipeId: string, value: number) => Promise<void>;
  toggleFavorite: (recipeId: string) => void;
  isFavorite: (recipeId: string) => boolean;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const savedFavorites = localStorage.getItem('recipeFavorites');
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch (e) {
      console.error('Failed to parse favorites from localStorage', e);
      return [];
    }
  });

  const currentUser = MOCK_USER;

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGetRecipes();
      setRecipes(data);
    } catch (err) {
      setError('Failed to fetch recipes.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem('recipeFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const getRecipe = async (id: string) => {
    return await apiGetRecipe(id);
  };

  const addRecipe = async (recipeData: Omit<Recipe, 'id' | 'authorId' | 'authorName' | 'createdAt' | 'comments' | 'ratings'>) => {
    const newRecipe = await apiCreateRecipe({ ...recipeData, authorId: currentUser.id, authorName: currentUser.name });
    if (newRecipe) {
      setRecipes(prev => [...prev, newRecipe]);
      return newRecipe;
    }
  };

  const editRecipe = async (id: string, recipeUpdate: Partial<Recipe>) => {
    const updatedRecipe = await apiUpdateRecipe(id, recipeUpdate);
    if (updatedRecipe) {
      setRecipes(prev => prev.map(r => r.id === id ? updatedRecipe : r));
      return updatedRecipe;
    }
  };

  const removeRecipe = async (id: string) => {
    await apiDeleteRecipe(id);
    setRecipes(prev => prev.filter(r => r.id !== id));
  };
  
  const postComment = async (recipeId: string, text: string) => {
    const newComment = await apiAddComment(recipeId, { authorId: currentUser.id, authorName: currentUser.name, text });
    if (newComment) {
      setRecipes(prev => prev.map(r => r.id === recipeId ? { ...r, comments: [...r.comments, newComment] } : r));
      return newComment;
    }
  };

  const rateRecipe = async (recipeId: string, value: number) => {
     const updatedRecipe = await apiAddRating(recipeId, { userId: currentUser.id, value });
     if(updatedRecipe) {
       setRecipes(prev => prev.map(r => r.id === recipeId ? updatedRecipe : r));
     }
  };

  const toggleFavorite = (recipeId: string) => {
    setFavorites(prev => {
      if (prev.includes(recipeId)) {
        return prev.filter(id => id !== recipeId);
      } else {
        return [...prev, recipeId];
      }
    });
  };

  const isFavorite = (recipeId: string) => favorites.includes(recipeId);

  return (
    <RecipeContext.Provider value={{ recipes, loading, error, currentUser, favorites, getRecipe, addRecipe, editRecipe, removeRecipe, postComment, rateRecipe, toggleFavorite, isFavorite }}>
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
};
