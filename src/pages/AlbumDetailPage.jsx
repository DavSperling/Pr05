import { Link, useParams } from "react-router-dom";
import TopBar from "../components/TopBar.jsx";
import PhotoGrid from "../components/PhotoGrid.jsx";
import { getAlbum } from "../api/albums.js";
import { useResource } from "../hooks/useResource.js";
import styles from "./AlbumDetailPage.module.css";

export default function AlbumDetailPage() {
  const { userId, albumId } = useParams();
  const { data: album, loading, error } = useResource(`albums/${albumId}`, () => getAlbum(albumId));

  return (
    <>
      <TopBar />
      <main className={styles.main}>
        <Link to={`/users/${userId}/albums`} className={styles.back}>&larr; Back to albums</Link>
        {loading && <p>Loading...</p>}
        {error && <p className={styles.error}>{error.message}</p>}
        {album && (
          <header className={styles.header}>
            <span className={styles.id}>#{album.id}</span>
            <h1 className={styles.title}>{album.title}</h1>
          </header>
        )}
        <PhotoGrid albumId={albumId} />
      </main>
    </>
  );
}
