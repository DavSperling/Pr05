import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { DataProvider } from "./contexts/DataContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import OwnerRoute from "./components/OwnerRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import RegisterDetailsPage from "./pages/RegisterDetailsPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import TodosPage from "./pages/TodosPage.jsx";
import PostsPage from "./pages/PostsPage.jsx";
import PostDetailPage from "./pages/PostDetailPage.jsx";
import AlbumsPage from "./pages/AlbumsPage.jsx";
import AlbumDetailPage from "./pages/AlbumDetailPage.jsx";

export default function App() {
  return (
    // AuthProvider provides the authentication context to the app, and DataProvider provides a simple caching layer for API data.
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/register/details" element={<RegisterDetailsPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/users/:userId/posts/feed" element={<PostsPage feed />} />
              <Route path="/users/:userId/posts/:postId" element={<PostDetailPage />} />

              <Route element={<OwnerRoute />}>
                <Route path="/users/:userId/todos" element={<TodosPage />} />
                <Route path="/users/:userId/posts" element={<PostsPage />} />
                <Route path="/users/:userId/albums" element={<AlbumsPage />} />
                <Route
                  path="/users/:userId/albums/:albumId/photos"
                  element={<AlbumDetailPage />}
                />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}
