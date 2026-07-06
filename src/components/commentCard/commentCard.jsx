import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import DeletePost from '../deletePost/DeletePost'; // تأكد من المسار الصحيح

export default function CommentCard({ commentDetials }) {
  const [showMenu, setShowMenu] = useState(false);
  const { userIdd } = useContext(AuthContext);

  // حماية من البيانات الفارغة
  if (!commentDetials) return null;

  const comment = commentDetials;
  const isMine = String(comment?.commentCreator?._id || '') === String(userIdd);
  const avatarSrc = comment?.commentCreator?.photo || 'https://via.placeholder.com/150';

  return (
    <div className="mt-4 flex items-start space-x-2 relative group">
      <img
        src={avatarSrc}
        className="h-8 w-8 rounded-full object-cover"
        alt="commenter"
      />
      
      <div className="flex-1">
        <div className="inline-block bg-gray-100 px-3 py-2 rounded-2xl relative max-w-[90%]">
          <h4 className="text-[13px] font-bold text-gray-900">
            {comment?.commentCreator?.name || 'User'}
          </h4>
          <p className="text-[14px] text-gray-800">{comment?.content}</p>
        </div>
      </div>

      {/* زر الحذف يظهر فقط إذا كان التعليق خاصاً بالمستخدم */}
      {isMine && (
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)} 
            className="text-gray-400 hover:text-gray-600 p-2 cursor-pointer"
          >
            <i className="fa-solid fa-ellipsis-v"></i>
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
              <div className="absolute right-0 top-8 w-32 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden">
               <DeletePost 
  postId={comment.post} // تأكد أن الـ API يرسل ID البوست داخل كائن التعليق
  commentId={comment._id} 
  inPost={false} // مهم جداً ليتمكن DeletePost من اختيار المسار الصحيح
  setShowMenu={setShowMenu}
/>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}