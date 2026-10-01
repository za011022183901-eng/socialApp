import React, { useContext, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
  const isOwnProfile = Boolean(userIdd && id && String(userIdd) === String(id));

  useEffect(() => {
    if (isOwnProfile) {
      navigate('/profile', { replace: true });
    }
  }, [isOwnProfile, navigate]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['userPosts', id],
    queryFn: () => getUserPosts(id),
    enabled: !!id && !isOwnProfile,
  });

  const posts = useMemo(() => {
    return data?.data?.posts || data?.posts || [];
  }, [data]);

  const viewedUser = useMemo(() => {
    return (
      data?.data?.user ||
      data?.user ||
      posts.find((post) => post?.user)?.user ||
      null
    );
  }, [data, posts]);

  const userName = viewedUser?.name || 'User';
  const userPhoto = viewedUser?.photo || '';

  if (isOwnProfile) {
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
        <div className="w-32 h-32 rounded-full border-4 border-blue-500 bg-gray-100 flex items-center justify-center overflow-hidden shadow-lg">
          {userPhoto ? (
            <img
              src={userPhoto}
              alt={userName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
          ) : null}
          <i
            className="fa-solid fa-user text-gray-400 text-4xl"
            style={{ display: userPhoto ? 'none' : 'block' }}
          ></i>
        </div>

        <h1 className="text-2xl font-bold mt-4 text-gray-800">
          {userName}
        </h1>

        {viewedUser?.username && (
          <p className="text-gray-400 text-sm font-medium mt-1 mb-4">
            @{viewedUser.username}
          </p>
        )}

        <div className="mt-3">
          <FollowUser userId={id} />
        </div>

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