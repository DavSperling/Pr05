import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./AlbumCard.module.css";

export default function AlbumCard({ album, viewerId, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(album.title);

  async function save() {
    await onEdit(album.id, { title: title.trim() });
    setEditing(false);
  }

  return (
    <article className={styles.card}>
      <span className={styles.id}>#{album.id}</span>
      {editing ? (
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={styles.titleInput} />
      ) : (
        <Link to={`/users/${viewerId}/albums/${album.id}/photos`} className={styles.title}>
          {album.title}
        </Link>
      )}
      <div className={styles.actions}>
        {editing ? (
          <>
            <button type="button" className={styles.btn} onClick={save}>Save</button>
            <button type="button" className={styles.btn} onClick={() => { setEditing(false); setTitle(album.title); }}>Cancel</button>
          </>
        ) : (
          <>
            <button type="button" className={styles.btn} onClick={() => setEditing(true)}>Edit</button>
            <button type="button" className={styles.btnDanger} onClick={() => onDelete(album.id)}>Delete</button>
          </>
        )}
      </div>
    </article>
  );
}
