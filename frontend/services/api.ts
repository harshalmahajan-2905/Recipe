
import type { Recipe, Comment, Rating, RecipeFormData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to make API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  return handleResponse(response);
};

// Recipe API functions
export const getRecipes = async (filters?: {
  category?: string;
  search?: string;
  sort?: string;
}): Promise<Recipe[]> => {
  const params = new URLSearchParams();
  if (filters?.category && filters.category !== 'All') params.append('category', filters.category);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.sort) params.append('sort', filters.sort);

  const queryString = params.toString();
  const endpoint = queryString ? `/recipes?${queryString}` : '/recipes';
  
  return apiRequest(endpoint);
};

export const getRecipe = async (id: string): Promise<Recipe | undefined> => {
  try {
    return await apiRequest(`/recipes/${id}`);
  } catch (error) {
    console.error('Failed to fetch recipe:', error);
    return undefined;
  }
};

export const createRecipe = async (recipeData: RecipeFormData): Promise<Recipe> => {
  const formData = new FormData();
  
  // Add text fields
  formData.append('title', recipeData.title);
  formData.append('description', recipeData.description);
  formData.append('category', recipeData.category);
  
  // Add arrays
  recipeData.ingredients.forEach(ingredient => {
    formData.append('ingredients', ingredient);
  });
  
  recipeData.instructions.forEach(instruction => {
    formData.append('instructions', instruction);
  });
  
  // Add optional fields
  if (recipeData.prepTime) formData.append('prepTime', recipeData.prepTime.toString());
  if (recipeData.cookTime) formData.append('cookTime', recipeData.cookTime.toString());
  if (recipeData.servings) formData.append('servings', recipeData.servings.toString());
  if (recipeData.difficulty) formData.append('difficulty', recipeData.difficulty);
  if (recipeData.tags) {
    recipeData.tags.forEach(tag => {
      formData.append('tags', tag);
    });
  }
  
  // Add image file or URL
  if (recipeData.imageFile) {
    formData.append('image', recipeData.imageFile);
  } else if (recipeData.imageUrl) {
    formData.append('imageUrl', recipeData.imageUrl);
  }

  const url = `${API_BASE_URL}/recipes`;
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  return handleResponse(response);
};

export const updateRecipe = async (id: string, updateData: Partial<RecipeFormData>): Promise<Recipe | undefined> => {
  try {
    const formData = new FormData();
    
    // Add updated fields
    if (updateData.title) formData.append('title', updateData.title);
    if (updateData.description) formData.append('description', updateData.description);
    if (updateData.category) formData.append('category', updateData.category);
    
    if (updateData.ingredients) {
      updateData.ingredients.forEach(ingredient => {
        formData.append('ingredients', ingredient);
      });
    }
    
    if (updateData.instructions) {
      updateData.instructions.forEach(instruction => {
        formData.append('instructions', instruction);
      });
    }
    
    if (updateData.prepTime) formData.append('prepTime', updateData.prepTime.toString());
    if (updateData.cookTime) formData.append('cookTime', updateData.cookTime.toString());
    if (updateData.servings) formData.append('servings', updateData.servings.toString());
    if (updateData.difficulty) formData.append('difficulty', updateData.difficulty);
    if (updateData.tags) {
      updateData.tags.forEach(tag => {
        formData.append('tags', tag);
      });
    }
    
    if (updateData.imageFile) {
      formData.append('image', updateData.imageFile);
    } else if (updateData.imageUrl) {
      formData.append('imageUrl', updateData.imageUrl);
    }

    const url = `${API_BASE_URL}/recipes/${id}`;
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Failed to update recipe:', error);
    return undefined;
  }
};

export const deleteRecipe = async (id: string): Promise<{ success: boolean }> => {
  try {
    await apiRequest(`/recipes/${id}`, { method: 'DELETE' });
    return { success: true };
  } catch (error) {
    console.error('Failed to delete recipe:', error);
    return { success: false };
  }
};

export const addComment = async (recipeId: string, commentData: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment | undefined> => {
  try {
    return await apiRequest(`/recipes/${recipeId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text: commentData.text }),
    });
  } catch (error) {
    console.error('Failed to add comment:', error);
    return undefined;
  }
};

export const addRating = async (recipeId: string, ratingData: Rating): Promise<Recipe | undefined> => {
  try {
    return await apiRequest(`/recipes/${recipeId}/ratings`, {
      method: 'POST',
      body: JSON.stringify({ value: ratingData.value }),
    });
  } catch (error) {
    console.error('Failed to add rating:', error);
    return undefined;
  }
};

// User favorites (stored locally for now, can be moved to backend)
export const getFavorites = (): string[] => {
  try {
    const savedFavorites = localStorage.getItem('recipeFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  } catch (e) {
    console.error('Failed to parse favorites from localStorage', e);
    return [];
  }
};

export const saveFavorites = (favorites: string[]): void => {
  try {
    localStorage.setItem('recipeFavorites', JSON.stringify(favorites));
  } catch (e) {
    console.error('Failed to save favorites to localStorage', e);
  }
};
