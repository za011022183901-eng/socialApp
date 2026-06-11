import axios from 'axios'
import React from 'react'
import PostCard from '../PostCard/postCard';
import { useQuery } from '@tanstack/react-query';

export default function Home() {






  const getAllPosts = async () => {
    // بنرجع الطلب مباشرة، و Axios هيرجع الـ Promise
    return axios.get('https://route-posts.routemisr.com/posts?limit=30', {
      headers: {
        AUTHORIZATION: `Bearer ${localStorage.getItem('tkn')}`
      }

      
    });
  };



const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['getposts'], // المفتاح الفريد للـ Query، بيستخدم للتخزين المؤقت (Caching) وتحديث البيانات لاحقاً.
    
    queryFn: getAllPosts, // الدالة (Function) المسؤولة عن جلب البيانات من الـ API.
    
    refetchInterval: 30000, // (تحديث دوري) بيعيد طلب البيانات تلقائياً كل 30 ثانية طول ما الصفحة مفتوحة.
    
    refetchOnMount: true, // يحصل ريفلاش لو غادرت صقحه ورجعت تاني 
    
    retry: 3, // في حالة فشل الطلب، هيحاول يعيد المحاولة 3 مرات قبل ما يظهر رسالة الخطأ.
    
    retryDelay: 5000, // الوقت المستقطع بين كل محاولة إعادة (Retry) والثانية، هنا هيستنى 5 ثواني.
    
    staleTime: 10000 // (وقت الصلاحية) بيعتبر البيانات "طازة" لمدة 10 ثواني؛ طول المدة دي مش هيعمل طلب جديد لو دخلت وخرجت من الصفحة.
  });

  const posts = data?.data?.data.posts; 







  
  return (
    <div className="bg-white min-h-screen w-full overflow-hidden ">
    <div className="w-full md:w-3/4 lg:w-4/5 mx-auto mt-7 sm:px-4">  
    
         
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
                onClick={() => refetch()} // 3. بنستخدم refetch عشان يحاول يجيب البيانات تاني
                className="px-6 cursor-pointer py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
             >
                Try Again
             </button>
          </div>
        ) 
        
        : Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post._id} post={post} isId={false} />
          ))
        ) : (
          <div className="text-center py-20 text-gray-400">No posts found.</div>
        )}



      </div>
    </div>
  );
}