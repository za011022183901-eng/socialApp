import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios'; 
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';




export default function UpdatePost({ setShowMenu, postId, oldContent, oldImage }) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');   
  const [image, setImage] = useState(null);      
  const [preview, setPreview] = useState(null);   

  // ✨ Sync old data when the modal opens
  useEffect(() => {
    if (isOpen) {
      setContent(oldContent || '');  
      setPreview(oldImage || null);  
      setImage(null);                
    }
  }, [isOpen, oldContent, oldImage]);




  // 1️⃣ دالة الـ API تحولت إلى Regular Function (دالة عادية)
  async function updatePostApi(formData) {
    const tkn = localStorage.getItem('tkn');
    const { data } = await axios.put(
      `https://route-posts.routemisr.com/posts/${postId}`, 
      formData,
      {
        headers: {
          token: tkn,
        },
      }
    );
    return data;
  }








  // 2️⃣ الـ Mutation بتنادي على الدالة اللي جوه الكومبوننت
  const { mutate, isPending } = useMutation({
    mutationFn: updatePostApi,
    onSuccess: (data) => {
      
      queryClient.invalidateQueries({ queryKey: ['getposts'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] }); 
      queryClient.invalidateQueries({ queryKey: ['getSinglePost', postId] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      queryClient.invalidateQueries({ queryKey: ['myPosts'] });

      setIsOpen(false);
      setShowMenu(false);



    toast.success(`post is updated successfuly` , 
      
      {position:'top-center',
       className:`p-5` ,

      })


    },
    onError: (err) => {
      console.error("❌ Update Error:", err.response?.data || err.message);
    },
  });





  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);                     
      setPreview(URL.createObjectURL(file)); 
    }
  };
  







  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('body', content.trim() || " "); 
    if (image) {
      formData.append('image', image);
    }

    // 🎯 بنباصي الـ formData بس! مش محتاجين نباصي الـ postId لأن الدالة شايفاه فوقها علطول
    mutate(formData);
  };















  return (
    <>
      {/* Menu Action Button */}
      <button
        className="w-full text-left px-4 py-3 text-[15px] font-medium text-gray-700 hover:bg-gray-50 flex items-center transition cursor-pointer"
        onClick={(e) => {
          e.stopPropagation(); 
          setIsOpen(true);     
        }}
      >
        <i className="fa-regular fa-pen-to-square me-3 text-blue-600"></i> Update Post
 </button>

      {/* Modal Popup */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" 
          onClick={() => { setIsOpen(false); setShowMenu(false); }}
        >
          <div 
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl text-left" 
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">Update Post</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Text Content Input */}
              <textarea
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 resize-none text-left"
                rows="4"
                placeholder="What's on your mind? Edit here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />







              {/* Image Input */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-500">Change post image:</label>
                <input
                  type="file"
                  accept="image/*"
                  className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  onChange={handleImageChange}
                />
              </div>

              {/* Image Preview Panel */}
              {preview && (
                <div className="mt-3 relative rounded-xl overflow-hidden border border-gray-100 max-h-48 flex justify-center bg-gray-50">
                  <img src={preview} alt="Preview" className="object-contain max-h-48 w-full" />
                  <button 
                    type="button" 
                    className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1.5 text-xs"
                    onClick={() => { setImage(null); setPreview(null); }}
                  >
                    <i className="fa-solid fa-xmark"></i></button>  </div> )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition"
                  onClick={() => { setIsOpen(false); setShowMenu(false); }}
                  disabled={isPending}
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  disabled={isPending} 
                >
                  {isPending ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i> Saving changes...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}











































//                                               the end update post