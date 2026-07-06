import axios from 'axios'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import PostCard from '../PostCard/postCard'
import { toast } from 'react-toastify'

export default function Profile() {
  // 1. جلب البيانات المتاحة من الـ Context
  const { userIdd, userProfileData, isUserLoading, token } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  // 2. جلب المنشورات الخاصة بك
  const postsQuery = useQuery({
    queryKey: ['myPosts', userIdd],
    queryFn: () => axios.get(`https://route-posts.routemisr.com/users/${userIdd}/posts`, {
      headers: { token: token }
    }),
    enabled: !!userIdd && !!token 
  });

  // 3. عملية رفع الصورة وتحديثها
  const uploadPhotoMutation = useMutation({
    mutationFn: (formData) => axios.put(`https://route-posts.routemisr.com/users/upload-photo`, formData, {
      headers: { 
        token: token,
        'Content-Type': 'multipart/form-data' 
      }
    }),
    onSuccess: () => {
      // تحديث الـ cache في الـ Context والموقع كله فوراً
      queryClient.invalidateQueries(['userData']);
      setIsUploading(false);

      toast.success(`Profile photo updated`, {
        position: 'top-center',
        className: `p-5`,
      });
    },
    onError: () => {
      setIsUploading(false);
      toast.error("Error uploading photo", { position: 'top-center' });
    }
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('photo', file);
      uploadPhotoMutation.mutate(formData);
    }
  };

  // مصفوفة البوستات
  const myPosts = postsQuery.data?.data?.posts || postsQuery.data?.data?.data?.posts || [];

  // 🎯 هنا التركيز الصح:
  // أولاً: بنحاول نقرأ البيانات من الـ Context (سواء كان المسار المباشر أو جوه الـ user)
  // ثانياً: لو الـ Context مش قاري، بنعمل Fallback فوراً ونقراها من أول بوست في الـ myPosts عشان نضمن ظهورها!
  const finalName = userProfileData?.name || myPosts[0]?.user?.name || "Loading Name...";
  const finalPhoto = userProfileData?.photo || myPosts[0]?.user?.photo || "";

  // الانتظار لحد ما الداتا الأساسية تجمع
  if (isUserLoading || postsQuery.isLoading) {
    return <div className="p-20 text-center font-bold text-blue-600">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      
      {/* هيدر البروفايل */}
      <div className="flex flex-col items-center mb-10 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-[700px] mx-auto">
        
        {/* منطقة الصورة */}
        <div className="relative group">
          <img 
            // استخدام المتغير الذكي اللي بيضمن القراءة من الـ Context أو البوستات
            src={finalPhoto} 
            className={`w-32 h-32 rounded-full border-4 border-blue-500 object-cover shadow-lg transition-all duration-300 ${isUploading ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}
            alt={finalName}
          />
          
          {/* زر الكاميرا */}
          <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-md transition transform hover:scale-110">
            <i className={`fa-solid ${isUploading ? 'fa-spinner fa-spin' : 'fa-camera'}`}></i>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
              disabled={isUploading} 
            />
          </label>
        </div>

        {/* الاسم */}
        <h1 className="text-2xl font-bold mt-4 text-gray-800">
          {finalName}
        </h1>
       
        <div className="w-16 h-1 bg-blue-500 rounded-full mt-4"></div>
      </div>

      {/* المنشورات */}
      <div className="max-w-[700px] mx-auto">
        <h2 className="text-xl font-bold mb-6 text-gray-800 border-l-4 border-blue-500 pl-3">
          My Publications ({myPosts.length})
        </h2>
        
        <div className="space-y-6">
          {myPosts.length > 0 ? (
            myPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          ) : (
            <div className="text-center p-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-gray-400">
              لا توجد منشورات حالياً
            </div>
          )}
        </div>
      </div>
    </div>
  )
}