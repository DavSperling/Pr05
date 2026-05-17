import { useContext, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import TopBar from "../components/TopBar.jsx";
import PostCard from "../components/PostCard.jsx";
import { createPost, deletePost, listAllPosts, listPostsByUser, updatePost } from "../api/posts.js";
import { apiGet } from "../api/client.js";
import { DataContext } from "../contexts/DataContext.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useDebounce } from "../hooks/useDebounce.js";
import { useResource } from "../hooks/useResource.js";
import styles from "./PostsPage.module.css";

export default function PostsPage({ feed = false }) {
  const { currentUser } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();
  const cache = useContext(DataContext);

  const myKey = `posts?userId=${currentUser.id}`;
  const allKey = `posts`;
  const cacheKey = feed ? allKey : myKey;

  const { data: posts, loading, error } = useResource(
    cacheKey,
    () => (feed ? listAllPosts() : listPostsByUser(currentUser.id)),
  );

  const authorMapKey = `users-map`;
  const { data: usersMap } = useResource(
    feed ? authorMapKey : null,
    async () => {
      const users = await apiGet("/users");
      return Object.fromEntries(users.map((u) => [u.id, u.name]));
    },
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const queryId = searchParams.get("id") ?? "";
  const queryTitle = searchParams.get("q") ?? "";
  const selectedId = searchParams.get("post");
  const debouncedTitle = useDebounce(queryTitle, 200);

  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(key); else next.set(key, value);
    setSearchParams(next, { replace: true });
  }

  const filtered = useMemo(() => {
    if (!posts) return [];
    return posts
      .filter((p) => (feed ? String(p.userId) !== String(currentUser.id) : true))
      .filter((p) => (queryId === "" ? true : String(p.id) === queryId.trim()))
      .filter((p) => (debouncedTitle === "" ? true : p.title.toLowerCase().includes(debouncedTitle.toLowerCase())));
  }, [posts, feed, currentUser.id, queryId, debouncedTitle]);

  async function handleAdd(event) {
    event.preventDefault();
    if (!newTitle.trim()) return;
    const created = await createPost({ title: newTitle.trim(), body: newBody.trim(), userId: currentUser.id });
    cache.set(myKey, [created, ...(cache.get(myKey) ?? [])]);
    cache.invalidate(allKey);
    setNewTitle(""); setNewBody("");
  }

  async function handleEdit(id, patch) {
    if (feed) throw new Error("Editing other users' posts is not allowed");
    const updated = await updatePost(id, patch);
    cache.set(myKey, (cache.get(myKey) ?? []).map((p) => (p.id === id ? updated : p)));
    cache.invalidate(allKey);
  }

  async function handleDelete(id) {
    if (feed) throw new Error("Deleting other users' posts is not allowed");
    await deletePost(id);
    cache.set(myKey, (cache.get(myKey) ?? []).filter((p) => p.id !== id));
    cache.invalidate(allKey);
  }

  return (
    <>
      <TopBar />
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>{feed ? "All users' posts" : "My posts"}</h1>
          {feed ? (
            <Link className={styles.toggle} to={`/users/${currentUser.id}/posts`}>Back to my posts</Link>
          ) : (
            <Link className={styles.toggle} to={`/users/${currentUser.id}/posts/feed`}>See other users' posts</Link>
          )}
        </header>

        {!feed && (
          <form className={styles.addRow} onSubmit={handleAdd}>
            <input placeholder="New post title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <textarea placeholder="Body" rows={2} value={newBody} onChange={(e) => setNewBody(e.target.value)} />
            <button type="submit" className={styles.addBtn}>Add post</button>
          </form>
        )}

        <section className={styles.controls}>
          <label className={styles.control}>
            <span>Search by ID</span>
            <input value={queryId} onChange={(e) => updateParam("id", e.target.value)} />
          </label>
          <label className={styles.control}>
            <span>Search title</span>
            <input value={queryTitle} onChange={(e) => updateParam("q", e.target.value)} />
          </label>
        </section>

        {loading && <p>Loading posts...</p>}
        {error && <p className={styles.error}>{error.message}</p>}

        <div className={styles.list}>
          {filtered.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              viewerId={currentUser.id}
              authorName={feed ? usersMap?.[p.userId] : null}
              selected={String(p.id) === selectedId}
              onSelect={(id) => feed
                ? navigate(`/users/${currentUser.id}/posts/${id}`)
                : updateParam("post", String(id))}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </main>
    </>
  );
}
