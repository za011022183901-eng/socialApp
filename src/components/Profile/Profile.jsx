import axios from 'axios'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import PostCard from '../PostCard/PostCard'
import { toast } from 'react-toastify'

export default function Profile() {
  const { userIdd, userProfileData, isUserLoading, token } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [hasPhotoError, setHasPhotoError] = useState(false);

  const postsQuery = useQuery({
    queryKey: ['myPosts', userIdd],
    queryFn: () => axios.get(`https://route-posts.routemisr.com/users/${userIdd}/posts`, {
      headers: { token }
    }),
    enabled: !!userIdd && !!token
  });

  const uploadPhotoMutation = useMutation({
    mutationFn: (formData) => axios.put(`https://route-posts.routemisr.com/users/upload-photo`, formData, {
      headers: {
        token,
        'Content-Type': 'multipart/form-data'
      }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userData'] });
      queryClient.invalidateQueries({ queryKey: ['myPosts', userIdd] });
      setIsUploading(false);
      toast.success('Profile photo updated', {
        position: 'top-center',
        className: 'p-5',
      });
    },
    onError: () => {
      setIsUploading(false);
      toast.error('Error uploading photo', { position: 'top-center' });
    }
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('photo', file);
      uploadPhotoMutation.mutate(formData);
    }
  };

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

  const myPosts = postsQuery.data?.data?.posts || postsQuery.data?.data?.data?.posts || [];
  const responseProfile = userDataResponse?.data;
  const postUser = myPosts.find((post) => post?.user?.name || post?.user?.username || post?.user?.photo)?.user;
  const profileUser = [
    responseProfile?.user,
    responseProfile?.data?.user,
    responseProfile?.data,
    userProfileData?.user,
    userProfileData?.data?.user,
    userProfileData,
    postUser,
  ].find((user) => user && (user.name || user.username || user.photo)) || postUser || userProfileData || null;

  const userName = profileUser?.name || profileUser?.username || userProfileData?.name || userProfileData?.username || 'User';
  const userPhoto = profileUser?.photo || profileUser?.avatar || postUser?.photo || '';
  const showPhoto = Boolean(userPhoto) && !hasPhotoError;

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <i className="fa-solid fa-circle-notch fa-spin text-4xl text-blue-600"></i>
          <p className="font-semibold text-blue-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col items-center mb-10 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-[700px] mx-auto">
        <div className="relative group mb-3">
          <div style={{ width: 128, height: 128, minWidth: 128, borderRadius: '50%', overflow: 'hidden' }} className={`rounded-full border-4 border-blue-500 bg-gray-100 flex items-center justify-center shadow-lg transition-all duration-300 ${
            isUploading ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
          }`}>
            {showPhoto ? (
              <img
                src={userPhoto}
                alt={userName}
                className="w-full h-full object-cover rounded-full"
                onError={() => setHasPhotoError(true)}
              />
            ) : null}
            <i
              className="fa-solid fa-user text-gray-400 text-4xl"
              style={{ display: showPhoto ? 'none' : 'block' }}
            ></i>
          </div>

          <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-md transition transform hover:scale-110">
            <i className={`fa-solid ${isUploading ? 'fa-spinner fa-spin' : 'fa-camera'}`}></i>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </div>

        <h1 style={{ display: 'block', marginTop: 12, textAlign: 'center' }} className="text-2xl font-bold text-gray-800">
          {userName}
        </h1>

        {profileUser?.username && profileUser.username !== userName && (
          <p className="text-gray-400 text-sm font-medium mt-1">
            @{profileUser.username}
          </p>
        )}

        <div className="w-16 h-1 bg-blue-500 rounded-full mt-4"></div>
      </div>

      <div className="max-w-[700px] mx-auto">
        <h2 className="text-xl font-bold mb-6 text-gray-800 border-l-4 border-blue-500 pl-3">
          My Publications ({myPosts.length})
        </h2>

        <div className="space-y-6">
          {myPosts.length > 0 ? (
            myPosts.map((post) => (
              <PostCard key={post._id || post.id} post={post} />
            ))
          ) : (
            <div className="text-center p-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-gray-400">
              لا توجد منشورات حالياً
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
