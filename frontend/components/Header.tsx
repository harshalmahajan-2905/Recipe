
import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { BookMarked, UtensilsCrossed, Heart, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const activeLinkClass = "bg-primary text-white";
  const inactiveLinkClass = "text-slate-100 hover:bg-orange-700";
  const linkBaseClass = "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors";

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="bg-dark shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex-shrink-0 flex items-center gap-2 text-white text-xl font-bold">
              <UtensilsCrossed className="h-8 w-8 text-primary" />
              <span>RecipeShare</span>
            </NavLink>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <NavLink to="/add" className={({ isActive }) => `${linkBaseClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                  <BookMarked className="h-5 w-5" />
                  Add Recipe
                </NavLink>
                <NavLink to="/favorites" className={({ isActive }) => `${linkBaseClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                  <Heart className="h-5 w-5" />
                  My Favorites
                </NavLink>
                
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 text-slate-100 hover:bg-orange-700 rounded-md transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                      ) : (
                        <User className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <span className="text-sm font-medium">{user?.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-slate-100 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
