import React, { useContext, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import PostCard from '../PostCard/PostCard';
import FollowUser from '../FollowUser/FollowUser';
import { AuthContext } from '../context/AuthContext';

// 1️⃣ الفانكشن اللي بتكلم الـ API
const getUserPosts = async (userId) => {
  const tkn = localStorage.getItem('tkn');
  const { data } = await axios.get(`https://route-posts.routemisr.com/users/${userId}/posts`, {
    headers: { token: tkn }
  });
  return data;
};

export default function GetUserPosts() {
  const { userIdd } = useContext(AuthContext); // ID الخاص بك
  const { id } = useParams(); // ID الخاص بصاحب الصفحة المطلوبة
  const navigate = useNavigate();

  // 🎯 التأكد من التحويل فوراً إذا كنت أنت صاحب الصفحة
  useEffect(() => {
    if (userIdd && id && userIdd === id) {
      navigate('/profile', { replace: true });
    }
  }, [userIdd, id, navigate]);

  // 2️⃣ الـ Query لجلب البوستات
  const { data, isLoading, isError } = useQuery({
    queryKey: ['userPosts', id],
    queryFn: () => getUserPosts(id),
    enabled: !!id && userIdd !== id, // لن يعمل الطلب إذا كنت أنت صاحب الصفحة
  });

  // ⚡️ استخدام useMemo لتحسين أداء معالجة المصفوفة
  const posts = useMemo(() => {
    return data?.data?.posts || data?.posts || [];
  }, [data]);

  // 🛑 إذا كنت أنت صاحب الصفحة، نمنع عرض أي شيء في الـ UI
  if (userIdd && id && userIdd === id) {
    return null;
  }

  // 🔄 حالات التحميل والخطأ
  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (isError) return <div className="text-center p-10 text-red-500 font-bold">حدث خطأ أثناء جلب البيانات</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-50 min-h-screen">
      
      {/* 👤 بيانات المستخدم */}
      <div className="flex flex-col items-center mb-10 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-[700px] mx-auto">
        <img 
          src={posts[0]?.user?.photo || "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"} 
          className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover shadow-md"
          alt="Profile"
          onError={(e) => e.target.src = "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"}
        />

        <h1 className="text-2xl font-bold mt-4 text-gray-800">
          {posts[0]?.user?.name || "مستخدم شبكة التواصل"}
        </h1>
        <p className="text-gray-400 text-sm font-medium mb-4">
          {posts[0]?.user?.username ? `@${posts[0].user.username}` : ""}
        </p>

        <FollowUser userId={id} />

        <div className="mt-4 text-sm font-semibold bg-blue-50 text-blue-600 px-4 py-1 rounded-full">
           {posts.length} POSTS
        </div>
      </div>

      {/* 📝 قائمة البوستات */}
      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-gray-400">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-bold">لا توجد منشورات حالياً</h3>
        </div>
      )}
    </div>
  );
}