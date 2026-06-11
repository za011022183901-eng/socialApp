 import React from 'react'
import PostCard from '../PostCard/PostCard'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import CommentsList from '../comments/CommentsList'

export default function PostDetails() {
  const { id } = useParams()




  function getPostDetails() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('tkn')}`
      }
    })
  }



  const { data, isLoading, isError } = useQuery({
    queryKey: ['getSinglePost', id],
    queryFn: getPostDetails,
  })


 // 💡 السطر ده بقى سهل ومباشر لأن ده المسار الفعلي للداتا اللي راجعة


  const post =
    data?.data?.post ??
    data?.data?.data?.post ??
    data?.post




  if (isLoading) return <div className="text-center py-5">Loading...</div>
  if (isError) return <div className="text-center py-5 text-danger">Error loading post</div>










  return (
    <>
      <div className="max-w-4xl mx-auto my-20 p-8 bg-white rounded-3xl shadow-md border border-gray-150 overflow-hidden">
        {post ? (
          <>
            <PostCard post={post} isId={true} />
            <CommentsList postId={post.id ?? id} limit={2} />
          </>
        ) : (
          <div className="text-center py-16 text-gray-500 font-medium text-lg">No post found.</div>
        )}

      </div>
    </>
  )
}























































