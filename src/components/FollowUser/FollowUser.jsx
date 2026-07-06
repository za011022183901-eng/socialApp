import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function FollowUser({ userId }) {
  const queryClient = useQueryClient();
  const { userIdd } = useContext(AuthContext); 

  const [isFollowed, setIsFollowed] = useState(false);
  const [isReady, setIsReady] = useState(false); // لمنع الـ Flicker (القلبة)

  useEffect(() => {
    if (userIdd) {
      const saved = localStorage.getItem(`${userIdd}followed_${userId}`) === 'true';
      setIsFollowed(saved);
      setIsReady(true); 
    }
  }, [userIdd, userId]);

  const toggleFollowUser = async (userId) => {
    const tkn = localStorage.getItem('tkn');
    const { data } = await axios.put(
      `https://route-posts.routemisr.com/users/${userId}/follow`,
      {},
      { headers: { token: tkn } }
    );
    return data;
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: () => toggleFollowUser(userId), 
    onSuccess: () => {
      const newStatus = !isFollowed;
      setIsFollowed(newStatus);
      localStorage.setItem(`${userIdd}followed_${userId}`, newStatus);
      queryClient.invalidateQueries({ queryKey: ['userPosts', userId] });
      
    },
    onError: (err) => {
      console.error("خطأ:", err);
    }
  });

  // الانتظار لحد ما الـ ID يجهز من الـ Context
  if (!isReady) {
    return (
      <div className="px-8 py-2 text-gray-400 text-sm font-semibold flex items-center gap-2">
        <i className="fa-solid fa-spinner fa-spin"></i> جاري التحميل...
      </div>
    );
  }

  
  return (
    <button
      onClick={() => mutate()}
      disabled={isLoading}
      className={`cursor-pointer font-bold px-8 py-2 rounded-full shadow-md transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 ${
        isFollowed 
          ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {isLoading ? (
        <i className="fa-solid fa-spinner fa-spin"></i>
      ) : isFollowed ? (
        <>
          <i className="fa-solid fa-user-minus"></i>
          Unfollow
        </>
      ) : (
        <>
          <i className="fa-solid fa-user-plus"></i>
          Follow
        </>
      )}
    </button>
  );
}