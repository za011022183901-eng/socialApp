import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import CommentCard from '../commentCard/commentCard';

export default function CommentsList({ postId, initialPage = 1, limit = 2 }) {
  const [page, setPage] = useState(initialPage);
  const [allComments, setAllComments] = useState([]);

  const getComments = async () => {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${postId}/comments?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tkn')}`,
        },
      }
    );
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['postComments', postId, page, limit],
    queryFn: getComments,
    enabled: !!postId,
    keepPreviousData: true,
  });

  const commentsPage = useMemo(() => {
    return (
      data?.data?.comments ??
      data?.data?.data?.comments ??
      data?.comments ??
      []
    );
  }, [data]);

  useEffect(() => {
    setPage(initialPage);
    setAllComments([]);
  }, [postId, initialPage]);

  useEffect(() => {
    const handler = (e) => {
      const changedPostId = e?.detail?.postId;
      const deletedCommentId = e?.detail?.commentId;
      if (changedPostId && String(changedPostId) !== String(postId)) return;

      if (deletedCommentId) {
        setAllComments((prev) =>
          prev.filter((c) => String(c?._id ?? c?.id) !== String(deletedCommentId))
        );
      } else {
        setAllComments([]);
      }

      setPage(initialPage);
    };

    window.addEventListener('comment-created', handler);
    window.addEventListener('comment-deleted', handler);

    return () => {
      window.removeEventListener('comment-created', handler);
      window.removeEventListener('comment-deleted', handler);
    };
  }, [postId, initialPage]);

  useEffect(() => {
    if (!commentsPage?.length) {
      if (page === initialPage) setAllComments([]);
      return;
    }

    setAllComments((prev) => {
      if (page === initialPage) {
        return commentsPage;
      }

      const map = new Map();

      for (const c of prev) {
        const key = c?._id ?? c?.id;
        if (key) map.set(key, c);
      }

      for (const c of commentsPage) {
        const key = c?._id ?? c?.id;
        if (key && !map.has(key)) map.set(key, c);
      }

      return Array.from(map.values());
    });
  }, [commentsPage, page, initialPage]);

  const comments = allComments;

  if (isLoading) return <div className="text-center py-4">Loading comments...</div>;
  if (isError)
    return <div className="text-center py-4 text-red-600">Error loading comments</div>;

  if (!comments?.length)
    return <div className="text-center py-4 text-gray-500">No comments found.</div>;

  const hasMore = commentsPage?.length === limit;

  return (
    <div className="mt-4">
      <div className="space-y-3">
        {comments.map((c, idx) => (
          <CommentCard key={c?._id ?? c?.id ?? idx} commentDetials={c} />
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setPage((p) => p + 1)}
          className="mt-4 w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Load more
        </button>
      )}
    </div>
  );
}

