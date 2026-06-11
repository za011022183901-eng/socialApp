import React, { useContext, useState } from 'react'; 
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import CommentCard from './../commentCard/commentCard';
import Like from '../Like/Like';
import Shere from '../Shere/Shere';
import { Link } from 'react-router-dom';
import CommentsList from '../comments/CommentsList';
import CreateComment from '../CreateComment/CreateComment';
import DeletePost from '../deletePost/DeletePost';
import { AuthContext } from '../context/AuthContext';
import UpdatePost from '../UpdatePoat/UpdatePost';
import CountLikes from '../CountLikes/CountLikes';

export default function PostCard({ post, isId }) {
  const [showMenu, setShowMenu] = useState(false);
  const queryClient = useQueryClient();
  const { userIdd, userProfileData, token } = useContext(AuthContext);

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

  const finalPhoto =
    contextUser?.photo ||
    myPosts[0]?.user?.photo ||
    (String(userIdd) === String(post.user?._id) ? post.user?.photo : "") ||
    "";

  return (
    <div className="w-full max-w-[900px] mx-auto bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden mb-6">
      
      {/* 1. Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <Link to={`/getUserPosts/${post.user?._id}`}>
            <img
              className="h-10 w-10 rounded-full object-cover border border-gray-100 hover:opacity-85 transition-opacity cursor-pointer"
              src={post.user?.photo || "https://randomuser.me/api/portraits/men/1.jpg"}
              alt={post.user?.name || "User"}
            />
          </Link>
          <div className="ml-4">
            <Link 
              to={`/getUserPosts/${post.user?._id}`}
              className="text-[17px] font-bold block text-gray-900 leading-tight hover:underline cursor-pointer"
            >
              {post.user?.name}
            </Link>
            <span className="text-[13px] text-gray-500">
              {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Just now'}
            </span>
          </div>
        </div>

        <div className="relative">
          {userIdd === post.user?._id && (
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition cursor-pointer"
            >
              <i className="fa-solid fa-ellipsis-h text-gray-600"></i>
            </button>
          )}
          
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden">
                {!isId && (
                  <UpdatePost 
                    setShowMenu={setShowMenu} 
                    postId={post._id} 
                    oldContent={post.body}   
                    oldImage={post.image}    
                  />
                )}
                <div className="border-t border-gray-100"></div>


















                <DeletePost setShowMenu={setShowMenu} postId={post._id}  inPost  />



























              </div>
            </>
          )}
        </div>
      </div>

      <div className="px-6 pb-4 text-[18px] text-gray-800 font-medium leading-relaxed">
        <p>{post.body}</p>
      </div>

      {post.image && (
        <div className="w-full bg-gray-50 border-y border-gray-100">
          <img
            className="w-full h-auto max-h-[900px] object-contain"
            src={post.image}
            alt="post content"
          />
        </div>
      )}

      <div className="px-6 py-3 flex justify-between items-center text-[15px] text-gray-500">


              
              <CountLikes post={post}/>



        <div className="flex gap-4">
          <span>{post.commentsCount || 0} comments</span>
          <span>{post.sharesCount || 0} shares</span>
        </div>
      </div>

      <div className="flex justify-between border-t border-gray-100 mx-4 py-2 gap-2">
        <div className="flex-1 flex justify-center">
          <Like postId={post._id} />
        </div>
        <div className="flex-1 flex justify-center">
          <button className="flex items-center justify-center px-4 py-3 text-[16px] font-semibold text-gray-600 hover:bg-gray-100 rounded-md transition cursor-pointer w-fit">
            <i className="fa-regular fa-comment me-2"></i> Comment
          </button>
        </div>
        {post.privacy === 'public' && (
          <div className="flex-1 flex justify-center">
            <Shere 
              postId={post._id} 
              postImage={post.image} 
              postContent={post.body} 
              userName={post.user?.name} 
            />
          </div>
        )}
      </div>

      <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
        {post.commentsCount > 0 && !isId && (
          <Link
            to={`/PostDetails/${post._id}`}
            className="text-[15px] font-semibold text-blue-600 hover:underline mb-3 inline-block cursor-pointer"
          >
            View more comments
          </Link>
        )}

        <div className="w-full mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden border border-gray-200 shadow-sm">
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
          <CreateComment postId={post._id} />
        </div>

        {post.topComment && !isId && (
          <div className="mt-2">
            <CommentsList postId={post._id} limit={2} />
          </div>
        )}
      </div> 
    </div>
  );
}