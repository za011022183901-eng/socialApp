import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React, { useState } from 'react'





export default function CreateComment({ postId }) {

  const [comment, setComment] = useState('')
  const queryClient = useQueryClient()

  function handleComment() {
    const formData = new FormData()
    formData.append('content', comment)

    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments`,
      formData,
      {
        headers: {
        AUTHORIZATION: `Bearer ${localStorage.getItem('tkn')}`
        },
      }
    )
  }


  const { mutate, isPending } = useMutation({ // في الإصدارات الجديدة يفضل استخدام isPending بدل isLoading
    mutationFn: handleComment,
    onSuccess: () => {
      // comments list بيستخدم queryKey فيها page/limit
      // عشان كده نخلي invalidate شامِل لكل صفحات نفس postId
      queryClient.invalidateQueries({ queryKey: ['postComments', postId], exact: false })

      // تقدر عنوان/عدد التعليقات يكون مبني على بيانات الـ post نفسه أو feed
      queryClient.invalidateQueries({ queryKey: ['getposts'] })
      queryClient.invalidateQueries({ queryKey: ['getSinglePost', postId] })

      setComment('')
    },
    onError: (err) => {
      console.error('Error creating comment:', err)
    },
  })














  return (
    <div className="flex-1 bg-gray-200/70 rounded-full px-5 py-3 border border-gray-200 flex items-center justify-between">
      <input
        type="text"
        placeholder={isPending ? "Sending..." : "Write a comment..."}
        disabled={isPending} // تعطيل الكتابة أثناء الإرسال
        className={`w-full bg-transparent text-[16px] outline-none pr-3 ${isPending ? 'opacity-50' : ''}`}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && comment.trim() && mutate()}
      />

      <button
        type="button"
        disabled={isPending || !comment.trim()}
        onClick={() => mutate()}
        className="text-blue-600 disabled:text-gray-400 cursor-pointer hover:text-blue-800 transition-colors shrink-0 min-w-[24px] flex justify-center items-center"
      >
        {isPending ? (
          // أيقونة اللودينج (Spinner)
          <i className="fa-solid fa-spinner fa-spin text-lg"></i>
        ) : (
          // أيقونة الإرسال العادية
          <i className="fa-solid fa-paper-plane text-lg"></i>
        )}
      </button>
    </div>
  )
}


























//                                                    CreatConnemt











