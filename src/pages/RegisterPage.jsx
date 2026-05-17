import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { findUserByUsername } from "../api/users.js";
import { useAuth } from "../hooks/useAuth.js";
import styles from "./RegisterPage.module.css";

export default function RegisterPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verify, setVerify] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  if (currentUser) return <Navigate to="/home" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    if (password !== verify) {
      setError("Passwords do not match");
      return;
    }
    if (!username.trim() || !password) {
      setError("Username and password are required");
      return;
    }
    setBusy(true);
    try {
      const existing = await findUserByUsername(username.trim());
      if (existing) {
        setError("Username already taken");
        return;
      }
      navigate("/register/details", {
        state: { username: username.trim(), password },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Create account</h1>
        <label className={styles.field}>
          <span>Username</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            required
          />
        </label>
        <label className={styles.field}>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label className={styles.field}>
          <span>Confirm password</span>
          <input
            type="password"
            value={verify}
            onChange={(e) => setVerify(e.target.value)}
            required
          />
        </label>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.submit} disabled={busy}>
          {busy ? "Checking..." : "Continue"}
        </button>
        <p className={styles.alt}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
