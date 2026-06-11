import axios from 'axios'
import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function Share({ postId }) {

  const [isSuccess, setIsSuccess] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const queryClient = useQueryClient()

  function handleShare() {

    // للبوست ده تحديدًا | API اتحقق هنا يمنع
    if (isShared) return;

    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/share`,
      null,
      {
        headers: {
          token: localStorage.getItem('tkn'),
        }
      }
    )
  }

  const { mutate, isPending } = useMutation({
    mutationFn: handleShare,

    onSuccess: (data) => {
      console.log("تمت المشاركة بنجاح للبوسط:", postId);

      queryClient.invalidateQueries({
        queryKey: ['getposts']
      })



     
     queryClient.invalidateQueries({ queryKey: ['getSinglePost', postId] })
      



      setIsShared(true); // قفل الزرار للبوسط الحالي فقط
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    },

    onError: (error) => {

      // لو السيرفر قال "متشير قبل كده" اقفله للبوسط ده برضه
      if (error.response?.data?.message === "Post already shared") {
        setIsShared(true);
      }

      console.error("خطأ في البوست " + postId, error);
    }
  })

  return (
    <>
      <button
        onClick={() => mutate()}

        // disabled مرتبط بحالة البوست ده بس
        disabled={isPending || isShared}

        className="flex-1 flex items-center justify-center px-4 py-3 text-[16px] font-semibold text-gray-600 hover:bg-gray-100 rounded-md transition-all"
      >

        <i
          className={`fa-solid ${
            isPending
              ? 'fa-spinner fa-spin'
              : isShared
              ? 'fa-check text-green-600'
              : 'fa-share'
          } mr-2`}
        ></i>

        {
          isPending
            ? 'Sharing...'
            : isSuccess
            ? <span className="text-green-600">Success!</span>
            : isShared
            ? <span className="text-green-600">Shared</span>
            : 'Share'
        }

      </button>
    </>
  )
}