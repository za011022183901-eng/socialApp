import React, { useState } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function Share({ postId, postImage, postContent, userName }) {
  // --- States ---
  const [isSuccess, setIsSuccess] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [shareText, setShareText] = useState('');

  const queryClient = useQueryClient();

  // --- 1. API Function ---
  const sharePost = async ({ id, text }) => {
    const token = localStorage.getItem('tkn');
    
    if (!token) throw new Error("Authentication token is missing");

    // Payload matching FB style (sending comment in 'body')
    const payload = text ? { body: text } : {};

    return axios.post(
      `https://route-posts.routemisr.com/posts/${id}/share`,
      payload,
      {
        headers: { token },
      }
    );
  };

  // --- 2. React Query Mutation ---
  const { mutate, isPending } = useMutation({
    mutationFn: sharePost,
    onSuccess: () => {
      console.log("Post shared successfully:", postId);

      queryClient.invalidateQueries({ queryKey: ['getposts'] });
      queryClient.invalidateQueries({ queryKey: ['getSinglePost', postId] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      queryClient.invalidateQueries({ queryKey: ['myPosts'] });

      setIsShared(true);
      setIsSuccess(true);
      
      // Auto-close and clear
      setShowModal(false);
      setShareText('');

      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message;
      if (errorMessage === "Post already shared") {
        setIsShared(true);
        setShowModal(false);
      }
      console.error(`Error sharing post ${postId}:`, error);
    },
  });

  // --- 3. Handlers ---
  const handleOpenModal = () => {
    if (isShared) return;
    setShowModal(true);
  };

  const handleConfirmShare = () => {
    mutate({ id: postId, text: shareText });
  };

  return (
    <>
      {/* --- Main Trigger Button (FB Style Action Bar) --- */}
      <button
        onClick={handleOpenModal}
        disabled={isPending || isShared}
        aria-label={`Share post by ${userName}`}
        // التعديل هنا: تم إزالة flex-1 وإضافة w-fit لضمان أن الزر يأخذ حجم النص والأيقونة فقط
        className="flex items-center justify-center px-4 py-3 text-[15px] font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed w-fit cursor-pointer"
      >
        <i
          className={`fa-solid ${
            isPending
              ? 'fa-spinner fa-spin'
              : isShared
              ? 'fa-check text-green-600'
              : 'fa-share'
          } text-xl mr-2.5`}
        ></i>

        {isPending && <span>Sharing...</span>}
        {!isPending && isSuccess && <span className="text-green-600">Success!</span>}
        {!isPending && !isSuccess && isShared && <span className="text-green-600">Shared</span>}
        {!isPending && !isSuccess && !isShared && <span>Share</span>}
      </button>

      {/* --- Facebook Style Modal --- */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 transition-opacity"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-xl w-full max-w-[550px] relative shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* --- Modal Header --- */}
            <div className="p-4 border-b border-gray-200 relative">
              <h2 className="text-xl font-bold text-center text-gray-900">
                Share Post
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <i className="fa-solid fa-xmark text-2xl"></i>
              </button>
            </div>

            {/* --- Modal Body (Scrollable) --- */}
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              
              {/* User Info & Audience */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <i className="fa-solid fa-user text-2xl text-gray-500"></i>
                </div>
                <div>
                  <p className="font-semibold text-gray-950">You</p>
                  <button className="flex items-center gap-1.5 bg-gray-200 px-2.5 py-1 rounded-md text-sm font-medium text-gray-800 mt-1">
                    <i className="fa-solid fa-earth-americas text-xs"></i>
                    Public
                    <i className="fa-solid fa-caret-down text-xs"></i>
                  </button>
                </div>
              </div>

              {/* Composition Area */}
              <textarea
                value={shareText}
                onChange={(e) => setShareText(e.target.value)}
                placeholder="Write something about this... (optional)"
                className="w-full mb-3 min-h-[100px] text-lg resize-none border-none outline-none focus:ring-0 p-0 text-gray-900 placeholder:text-gray-500"
              />

              {/* Nested Content Card */}
              <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
                {postImage ? (
                  <>
                    <img
                      src={postImage}
                      alt="Post content preview"
                      className="w-full h-auto max-h-80 object-cover"
                    />
                    {postContent && (
                      <div className="p-4 border-t border-gray-100 bg-gray-50">
                          <p className="text-gray-500 text-xs mb-1">Posted by {userName}</p>
                          <p className="text-gray-800 text-[15px] whitespace-pre-wrap line-clamp-3">
                            {postContent}
                          </p>
                      </div>
                    )}
                  </>
                ) : postContent ? (
                  <div className="bg-gray-50 p-5">
                    <p className="text-gray-500 text-xs mb-1.5">Posted by {userName}</p>
                    <p className="text-gray-900 whitespace-pre-wrap text-[16px] leading-relaxed">
                      {postContent}
                    </p>
                  </div>
                ) : (
                    <div className="p-4 bg-gray-50 text-gray-500 italic text-sm">
                      Attachment content preview unavailable.
                    </div>
                )}
              </div>
            </div>

            {/* --- Modal Footer --- */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmShare}
                  disabled={isPending}
                  className="px-10 py-2 rounded-lg bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {isPending ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin mr-2.5"></i> Posting...
                    </>
                  ) : (
                    'Share Now'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}