import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./PostCard.module.css";

export default function PostCard({ post, selected, viewerId, authorName, onSelect, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);
  const owned = String(post.userId) === String(viewerId);

  async function save() {
    await onEdit(post.id, { title: title.trim(), body: body.trim() });
    setEditing(false);
  }

  return (
    <article className={`${styles.card} ${selected ? styles.selected : ""}`}>
      <header className={styles.header}>
        <span className={styles.id}>#{post.id}</span>
        {editing ? (
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={styles.titleInput} />
        ) : (
          <h3 className={styles.title}>{post.title}</h3>
        )}
        {authorName && <span className={styles.author}>by {authorName}</span>}
      </header>

      {selected && (
        <div className={styles.body}>
          {editing ? (
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} />
          ) : (
            <p>{post.body}</p>
          )}
          <div className={styles.actions}>
            {!editing && <Link to={`/users/${viewerId}/posts/${post.id}`} className={styles.action}>Show comments</Link>}
            {owned && !editing && <button type="button" className={styles.action} onClick={() => setEditing(true)}>Edit</button>}
            {owned && editing && (
              <>
                <button type="button" className={styles.action} onClick={save}>Save</button>
                <button type="button" className={styles.action} onClick={() => { setEditing(false); setTitle(post.title); setBody(post.body); }}>Cancel</button>
              </>
            )}
            {owned && !editing && <button type="button" className={styles.actionDanger} onClick={() => onDelete(post.id)}>Delete</button>}
          </div>
        </div>
      )}

      {!selected && (
        <button type="button" className={styles.selectBtn} onClick={() => onSelect(post.id)}>Select</button>
      )}
    </article>
  );
}
