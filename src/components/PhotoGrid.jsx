import { useContext, useEffect, useState } from "react";
import { createPhoto, deletePhoto, listPhotosByAlbum, updatePhoto } from "../api/photos.js";
import { DataContext } from "../contexts/DataContext.jsx";
import styles from "./PhotoGrid.module.css";

const PAGE_SIZE = 12;

export default function PhotoGrid({ albumId }) {
  const cache = useContext(DataContext);
  const [pages, setPages] = useState(1);
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // lightbox - the photo currently shown in the lightbox, or null if the lightbox is closed
  const [lightbox, setLightbox] = useState(null);
  // adding - whether the "add new photo" form is currently open
  const [adding, setAdding] = useState(false);
  // newTitle - the title of the new photo being added
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    setItems([]);
    setPages(1);
    setHasMore(true);
  }, [albumId]);

  useEffect(() => {
    let active = true;
    async function load() {
      const key = `photos?albumId=${albumId}&page=${pages}`;
      const cached = cache.get(key);
      if (cached !== undefined) {
        if (!active) return;
        setItems((prev) => mergePage(prev, cached));
        setHasMore(cached.length === PAGE_SIZE);
        return;
      }
      setLoading(true);
      try {
        const fresh = await listPhotosByAlbum(albumId, pages, PAGE_SIZE);
        if (!active) return;
        cache.set(key, fresh);
        setItems((prev) => mergePage(prev, fresh));
        setHasMore(fresh.length === PAGE_SIZE);
      } catch (err) {
        if (active) setError(err);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [albumId, pages, cache]);

  function mergePage(prev, page) {
    const seen = new Set(prev.map((p) => p.id));
    return [...prev, ...page.filter((p) => !seen.has(p.id))];
  }

  async function handleAdd(event) {
    event.preventDefault();
    if (!newTitle.trim()) return;
    const seed = Math.floor(Math.random() * 100000);
    const created = await createPhoto({
      albumId: Number(albumId),
      title: newTitle.trim(),
      thumbnailUrl: `https://picsum.photos/seed/photo${seed}/150/150`,
      url: `https://picsum.photos/seed/photo${seed}/600/400`,
    });
    setItems((prev) => [created, ...prev]);
    cache.invalidate(`photos?albumId=${albumId}`);
    setAdding(false);
    setNewTitle("");
  }

  async function handleDelete(id) {
    await deletePhoto(id);
    setItems((prev) => prev.filter((p) => p.id !== id));
    cache.invalidate(`photos?albumId=${albumId}`);
  }

  async function handleRename(photo) {
    const next = prompt("New title", photo.title);
    if (!next || next === photo.title) return;
    const updated = await updatePhoto(photo.id, { title: next.trim() });
    setItems((prev) => prev.map((p) => (p.id === photo.id ? updated : p)));
    cache.invalidate(`photos?albumId=${albumId}`);
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        {adding ? (
          <form className={styles.addForm} onSubmit={handleAdd}>
            <input
              autoFocus
              placeholder="Photo title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <button type="submit" className={styles.btnPrimary}>Add</button>
            <button type="button" className={styles.btn} onClick={() => { setAdding(false); setNewTitle(""); }}>Cancel</button>
          </form>
        ) : (
          <button type="button" className={styles.btnPrimary} onClick={() => setAdding(true)}>+ Add photo</button>
        )}
      </div>

      {error && <p className={styles.error}>{error.message}</p>}

      <div className={styles.grid}>
        {items.map((photo) => (
          <figure key={photo.id} className={styles.tile}>
            <img
              src={photo.thumbnailUrl}
              alt={photo.title}
              loading="lazy"
              onClick={() => setLightbox(photo)}
            />
            <figcaption className={styles.caption}>{photo.title}</figcaption>
            <div className={styles.tileActions}>
              <button type="button" className={styles.btn} onClick={() => handleRename(photo)}>Rename</button>
              <button type="button" className={styles.btnDanger} onClick={() => handleDelete(photo.id)}>Delete</button>
            </div>
          </figure>
        ))}
      </div>

      <div className={styles.more}>
        {loading && <span>Loading...</span>}
        {!loading && hasMore && (
          <button type="button" className={styles.loadMore} onClick={() => setPages((p) => p + 1)}>
            Load more
          </button>
        )}
        {!hasMore && items.length > 0 && <span className={styles.end}>No more photos.</span>}
      </div>

      {lightbox && (
        <div className={styles.lightbox} onClick={() => setLightbox(null)}>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.url} alt={lightbox.title} />
            <figcaption>{lightbox.title}</figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}
