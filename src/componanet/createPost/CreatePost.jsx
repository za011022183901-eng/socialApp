import React, { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";



const CreatePost = () => {
  const queryClient = useQueryClient();
  const { userIdd, userProfileData, token } = useContext(AuthContext);
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null); 
  const [imageFile, setImageFile] = useState(null);

  const { data: userDataResponse } = useQuery({
    queryKey: ['userData'],
    queryFn: () =>
      axios.get(`https://route-posts.routemisr.com/users/profile-data`, {
        headers: { token: localStorage.getItem('tkn') },
      }),
    enabled: !!token,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  const contextUser = userDataResponse?.data?.user || userProfileData;

  const { data: myPostsResponse } = useQuery({
    queryKey: ['myPosts', userIdd],
    queryFn: () =>
      axios.get(`https://route-posts.routemisr.com/users/${userIdd}/posts`, {
        headers: { token: localStorage.getItem('tkn') },
      }),
    enabled: !!userIdd && !!token && !contextUser?.photo,
    staleTime: 1000 * 60 * 5,
  });

  const myPostsCache = queryClient.getQueryData(['myPosts', userIdd]);
  const myPosts =
    myPostsResponse?.data?.posts ||
    myPostsResponse?.data?.data?.posts ||
    myPostsCache?.data?.posts ||
    myPostsCache?.data?.data?.posts ||
    [];

  const finalPhoto = contextUser?.photo || myPosts[0]?.user?.photo || "";





  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); 
      
      setImageFile(file); 
    }
    e.target.value = null; 
  };




  const handleCreatePost = () => {
    const formData = new FormData();
    if (text.trim()) {
      formData.append("body", text);
    }
    if (imageFile) {
      formData.append("image", imageFile);
    }
    mutate(formData);
  };


























  // 1. استخدام isPending بدلاً من isLoading (للتوافق مع التحديثات الجديدة لـ React Query)
  const { mutate, isPending } = useMutation({
    mutationFn: (formData) => axios.post(`https://route-posts.routemisr.com/posts`, formData, {
      headers: { token: localStorage.getItem("tkn") }
    }),
    onSuccess: () => {
      setText(""); 
      setImagePreview(null); 
      setImageFile(null); 


      
          toast.success(`post is createed` , 
            
            {position:'top-center',
             className:`p-5` ,
      
            })
      
      queryClient.invalidateQueries({ queryKey: ["getposts"] });
    }
  });

  







  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };
















  return (
    <div className="w-full max-w-[900px] mx-auto bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden mb-6 p-4">
      
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden border-2 border-gray-100">
          {finalPhoto ? (
            <img
              src={finalPhoto}
              alt={contextUser?.name || "My Profile"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
          ) : null}
          <i
            className="fa-solid fa-user text-gray-400 text-lg"
            style={{ display: finalPhoto ? 'none' : 'block' }}
          ></i>
        </div>
        
        <textarea
          rows="1"
          placeholder="What's on your mind?"
          className="flex-1 bg-gray-100 rounded-2xl px-5 py-3 outline-none text-gray-800 text-lg resize-none min-h-[50px]"
          value={text}
          onChange={(e) => {
            setText(e.target.value);   e.target.style.height = "auto";  e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          dir="auto"
        />
      </div>

      {/* منطقة عرض الصورة */}
      {imagePreview && (
        <div className="relative mb-4 rounded-lg bg-gray-50 p-2 border">
          <img src={imagePreview} alt="Preview" className="w-full max-h-[500px] object-contain rounded-md" />
          <button
            onClick={handleRemoveImage}
            className="absolute top-4 right-4 bg-gray-900/60 hover:bg-gray-900 text-white w-9 h-9 flex items-center justify-center rounded-full transition-all cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>
      )}














      {/* 2. إخفاء زراير الأكشن لو فيه صورة معروضة عشان الشكل ميبقاش زحمة */}
      {!imagePreview && (
        <>
          <hr className="border-gray-200 mb-3" />
          <div className="flex justify-between items-center gap-2">
            <button className="flex-1 flex justify-center items-center gap-2 text-gray-600 font-semibold hover:bg-gray-100 p-3 rounded-xl transition-colors cursor-pointer">
              <i className="fa-solid fa-video text-red-500 text-xl"></i>
              <span className="hidden sm:inline">Live video</span>
            </button>

            <label className="flex-1 flex justify-center items-center gap-2 text-gray-600 font-semibold hover:bg-gray-100 p-3 rounded-xl transition-colors cursor-pointer m-0">
              <i className="fa-regular fa-images text-green-500 text-xl"></i>
              <span className="hidden sm:inline">Photo/video</span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload} 
              />
            </label>

            <button className="flex-1 flex justify-center items-center gap-2 text-gray-600 font-semibold hover:bg-gray-100 p-3 rounded-xl transition-colors cursor-pointer">
              <i className="fa-regular fa-face-smile text-yellow-500 text-xl"></i>
              <span className="hidden sm:inline">Feeling/activity</span>
            </button>
          </div>
        </>
      )}









      {/* زرار النشر */}
      {(text.trim() || imageFile) && (
        <button 
          onClick={handleCreatePost}
          disabled={isPending}
          className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {/* تغيير الـ Condition عشان يقرا من isPending */}
          {isPending ? (
            <>
              <i className="fa-solid fa-spinner fa-spin"></i> Posting...
            </>
          ) : (
            "Post"
          )}
        </button>
      )}
    </div>
  );
};

export default CreatePost;












