import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import styles from "./RegisterPage.module.css";

export default function RegisterDetailsPage() {
  const { register, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const handoff = location.state;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  if (currentUser) return <Navigate to="/home" replace />;
  if (!handoff?.username) return <Navigate to="/register" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await register({
        username: handoff.username,
        password: handoff.password,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        website: website.trim() || "user.local",
        address: { street: street.trim(), city: city.trim() },
        company: { name: companyName.trim() },
      });
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Tell us about you</h1>
        <p className={styles.subtitle}>Signing up as <strong>{handoff.username}</strong></p>
        <label className={styles.field}>
          <span>Full name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className={styles.field}>
          <span>Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className={styles.field}>
          <span>Phone</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label className={styles.field}>
          <span>Website</span>
          <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="user.local" />
        </label>
        <label className={styles.field}>
          <span>Street</span>
          <input value={street} onChange={(e) => setStreet(e.target.value)} />
        </label>
        <label className={styles.field}>
          <span>City</span>
          <input value={city} onChange={(e) => setCity(e.target.value)} />
        </label>
        <label className={styles.field}>
          <span>Company name</span>
          <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        </label>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.submit} disabled={busy}>
          {busy ? "Creating..." : "Create account"}
        </button>
      </form>
    </div>
  );
}
