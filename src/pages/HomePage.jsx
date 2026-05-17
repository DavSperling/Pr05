import { listTodosByUser } from "../api/todos.js";
import { listPostsByUser } from "../api/posts.js";
import { listAlbumsByUser } from "../api/albums.js";
import { useAuth } from "../hooks/useAuth.js";
import { useResource } from "../hooks/useResource.js";
import TopBar from "../components/TopBar.jsx";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const { currentUser } = useAuth();
  const userId = currentUser.id;

  const todos = useResource(`todos?userId=${userId}`, () => listTodosByUser(userId));
  const posts = useResource(`posts?userId=${userId}`, () => listPostsByUser(userId));
  const albums = useResource(`albums?userId=${userId}`, () => listAlbumsByUser(userId));

  return (
    <>
      <TopBar />
      <main className={styles.main}>
        <h1 className={styles.greeting}>Hello, {currentUser.name}.</h1>
        <p className={styles.tagline}>Here is your activity at a glance.</p>
        <div className={styles.grid}>
          <Stat label="Todos" value={todos.data?.length} loading={todos.loading} />
          <Stat label="Posts" value={posts.data?.length} loading={posts.loading} />
          <Stat label="Albums" value={albums.data?.length} loading={albums.loading} />
        </div>
      </main>
    </>
  );
}

function Stat({ label, value, loading }) {
  return (
    <div className={styles.card}>
      <div className={styles.value}>{loading ? "..." : (value ?? 0)}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}
