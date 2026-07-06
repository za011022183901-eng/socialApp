import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React, { useState } from 'react'

export default function Like({ postId }) {
  const queryClient = useQueryClient()

  const [isLiked, setIsLiked] = useState(() => {
    return localStorage.getItem(`liked_${postId}`) === 'true';
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: () => axios.put(`https://route-posts.routemisr.com/posts/${postId}/like`, {}, {
      headers: { token: localStorage.getItem('tkn') }
    }),
    onSuccess: () => {
      const newStatus = !isLiked;
      setIsLiked(newStatus);
      localStorage.setItem(`liked_${postId}`, newStatus);

      queryClient.invalidateQueries({ queryKey: ['getposts'] });
      queryClient.invalidateQueries({ queryKey: ['getSinglePost', postId] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      queryClient.invalidateQueries({ queryKey: ['myPosts'] });
    },
    onError: (err) => {
        console.error("Error liking post:", err);
    }
  });

  return (
    // التعديل: إزالة flex-1 من الزر نفسه وإضافة w-fit
    <button
      onClick={() => mutate()}
      disabled={isLoading}
      className={`flex items-center justify-center p-3 rounded-md transition w-fit cursor-pointer ${
        isLiked ? 'text-blue-600' : 'text-gray-600'
      } hover:bg-gray-100`}
    >
      <i
        className={`${isLoading ? 'fa-spinner fa-spin' : 'fa-thumbs-up'} ${
          isLiked ? 'fa-solid' : 'fa-regular'
        } mr-2`}
      ></i>
      <span className="font-semibold">Like</span>
    </button>
  );
}