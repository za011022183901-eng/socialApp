import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6">
      {/* 🚀 Icon or Illustration */}
      <div className="text-9xl mb-8 animate-bounce">
        🌌
      </div>

      {/* ✍️ Texts */}
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-400 text-center max-w-md mb-8">
        Oops! It seems like you've drifted into deep space. The page you are looking for does not exist or has been moved.
      </p>

      {/* 🏠 Back Home Button */}
      <Link 
        to="/" 
        className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-teal-500/50"
      >
        <span>🏠</span>
        Would you like to return to the homepage?
      </Link>
    </div>
  );
}