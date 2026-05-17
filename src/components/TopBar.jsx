import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { DataContext } from "../contexts/DataContext.jsx";
import UserInfoModal from "./UserInfoModal.jsx";
import styles from "./TopBar.module.css";

export default function TopBar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const cache = useContext(DataContext);
  const [infoOpen, setInfoOpen] = useState(false);

  if (!currentUser) return null;

  function handleLogout() {
    logout();
    cache.clear();
    navigate("/login", { replace: true });
  }

  const base = `/users/${currentUser.id}`;

  return (
    <header className={styles.bar}>
      <div className={styles.left}>
        <NavLink to="/home" className={styles.brand}>Pr05</NavLink>
      </div>
      <div className={styles.center}>
        <span className={styles.fullName}>{currentUser.name}</span>
      </div>
      <nav className={styles.right}>
        <button type="button" onClick={() => setInfoOpen(true)} className={styles.link}>Info</button>
        <NavLink to={`${base}/todos`} className={({ isActive }) => isActive ? styles.linkActive : styles.link}>Todos</NavLink>
        <NavLink to={`${base}/posts`} className={({ isActive }) => isActive ? styles.linkActive : styles.link}>Posts</NavLink>
        <NavLink to={`${base}/albums`} className={({ isActive }) => isActive ? styles.linkActive : styles.link}>Albums</NavLink>
        <button type="button" onClick={handleLogout} className={styles.logout}>Logout</button>
      </nav>

      {infoOpen && (
        <UserInfoModal userId={currentUser.id} onClose={() => setInfoOpen(false)} />
      )}
    </header>
  );
}
