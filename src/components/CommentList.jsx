import { useState } from "react";
import styles from "./CommentList.module.css";

export default function CommentList({ comments, viewerEmail, onAdd, onEdit, onDelete }) {
  const [draft, setDraft] = useState("");

  async function submitNew(event) {
    event.preventDefault();
    if (!draft.trim()) return;
    await onAdd(draft.trim());
    setDraft("");
  }

  return (
    <section className={styles.section}>
      <h3 className={styles.heading}>Comments ({comments.length})</h3>

      <form className={styles.addRow} onSubmit={submitNew}>
        <textarea
          rows={2}
          placeholder="Write a comment..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="submit" className={styles.btn}>Comment</button>
      </form>

      <ul className={styles.list}>
        {comments.map((c) => (
          <CommentRow
            key={c.id}
            comment={c}
            owned={c.email === viewerEmail}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </section>
  );
}

function CommentRow({ comment, owned, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(comment.body);

  async function save() {
    await onEdit(comment.id, { body: body.trim() });
    setEditing(false);
  }

  return (
    <li className={styles.row}>
      <div className={styles.author}>
        <strong>{comment.name}</strong>
        <span className={styles.email}>{comment.email}</span>
      </div>
      {editing ? (
        <textarea rows={2} value={body} onChange={(e) => setBody(e.target.value)} />
      ) : (
        <p className={styles.body}>{comment.body}</p>
      )}
      {owned && (
        <div className={styles.actions}>
          {editing ? (
            <>
              <button type="button" className={styles.btn} onClick={save}>Save</button>
              <button type="button" className={styles.btn} onClick={() => { setEditing(false); setBody(comment.body); }}>Cancel</button>
            </>
          ) : (
            <>
              <button type="button" className={styles.btn} onClick={() => setEditing(true)}>Edit</button>
              <button type="button" className={styles.btnDanger} onClick={() => onDelete(comment.id)}>Delete</button>
            </>
          )}
        </div>
      )}
    </li>
  );
}
