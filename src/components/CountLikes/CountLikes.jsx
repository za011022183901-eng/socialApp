import React, { useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom'; // تأكد من استيراد Link
import FollowUser from './../FollowUser/FollowUser';
import { AuthContext } from '../context/AuthContext';

export default function CountLikes({ post }) {
  const [showModal, setShowModal] = useState(false);
  const { userIdd } = useContext(AuthContext);

  const LikesModal = ({ postId, onClose }) => {
    const { data, isLoading } = useQuery({
      queryKey: ['postLikes', postId],
      queryFn: () =>
        axios.get(`https://route-posts.routemisr.com/posts/${postId}/likes`, {
          headers: { token: localStorage.getItem('tkn') },
        }),
      enabled: showModal,
    });

    const likes = data?.data?.data?.likes || [];

    return (
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-50 p-4" 
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-2xl w-full max-w-lg shadow-xl flex flex-col max-h-[80vh]" 
          onClick={(e) => e.stopPropagation()}
        >
          {/* الهيدر */}
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 text-xl">People who reacted</h3>
            <button 
              onClick={onClose} 
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition"
            >
              ✕
            </button>
          </div>
          
          {/* القائمة */}
          <div className="overflow-y-auto p-2">
            {isLoading ? (
              <div className="text-center py-10 text-gray-500">Loading...</div>
            ) : (
              <ul className="space-y-1">
                {likes.length > 0 ? (
                  likes.map((user) => (
                    <li key={user._id} className="flex items-center justify-between px-3 py-3 hover:bg-gray-50 rounded-xl transition">
                      <div className="flex items-center gap-3">
                        {/* التعديل هنا: استخدام user._id الخاص بالشخص الذي قام بالإعجاب */}
                        <Link to={`/getUserPosts/${user._id}`}>
                          <img 
                            src={user.photo} 
                            className="w-12 h-12 rounded-full object-cover border border-gray-200" 
                            alt={user.name} 
                          />
                        </Link>
                        <span className="font-bold text-gray-900 text-[16px]">{user.name}</span>
                      </div>
                      
                      {/* زر الفولو يظهر فقط إذا لم يكن المستخدم هو صاحب الحساب */}
                      {user._id !== userIdd && (
                        <div className="ml-4">
                           <FollowUser userId={user._id} />
                        </div>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 text-center py-10">No likes yet.</li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className="hover:underline cursor-pointer text-gray-500 transition-all hover:text-blue-600 flex items-center gap-1.5 font-medium"
      >
        👍 {post.likesCount || 0}
      </button>

      {showModal && (
        <LikesModal 
          postId={post._id} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
}