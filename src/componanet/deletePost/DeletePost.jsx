import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function DeletePost({ setShowMenu, postId, commentId, inPost = true }) {
  const queryClient = useQueryClient();

  // تحديد الرابط ديناميكياً
  const deleteUrl = inPost 
    ? `https://route-posts.routemisr.com/posts/${postId}`
    : `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`;

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      return axios.delete(deleteUrl, {
        headers: { token: localStorage.getItem('tkn') }
      });
    },
    onSuccess: () => {
      // تحديث البيانات بناءً على النوع
      if (inPost) {
        queryClient.invalidateQueries({ queryKey: ['getposts'] });
        queryClient.invalidateQueries({ queryKey: ['myPosts'] });
       queryClient.invalidateQueries({ queryKey: ['getSinglePost', postId] });

      } else {
      // Comment deletion: invalidate all paginated queries used by CommentsList
      queryClient.invalidateQueries({
        queryKey: ['postComments', postId],
        exact: false,
      });

      queryClient.invalidateQueries({ queryKey: ['getposts'] });
      queryClient.invalidateQueries({ queryKey: ['getSinglePost', postId] });
      queryClient.invalidateQueries({ queryKey: ['getSinglePost', postId] });

      // مهم: عشان CommentsList يحدّث فوري بعد حذف الكومنت
      window.dispatchEvent(
        new CustomEvent('comment-deleted', { detail: { postId } })
      );

      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      queryClient.invalidateQueries({ queryKey: ['myPosts'] });
      }
      
      if (setShowMenu) setShowMenu(false);
      toast.success(inPost ? "Post deleted" : "Comment deleted");
    },
    onError: (err) => {
      console.error("Delete Error:", err);
      toast.error("Failed to delete");
    }
  });

  return (
    <button
      disabled={isPending}
      className={`w-full text-left px-4 py-3 text-[14px] font-semibold flex items-center transition-all ${
        isPending ? 'text-gray-400' : 'text-red-600 hover:bg-red-50'
      }`}
      onClick={() => mutate()}
    >
      <i className={`fa-regular fa-trash-can me-3 ${isPending ? 'fa-spin' : ''}`}></i>
      {isPending ? 'Deleting...' : (inPost ? 'Delete Post' : 'Delete ')}
    </button>
  );
}