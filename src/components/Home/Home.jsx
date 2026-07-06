import axios from 'axios'
import React from 'react'
import PostCard from '../PostCard/postCard';
import CreatePost from '../CreatePost/CreatePost'; // 1. استدعاء الكومبوننت هنا (اتأكد من مسار الملف بتاعك)
import { useQuery } from '@tanstack/react-query';
import usePost from '../hooks/usePost';

export default function Home() {


 const {data, error, isLoading, refetch , posts}  = usePost()




  return (
    <div className="bg-white min-h-screen w-full overflow-hidden">
      <div className="w-full md:w-3/4 lg:w-4/5 mx-auto mt-7 sm:px-4">  
        
        {/* ========================================= */}
        {/* 2. وضع كومبوننت إنشاء البوست هنا */}
        <div className="mb-6">
          <CreatePost />
        </div>
        {/* ========================================= */}

        {/* عرض حالة التحميل أو الخطأ أو البوستات */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-100 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-xl font-bold text-gray-800 tracking-wide">Loading Feed...</h3>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
             <div className="text-red-500 text-5xl mb-4">
                <i className="fa-solid fa-triangle-exclamation"></i>
             </div>
             <h3 className="text-xl font-bold text-gray-800">Oops! Something went wrong</h3>
             <p className="text-gray-500 mt-2 mb-6">Error fetching data</p>
             <button 
                onClick={() => refetch()} 
                className="px-6 cursor-pointer py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
             >
                Try Again
             </button>
          </div>
        ) : Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post._id} post={post} isId={false}  userId={post.user._id} />
          ))
        ) : (
          <div className="text-center py-20 text-gray-400">No posts found.</div>
        )}

      </div>
    </div>
  );
}










































//                                                 عرفنا وخلصنا custom hook home