//  import React from 'react'
// import PostCard from '../PostCard/PostCard'
// import axios from 'axios'
// import { useParams } from 'react-router-dom'
// import { useQuery } from '@tanstack/react-query'
// import CommentsList from '../comments/CommentsList'

// export default function PostDetails() {
//   const { id } = useParams()




//   function getPostDetails() {
//     return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('tkn')}`
//       }
//     })
//   }



//   const { data, isLoading, isError } = useQuery({
//     queryKey: ['getSinglePost', id],
//     queryFn: getPostDetails,
//   })


//  // 💡 السطر ده بقى سهل ومباشر لأن ده المسار الفعلي للداتا اللي راجعة


//   const post =
//     data?.data?.post ??
//     data?.data?.data?.post ??
//     data?.post




//   if (isLoading) return <div className="text-center py-5">Loading...</div>
//   if (isError) return <div className="text-center py-5 text-danger">Error loading post</div>










//   return (
//     <>
//       <div className="max-w-4xl mx-auto my-20 p-8 bg-white rounded-3xl shadow-md border border-gray-150 overflow-hidden">
//         {post ? (
//           <>
//             <PostCard post={post} isId={true} />
//             <CommentsList postId={post.id ?? id} limit={2} />
//           </>
//         ) : (
//           <div className="text-center py-16 text-gray-500 font-medium text-lg">No post found.</div>
//         )}

//       </div>
//     </>
//   )
// }






 import React from 'react'
import PostCard from '../PostCard/PostCard'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom' // 1. أضفنا Link هنا
import { useQuery } from '@tanstack/react-query'
import CommentsList from '../comments/CommentsList'

export default function PostDetails() {
  const { id } = useParams()

  function getPostDetails() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        token: localStorage.getItem('tkn') // ملحوظة: Route API بيستخدم token مش Bearer في العادة
      }
    })
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getSinglePost', id],
    queryFn: getPostDetails,
  })

  const post = data?.data?.post || data?.data?.data?.post || data?.post

  if (isLoading) return <div className="text-center py-20"><i className="fa-solid fa-spinner fa-spin text-3xl text-blue-600"></i></div>
  
  // 2. تعديل حالة الخطأ أو عدم وجود المنشور
  if (isError || !post) {
    return (
      <div className="max-w-4xl mx-auto my-20 p-12 bg-white rounded-3xl shadow-sm border border-gray-100 text-center">
        <div className="mb-6">
           <i className="fa-solid fa-magnifying-glass text-gray-300 text-6xl"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Post not found</h2>
        <p className="text-gray-500 mb-8">Would you like to go back to the home page?</p>
        
        <Link 
          to="/" 
          className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-100"
        >
          <i className="fa-solid fa-house me-2"></i>
          Back to Home Page
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto my-20 p-8 bg-white rounded-3xl shadow-md border border-gray-150 overflow-hidden">
        <PostCard post={post} isId={true} />
        <CommentsList postId={post.id ?? id} />
    </div>
  )
}
















































