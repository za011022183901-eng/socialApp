import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React, { useState } from 'react'

export default function CreateComment({ postId }) {
  const [comment, setComment] = useState('')
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append('content', comment.trim());

      return axios.post(
        `https://route-posts.routemisr.com/posts/${postId}/comments`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('tkn')}`,
          },
        }
      );
    },
    onSuccess: () => {
      // 1) تحديث قائمة التعليقات (react-query)
      queryClient.invalidateQueries({ queryKey: ['postComments', postId], exact: false })
      queryClient.invalidateQueries({ queryKey: ['getposts'] })
      queryClient.invalidateQueries({ queryKey: ['getSinglePost', postId] })
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
           queryClient.invalidateQueries({ queryKey: ['myPosts'] });



      // 2) لو CommentsList يعتمد event
      window.dispatchEvent(new CustomEvent('comment-created', { detail: { postId } }))

      setComment('')
    },
  })

  return (
    // flex-1 هنا هي السر عشان ياخد المساحة اللي جنب الصورة
    <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 border border-gray-200 flex items-center justify-between">
      <input
        type="text"
        placeholder={isPending ? "Sending..." : "Write a comment..."}
        disabled={isPending}
        className="w-full bg-transparent text-[15px] outline-none pr-3"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && comment.trim() && mutate()}
      />

      <button
        type="button"
        disabled={isPending || !comment.trim()}
        onClick={() => mutate()}
        className="text-blue-600 disabled:text-gray-400 transition-colors"
      >
        {isPending ? (
          <i className="fa-solid fa-spinner fa-spin"></i>
        ) : (
          <i className="fa-solid fa-paper-plane"></i>
        )}
      </button>
    </div>
  )
}