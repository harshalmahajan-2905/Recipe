
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthUser extends User {
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  text: string;
  createdAt: string;
}

export interface Rating {
  userId: string;
  value: number; // 1 to 5
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageFile?: File; // For file uploads
  ingredients: string[];
  instructions: string[];
  category: string;
  prepTime?: number; // in minutes
  cookTime?: number; // in minutes
  servings?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  updatedAt?: string;
  comments: Comment[];
  ratings: Rating[];
  tags?: string[];
}

export interface RecipeFormData {
  title: string;
  description: string;
  imageFile?: File;
  imageUrl?: string;
  ingredients: string[];
  instructions: string[];
  category: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  tags?: string[];
}
