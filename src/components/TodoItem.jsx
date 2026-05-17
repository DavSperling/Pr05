import { useState } from "react";
import styles from "./TodoItem.module.css";

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  async function commitEdit() {
    const next = title.trim();
    if (next && next !== todo.title) {
      await onEdit(todo.id, { title: next });
    }
    setEditing(false);
  }

  return (
    <li className={styles.row}>
      <span className={styles.id}>#{todo.id}</span>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={(e) => onToggle(todo.id, e.target.checked)}
        className={styles.check}
      />
      {editing ? (
        <input
          className={styles.editInput}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") { setTitle(todo.title); setEditing(false); } }}
          autoFocus
        />
      ) : (
        <span className={`${styles.title} ${todo.completed ? styles.done : ""}`} onDoubleClick={() => setEditing(true)}>
          {todo.title}
        </span>
      )}
      <button type="button" className={styles.btn} onClick={() => setEditing((v) => !v)}>
        {editing ? "Cancel" : "Edit"}
      </button>
      <button type="button" className={styles.btnDanger} onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
}
