# TODO

- [x] Add `comment-deleted` event dispatch after successful comment delete in `src/componanet/deletePost/DeletePost.jsx`.
- [x] Update `src/componanet/comments/CommentsList.jsx` to listen to `comment-deleted` and clear `allComments` + trigger refetch.
- [x] Ensure change does not affect posts delete flow (`inPost=true`).
- [ ] Manual test: delete a comment and confirm it disappears immediately.


