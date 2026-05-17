import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import TopBar from "../components/TopBar.jsx";
import CommentList from "../components/CommentList.jsx";
import { createComment, deleteComment, listCommentsByPost, updateComment } from "../api/comments.js";
import { getPost } from "../api/posts.js";
import { DataContext } from "../contexts/DataContext.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useResource } from "../hooks/useResource.js";
import styles from "./PostDetailPage.module.css";

export default function PostDetailPage() {
  const { currentUser } = useAuth();
  const { postId, userId } = useParams();
  const cache = useContext(DataContext);
  const postKey = `posts/${postId}`;
  const commentsKey = `comments?postId=${postId}`;

  const { data: post, loading: postLoading, error: postError } = useResource(postKey, () => getPost(postId));
  const { data: comments, loading: cmtLoading, error: cmtError } = useResource(commentsKey, () => listCommentsByPost(postId));

  async function handleAdd(body) {
    const created = await createComment({
      postId: Number(postId),
      name: currentUser.name,
      email: currentUser.email,
      body,
    });
    cache.set(commentsKey, [...(cache.get(commentsKey) ?? []), created]);
  }

  async function handleEdit(id, patch) {
    const target = (cache.get(commentsKey) ?? []).find((c) => c.id === id);
    if (!target || target.email !== currentUser.email) throw new Error("Not authorized");
    const updated = await updateComment(id, patch);
    cache.set(commentsKey, (cache.get(commentsKey) ?? []).map((c) => (c.id === id ? updated : c)));
  }

  async function handleDelete(id) {
    const target = (cache.get(commentsKey) ?? []).find((c) => c.id === id);
    if (!target || target.email !== currentUser.email) throw new Error("Not authorized");
    await deleteComment(id);
    cache.set(commentsKey, (cache.get(commentsKey) ?? []).filter((c) => c.id !== id));
  }

  return (
    <>
      <TopBar />
      <main className={styles.main}>
        <Link to={`/users/${userId}/posts`} className={styles.back}>&larr; Back to posts</Link>
        {postLoading && <p>Loading...</p>}
        {postError && <p className={styles.error}>{postError.message}</p>}
        {post && (
          <article className={styles.article}>
            <header className={styles.header}>
              <span className={styles.id}>#{post.id}</span>
              <h1 className={styles.title}>{post.title}</h1>
            </header>
            <p className={styles.body}>{post.body}</p>
          </article>
        )}
        {cmtError && <p className={styles.error}>{cmtError.message}</p>}
        {cmtLoading && <p>Loading comments...</p>}
        {comments && (
          <CommentList
            comments={comments}
            viewerEmail={currentUser.email}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </main>
    </>
  );
}
