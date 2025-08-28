
import React, { useState } from 'react';
import type { Comment } from '../types';
import { useRecipes } from '../contexts/RecipeContext';

interface CommentSectionProps {
  recipeId: string;
  comments: Comment[];
}

const CommentSection: React.FC<CommentSectionProps> = ({ recipeId, comments }) => {
  const { postComment, currentUser } = useRecipes();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    await postComment(recipeId, newComment);
    setNewComment('');
    setIsSubmitting(false);
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">Comments ({comments.length})</h3>
      <div className="space-y-4 mb-6">
        {comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className="bg-slate-100 p-4 rounded-lg">
              <p className="font-semibold">{comment.authorName}</p>
              <p className="text-sm text-slate-600">{new Date(comment.createdAt).toLocaleString()}</p>
              <p className="mt-2">{comment.text}</p>
            </div>
          ))
        ) : (
          <p className="text-slate-500">No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>
      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={`Commenting as ${currentUser.name}...`}
          className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition"
          rows={3}
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting || !newComment.trim()}
          className="mt-2 px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-orange-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
