
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import RecipeEditorPage from './pages/RecipeEditorPage';
import FavoritesPage from './pages/FavoritesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider } from './contexts/AuthContext';
import { RecipeProvider } from './contexts/RecipeContext';

function App() {
  return (
    <AuthProvider>
      <RecipeProvider>
        <div className="min-h-screen bg-slate-100 font-sans">
          <Header />
          <main className="container mx-auto p-4 md:p-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/recipe/:id" element={<RecipeDetailPage />} />
              <Route path="/add" element={<RecipeEditorPage />} />
              <Route path="/edit/:id" element={<RecipeEditorPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </main>
        </div>
      </RecipeProvider>
    </AuthProvider>
  );
}

export default App;
