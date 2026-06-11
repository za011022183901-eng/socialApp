import React from 'react';
import CommentCard from './../commentCard/commentCard';
import Like from '../Like/Like';
import Shere from '../Shere/Shere';
import { Link } from 'react-router-dom';
import CommentsList from '../comments/CommentsList';
import CreateComment from '../CreateComment/CreateComment';

export default function PostCard({ post , isId }) {
 

  return (
    /* قمنا بتكبير العرض إلى 900px كحد أقصى ليكون واضحاً */
    <div className="w-full max-w-[900px] mx-auto  bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden mb-6">
     
      {/* 1. Header */}
      <div className="flex items-center px-6 py-4">
        <img
          className="h-10 w-10 rounded-full object-cover border border-gray-100"
          src={post.user?.photo || "https://randomuser.me/api/portraits/men/1.jpg"}
          alt="User"
        />
        <div className="ml-4">
          <span className="text-[17px] font-bold block text-gray-900 leading-tight">
            {post.user?.name}
          </span>
          <span className="text-[13px] text-gray-500">
            {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Just now'}
          </span>
        </div>
      </div>

      {/* 2. Body Text */}
      <div className="px-6 pb-4 text-[18px] text-gray-800 font-medium leading-relaxed">
        <p>{post.body}</p>
      </div>

      {/* 3. Main Image */}
      {post.image && (
        <div className="w-full bg-gray-50 border-y border-gray-100">
          <img
            className="w-full h-auto max-h-[900px] object-contain"
            src={post.image}
            alt="post content"
          />
        </div>
      )}

      {/* 4. Stats Row */}
      <div className="px-6 py-3 flex justify-between items-center text-[15px] text-gray-500">
        <span>👍 {post.likesCount || 0}</span>
        <div className="flex gap-4">
          <span>{post.commentsCount || 0} comments</span>
          <span>{post.sharesCount || 0} shares</span>
        </div>
      </div>

      {/* 5. Actions */}
      <div className="flex justify-between border-t border-gray-100 mx-4 py-2 gap-2">
        <Like   postId={post.id}  />

        <button className="flex-1 flex items-center justify-center px-4 py-3 text-[16px] font-semibold text-gray-600 hover:bg-gray-100 rounded-md transition cursor-pointer">
          <i className="fa-regular fa-comment me-2"></i> Comment {/* 🟢 تم تعديل mr إلى me لأفضل ممارسة */}
        </button>

{/* مررنا كل البيانات عشان المودال يشوفها ويعرضها */}
<Shere 
  postId={post.id} 
  postImage={post.image} 
  postContent={post.body} 
  userName={post.user?.name} 
/>




      </div>

      {/* 6. Comment Section */}
      <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
        {/* زر عرض المزيد من التعليقات (يظهر فقط لو كان هناك تعليقات) */}

        {post.commentsCount > 0 && !isId && (
          <Link
            to={`/PostDetails/${post.id}`}
            className="text-[15px] font-semibold text-blue-600 hover:underline mb-3 inline-block cursor-pointer"
          >
            View more comments
          </Link>
        )}

        <div className="w-full mb-4 flex items-center gap-3">
          {/* بديل الصورة: أيقونة مستخدم دائرية من فونت أوسم */}
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-user text-gray-600 text-lg"></i>
          </div>

          {/* شريط الكومنت الإدخال والأيقونة معاً */}
          
                
                <CreateComment postId={post.id} />



        </div>

        {post.topComment && !isId &&  (
          <div className="mt-2">
            {/* <CommentCard commentDetials={post.topComment} /> */}
            <CommentsList postId={post.id ?? id} limit={2} />
          </div>
        )}
      </div>

    </div>
  );
}