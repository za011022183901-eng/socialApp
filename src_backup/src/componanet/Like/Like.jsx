import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React, { useState } from 'react'

export default function Like({ postId }) {


  
  const queryClient = useQueryClient()



  // بنجيب الحالة من الـ LocalStorage مباشرة (لو موجود يبقى true)
  const [isLiked, setIsLiked] = useState(localStorage.getItem(`liked_${postId}`) === 'true');



  
  const { mutate, isLoading } = useMutation({
    mutationFn: () => axios.put(`https://route-posts.routemisr.com/posts/${postId}/like`, {}, {
      headers: { token: localStorage.getItem('tkn') }
    }),

    
    onSuccess: () => {
      // بنعكس الحالة الحالية
      const newStatus = !isLiked;
      setIsLiked(newStatus);
      
      // بنحفظ الحالة الجديدة في الـ LocalStorage باسم فريد لكل بوست
      localStorage.setItem(`liked_${postId}`, newStatus);

      // تحديث البيانات
      queryClient.invalidateQueries({ queryKey: ['getposts'] });
      queryClient.invalidateQueries({ queryKey: ['getSinglePost', postId] });
    }
  });








  return (
  <button 
  onClick={() => mutate()} 
  disabled={isLoading}
  // جعلنا مؤشر الزر بالكامل عادي cursor-default
  className={`flex-1 flex items-center justify-center p-3 rounded-md transition cursor-default
    ${isLiked ? 'text-blue-600' : 'text-gray-600'}`} 
>
  {/* جمعنا الأيقونة والكلمة داخل wrapper يأخذ cursor-pointer */}
  <div className="flex items-center cursor-pointer select-none">
    <i className={`${isLoading ? 'fa-spinner fa-spin' : 'fa-thumbs-up'} ${isLiked ? 'fa-solid' : 'fa-regular'} mr-2`}></i>
    <span className="font-semibold">Like</span>
  </div>
</button>
  );
}