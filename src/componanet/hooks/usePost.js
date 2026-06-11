import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export default function usePost() {




  const getAllPosts = async () => {
    // بنرجع الطلب مباشرة، و Axios هيرجع الـ Promise
    return axios.get('https://route-posts.routemisr.com/posts?limit=90', {
      headers: {
        AUTHORIZATION: `Bearer ${localStorage.getItem('tkn')}`
      }
    });
  };

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['getposts'], 
    queryFn: getAllPosts, 
    refetchInterval: 30000, 
    refetchOnMount: true, 
    retry: 3, 
    retryDelay: 5000, 
    staleTime: 10000 
  });

  const posts = data?.data?.data.posts; 



 return  {data, error, isLoading, refetch , posts}   
}
