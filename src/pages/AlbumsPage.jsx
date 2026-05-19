import { useContext, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TopBar from "../components/TopBar.jsx";
import AlbumCard from "../components/AlbumCard.jsx";
import { createAlbum, deleteAlbum, listAlbumsByUser, updateAlbum } from "../api/albums.js";
import { deletePhoto, listAllPhotosByAlbum } from "../api/photos.js";
import { DataContext } from "../contexts/DataContext.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useDebounce } from "../hooks/useDebounce.js";
import { useResource } from "../hooks/useResource.js";
import styles from "./AlbumsPage.module.css";

export default function AlbumsPage() {
  const { currentUser } = useAuth();
  const userId = currentUser.id;
  const cache = useContext(DataContext);
  const key = `albums?userId=${userId}`;

  const { data: albums, loading, error } = useResource(key, () => listAlbumsByUser(userId));

  const [searchParams, setSearchParams] = useSearchParams();
  const queryId = searchParams.get("id") ?? "";
  const queryTitle = searchParams.get("q") ?? "";
  // debouncedTitle - a debounced version of queryTitle that only updates after the user has stopped typing for a short delay, preventing excessive filtering while the user is still entering their search.
  const debouncedTitle = useDebounce(queryTitle, 200);
  const [newTitle, setNewTitle] = useState("");

  function updateParam(param, value) {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(param); else next.set(param, value);
    setSearchParams(next, { replace: true });
  }

  // filtered - the list of albums filtered according to the current search parameters, memoized to avoid unnecessary recalculations the solution of the filter on every render.
  const filtered = useMemo(() => {
    if (!albums) return [];
    return albums
      .filter((a) => (queryId === "" ? true : String(a.id) === queryId.trim()))
      .filter((a) => (debouncedTitle === "" ? true : a.title.toLowerCase().includes(debouncedTitle.toLowerCase())));
  }, [albums, queryId, debouncedTitle]);

  async function handleAdd(event) {
    event.preventDefault();
    if (!newTitle.trim()) return;
    const created = await createAlbum({ title: newTitle.trim(), userId });
    cache.set(key, [created, ...albums]);
    setNewTitle("");
  }

  async function handleEdit(id, patch) {
    const target = (cache.get(key) ?? []).find((a) => a.id === id);
    if (!target || String(target.userId) !== String(userId)) throw new Error("Not authorized");
    const updated = await updateAlbum(id, patch);
    cache.set(key, albums.map((a) => (a.id === id ? updated : a)));
  }

  async function handleDelete(id) {
    const target = (cache.get(key) ?? []).find((a) => a.id === id);
    if (!target || String(target.userId) !== String(userId)) throw new Error("Not authorized");
    try {
      const photos = await listAllPhotosByAlbum(id);
      for (const photo of photos) {
        try { await deletePhoto(photo.id); } catch { /* already gone */ }
      }
    } catch { /* listing failed — proceed to album delete anyway */ }
    try {
      await deleteAlbum(id);
    } catch (err) {
      if (!String(err?.message ?? "").includes("(404)")) throw err;
    }
    const list = cache.get(key);
    if (Array.isArray(list)) cache.set(key, list.filter((a) => a.id !== id));
    cache.invalidate(`photos?albumId=${id}`);
  }

  return (
    <>
      <TopBar />
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>My albums</h1>
          <p className={styles.count}>{filtered.length} of {albums?.length ?? 0}</p>
        </header>

        <form className={styles.addRow} onSubmit={handleAdd}>
          <input placeholder="New album title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          <button type="submit" className={styles.addBtn}>Add album</button>
        </form>

        <section className={styles.controls}>
          <label className={styles.control}><span>Search by ID</span><input value={queryId} onChange={(e) => updateParam("id", e.target.value)} /></label>
          <label className={styles.control}><span>Search title</span><input value={queryTitle} onChange={(e) => updateParam("q", e.target.value)} /></label>
        </section>

        {loading && <p>Loading albums...</p>}
        {error && <p className={styles.error}>{error.message}</p>}

        <div className={styles.list}>
          {filtered.map((a) => (
            <AlbumCard key={a.id} album={a} viewerId={userId} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      </main>
    </>
  );
}
