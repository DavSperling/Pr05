import { useEffect } from "react";
import { getUser } from "../api/users.js";
import { useResource } from "../hooks/useResource.js";
import styles from "./UserInfoModal.module.css";

export default function UserInfoModal({ userId, onClose }) {
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const { data: user, loading, error } = useResource(
    `users/${userId}`,
    () => getUser(userId),
  );

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Close">x</button>
        <h2 className={styles.title}>My information</h2>
        {loading && <p>Loading...</p>}
        {error && <p className={styles.error}>{error.message}</p>}
        {user && (
          <dl className={styles.list}>
            <dt>Name</dt><dd>{user.name}</dd>
            <dt>Username</dt><dd>{user.username}</dd>
            <dt>Email</dt><dd>{user.email}</dd>
            <dt>Phone</dt><dd>{user.phone}</dd>
            <dt>Website</dt><dd>{user.website}</dd>
            <dt>Address</dt><dd>{[user.address?.street, user.address?.suite, user.address?.city].filter(Boolean).join(", ")}</dd>
            <dt>Company</dt><dd>{user.company?.name}</dd>
          </dl>
        )}
      </div>
    </div>
  );
}
