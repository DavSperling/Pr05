# Pr05 — React + JSON-Server App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-developer React SPA backed by a local JSON-Server REST API: login/register/home, full CRUD over Todos/Posts/Comments/Albums/Photos for the active user, plus the three Part-ז extensions (refresh resilience, client cache, user isolation).

**Architecture:** Vite + React 19 + React Router v7. Two React Contexts (`AuthContext` for the current user, `DataContext` for the in-memory cache). All HTTP through `fetch` + `async/await`, centralised in `src/api/*`. JSON-Server reads/writes `server/db.json` on port 3001. Styling uses CSS Modules + a single `theme.css` with CSS variables.

**Tech Stack:** React 19, React Router 7, Vite, json-server, concurrently. No UI library. No automated test suite (oral-defense academic project per spec §12).

**Working directory for all paths below:** `Pr05/` (the project root inside the course monorepo). Paths are written relative to this directory unless prefixed with `Pr05/`.

**Convention:** All identifiers, JSX text, comments, and JSON keys are in English.

---

## File map

| Path | Purpose |
|---|---|
| `package.json` | npm metadata, scripts, dependencies |
| `vite.config.js` | Vite config (React plugin, dev server port 5173) |
| `index.html` | Vite entry HTML |
| `server/db.json` | json-server database |
| `src/main.jsx` | React bootstrap |
| `src/App.jsx` | Top-level component, router, providers |
| `src/styles/theme.css` | CSS variables + base resets |
| `src/api/client.js` | base `fetch` wrapper |
| `src/api/users.js` | user-resource calls |
| `src/api/todos.js` | todo-resource calls |
| `src/api/posts.js` | post-resource calls |
| `src/api/comments.js` | comment-resource calls |
| `src/api/albums.js` | album-resource calls |
| `src/api/photos.js` | photo-resource calls |
| `src/contexts/AuthContext.jsx` | currentUser, login, logout, register |
| `src/contexts/DataContext.jsx` | in-memory cache + invalidation, sessionStorage mirror |
| `src/hooks/useAuth.js` | shortcut to `AuthContext` |
| `src/hooks/useResource.js` | cached fetch hook |
| `src/hooks/useDebounce.js` | debounce input changes |
| `src/components/ProtectedRoute.jsx` | "must be logged in" guard |
| `src/components/OwnerRoute.jsx` | "must be logged in AND `:userId` matches" guard |
| `src/components/TopBar.jsx` + `.module.css` | header navigation |
| `src/components/UserInfoModal.jsx` + `.module.css` | profile overlay |
| `src/components/TodoItem.jsx` + `.module.css` | one todo row |
| `src/components/PostCard.jsx` + `.module.css` | one post in list |
| `src/components/CommentList.jsx` + `.module.css` | comments under a post |
| `src/components/AlbumCard.jsx` + `.module.css` | one album in list |
| `src/components/PhotoGrid.jsx` + `.module.css` | paginated photo grid |
| `src/pages/LoginPage.jsx` + `.module.css` | login form |
| `src/pages/RegisterPage.jsx` + `.module.css` | register step 1 |
| `src/pages/RegisterDetailsPage.jsx` + `.module.css` | register step 2 |
| `src/pages/HomePage.jsx` + `.module.css` | home dashboard |
| `src/pages/TodosPage.jsx` + `.module.css` | todos list |
| `src/pages/PostsPage.jsx` + `.module.css` | posts list (my + feed) |
| `src/pages/PostDetailPage.jsx` + `.module.css` | post body + comments |
| `src/pages/AlbumsPage.jsx` + `.module.css` | albums list |
| `src/pages/AlbumDetailPage.jsx` + `.module.css` | album photos |
| `README.md` | how to run, demo script |

---

## Tasks

### Task 1: Bootstrap the Vite + React 19 project

**Files:**
- Create: `Pr05/package.json`
- Create: `Pr05/vite.config.js`
- Create: `Pr05/index.html`
- Create: `Pr05/src/main.jsx`
- Create: `Pr05/src/App.jsx`
- Create: `Pr05/.gitignore`

- [ ] **Step 1: Initialise the package**

Create `Pr05/package.json`:

```json
{
  "name": "pr05",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "server": "json-server --watch server/db.json --port 3001",
    "start": "concurrently -k -n vite,api -c blue,green \"npm:dev\" \"npm:server\"",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^7.1.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.0.1",
    "concurrently": "^9.1.0",
    "json-server": "^1.0.0-beta.3",
    "vite": "^8.0.4"
  }
}
```

- [ ] **Step 2: Install dependencies**

```bash
cd Pr05 && npm install
```

Expected: `node_modules/` populated, no errors.

- [ ] **Step 3: Create Vite config**

Create `Pr05/vite.config.js`:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
});
```

- [ ] **Step 4: Create the HTML entry**

Create `Pr05/index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pr05 - React + JSON-Server</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Create the React bootstrap**

Create `Pr05/src/main.jsx`:

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 6: Create the placeholder App component**

Create `Pr05/src/App.jsx`:

```jsx
export default function App() {
  return <h1>Pr05 - boot OK</h1>;
}
```

- [ ] **Step 7: Create `.gitignore`**

Create `Pr05/.gitignore`:

```
node_modules/
dist/
.DS_Store
*.log
```

- [ ] **Step 8: Smoke-run the dev server**

```bash
cd Pr05 && npm run dev
```

Expected: Vite prints `Local: http://localhost:5173/`. Open it — page shows "Pr05 - boot OK". Stop the server with Ctrl+C.

- [ ] **Step 9: Commit**

```bash
cd "/Users/david/Documents/Documents - MacBook Pro de David/Mahon Lev/3e Année /1er semestre/FullStack/Fullstack-Course"
git add Pr05/package.json Pr05/package-lock.json Pr05/vite.config.js Pr05/index.html Pr05/src/main.jsx Pr05/src/App.jsx Pr05/.gitignore
git commit -m "Pr05: bootstrap Vite + React 19 project"
```

---

### Task 2: Seed the json-server database

**Files:**
- Create: `Pr05/server/db.json`

- [ ] **Step 1: Fetch the source data from jsonplaceholder**

Run this one-off helper from any terminal to grab the data; it does not become part of the repo:

```bash
cd Pr05 && mkdir -p server && node -e '
const fetch = (url) => import("node:https").then(({ default: https }) => new Promise((res, rej) => {
  https.get(url, (r) => { let d = ""; r.on("data", (c) => d += c); r.on("end", () => res(JSON.parse(d))); }).on("error", rej);
}));
(async () => {
  const [users, todos, posts, comments, albums, photosAll] = await Promise.all([
    fetch("https://jsonplaceholder.typicode.com/users"),
    fetch("https://jsonplaceholder.typicode.com/todos"),
    fetch("https://jsonplaceholder.typicode.com/posts"),
    fetch("https://jsonplaceholder.typicode.com/comments"),
    fetch("https://jsonplaceholder.typicode.com/albums"),
    fetch("https://jsonplaceholder.typicode.com/photos"),
  ]);
  const usersWithPassword = users.map((u) => ({ ...u, password: u.website }));
  const photos = photosAll.slice(0, 200).map((p) => ({
    ...p,
    thumbnailUrl: `https://picsum.photos/seed/photo${p.id}/150/150`,
    url: `https://picsum.photos/seed/photo${p.id}/600/400`,
  }));
  const db = { users: usersWithPassword, todos, posts, comments, albums, photos };
  require("node:fs").writeFileSync("server/db.json", JSON.stringify(db, null, 2));
  console.log("Wrote server/db.json with", { users: users.length, todos: todos.length, posts: posts.length, comments: comments.length, albums: albums.length, photos: photos.length });
})();
'
```

Expected: prints `Wrote server/db.json with { users: 10, todos: 200, posts: 100, comments: 500, albums: 100, photos: 200 }`.

- [ ] **Step 2: Verify the file exists and is well-formed**

```bash
cd Pr05 && node -e 'const d = JSON.parse(require("node:fs").readFileSync("server/db.json","utf8")); console.log(Object.keys(d)); console.log("first user:", d.users[0]);'
```

Expected output includes:
- keys: `[ 'users', 'todos', 'posts', 'comments', 'albums', 'photos' ]`
- first user has a `password` field equal to its `website`.

- [ ] **Step 3: Boot json-server and exercise a few routes**

```bash
cd Pr05 && npm run server
```

Expected: terminal prints something like `JSON Server started on PORT :3001` and lists endpoints.

In another terminal:

```bash
curl -s http://localhost:3001/users/1 | node -e 'process.stdin.on("data",d=>{const u=JSON.parse(d); console.log(u.username, u.password);})'
curl -s "http://localhost:3001/photos?albumId=1&_page=1&_limit=3" | node -e 'process.stdin.on("data",d=>console.log(JSON.parse(d).length))'
```

Expected: prints `Bret hildegard.org` and `3`. Stop json-server with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
cd "/Users/david/Documents/Documents - MacBook Pro de David/Mahon Lev/3e Année /1er semestre/FullStack/Fullstack-Course"
git add Pr05/server/db.json
git commit -m "Pr05: seed json-server db.json from jsonplaceholder"
```

---

### Task 3: Global theme and base styles

**Files:**
- Create: `Pr05/src/styles/theme.css`
- Modify: `Pr05/src/main.jsx` (import theme)

- [ ] **Step 1: Create the theme stylesheet**

Create `Pr05/src/styles/theme.css`:

```css
:root {
  --bg: #f5f6fa;
  --surface: #ffffff;
  --surface-alt: #f0f2f8;
  --text: #1f2937;
  --text-muted: #6b7280;
  --border: #e5e7eb;
  --primary: #4f46e5;
  --primary-hover: #4338ca;
  --accent: #06b6d4;
  --danger: #dc2626;
  --success: #16a34a;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --font-sans: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

* {
  box-sizing: border-box;
}

html, body, #root {
  margin: 0;
  padding: 0;
  height: 100%;
}

body {
  font-family: var(--font-sans);
  background: var(--bg);
  color: var(--text);
  font-size: 15px;
  line-height: 1.5;
}

button {
  font-family: inherit;
  cursor: pointer;
}

a {
  color: var(--primary);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

input, select, textarea {
  font-family: inherit;
  font-size: inherit;
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--text);
}

input:focus, select:focus, textarea:focus {
  outline: 2px solid var(--primary);
  outline-offset: 1px;
}
```

- [ ] **Step 2: Import the theme from main.jsx**

Edit `Pr05/src/main.jsx`:

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/theme.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 3: Verify**

```bash
cd Pr05 && npm run dev
```

Open `http://localhost:5173/` — the page background should be light gray, the heading should use the system font. Stop the server.

- [ ] **Step 4: Commit**

```bash
cd "/Users/david/Documents/Documents - MacBook Pro de David/Mahon Lev/3e Année /1er semestre/FullStack/Fullstack-Course"
git add Pr05/src/styles/theme.css Pr05/src/main.jsx
git commit -m "Pr05: add theme.css with CSS variables and base resets"
```

---

### Task 4: API base client

**Files:**
- Create: `Pr05/src/api/client.js`

- [ ] **Step 1: Write the base client**

Create `Pr05/src/api/client.js`:

```js
const BASE_URL = "http://localhost:3001";

async function request(method, path, body) {
  const options = { method, headers: {} };
  if (body !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }
  const response = await fetch(`${BASE_URL}${path}`, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${method} ${path} failed (${response.status}): ${text}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export const apiGet = (path) => request("GET", path);
export const apiPost = (path, body) => request("POST", path, body);
export const apiPut = (path, body) => request("PUT", path, body);
export const apiPatch = (path, body) => request("PATCH", path, body);
export const apiDelete = (path) => request("DELETE", path);
```

- [ ] **Step 2: Commit**

```bash
cd "/Users/david/Documents/Documents - MacBook Pro de David/Mahon Lev/3e Année /1er semestre/FullStack/Fullstack-Course"
git add Pr05/src/api/client.js
git commit -m "Pr05: add base fetch client for json-server"
```

---

### Task 5: Per-resource API modules

**Files:**
- Create: `Pr05/src/api/users.js`
- Create: `Pr05/src/api/todos.js`
- Create: `Pr05/src/api/posts.js`
- Create: `Pr05/src/api/comments.js`
- Create: `Pr05/src/api/albums.js`
- Create: `Pr05/src/api/photos.js`

- [ ] **Step 1: users.js**

Create `Pr05/src/api/users.js`:

```js
import { apiGet, apiPost, apiPatch } from "./client.js";

export const findUserByUsername = async (username) => {
  const matches = await apiGet(`/users?username=${encodeURIComponent(username)}`);
  return matches[0] ?? null;
};

export const getUser = (id) => apiGet(`/users/${id}`);
export const createUser = (user) => apiPost("/users", user);
export const updateUser = (id, patch) => apiPatch(`/users/${id}`, patch);
```

- [ ] **Step 2: todos.js**

Create `Pr05/src/api/todos.js`:

```js
import { apiGet, apiPost, apiPatch, apiDelete } from "./client.js";

export const listTodosByUser = (userId) => apiGet(`/todos?userId=${userId}`);
export const createTodo = (todo) => apiPost("/todos", todo);
export const updateTodo = (id, patch) => apiPatch(`/todos/${id}`, patch);
export const deleteTodo = (id) => apiDelete(`/todos/${id}`);
```

- [ ] **Step 3: posts.js**

Create `Pr05/src/api/posts.js`:

```js
import { apiGet, apiPost, apiPatch, apiDelete } from "./client.js";

export const listPostsByUser = (userId) => apiGet(`/posts?userId=${userId}`);
export const listAllPosts = () => apiGet("/posts");
export const getPost = (id) => apiGet(`/posts/${id}`);
export const createPost = (post) => apiPost("/posts", post);
export const updatePost = (id, patch) => apiPatch(`/posts/${id}`, patch);
export const deletePost = (id) => apiDelete(`/posts/${id}`);
```

- [ ] **Step 4: comments.js**

Create `Pr05/src/api/comments.js`:

```js
import { apiGet, apiPost, apiPatch, apiDelete } from "./client.js";

export const listCommentsByPost = (postId) => apiGet(`/comments?postId=${postId}`);
export const createComment = (comment) => apiPost("/comments", comment);
export const updateComment = (id, patch) => apiPatch(`/comments/${id}`, patch);
export const deleteComment = (id) => apiDelete(`/comments/${id}`);
```

- [ ] **Step 5: albums.js**

Create `Pr05/src/api/albums.js`:

```js
import { apiGet, apiPost, apiPatch, apiDelete } from "./client.js";

export const listAlbumsByUser = (userId) => apiGet(`/albums?userId=${userId}`);
export const getAlbum = (id) => apiGet(`/albums/${id}`);
export const createAlbum = (album) => apiPost("/albums", album);
export const updateAlbum = (id, patch) => apiPatch(`/albums/${id}`, patch);
export const deleteAlbum = (id) => apiDelete(`/albums/${id}`);
```

- [ ] **Step 6: photos.js**

Create `Pr05/src/api/photos.js`:

```js
import { apiGet, apiPost, apiPatch, apiDelete } from "./client.js";

export const listPhotosByAlbum = (albumId, page, limit) =>
  apiGet(`/photos?albumId=${albumId}&_page=${page}&_limit=${limit}`);
export const createPhoto = (photo) => apiPost("/photos", photo);
export const updatePhoto = (id, patch) => apiPatch(`/photos/${id}`, patch);
export const deletePhoto = (id) => apiDelete(`/photos/${id}`);
```

- [ ] **Step 7: Commit**

```bash
cd "/Users/david/Documents/Documents - MacBook Pro de David/Mahon Lev/3e Année /1er semestre/FullStack/Fullstack-Course"
git add Pr05/src/api/
git commit -m "Pr05: add per-resource api modules"
```

---

### Task 6: AuthContext (login, register, logout, LocalStorage)

**Files:**
- Create: `Pr05/src/contexts/AuthContext.jsx`
- Create: `Pr05/src/hooks/useAuth.js`

- [ ] **Step 1: Create AuthContext**

Create `Pr05/src/contexts/AuthContext.jsx`:

```jsx
import { createContext, useCallback, useEffect, useState } from "react";
import { createUser, findUserByUsername } from "../api/users.js";

const STORAGE_KEY = "currentUser";

export const AuthContext = createContext(null);

function readFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => readFromStorage());

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentUser]);

  const login = useCallback(async (username, password) => {
    const user = await findUserByUsername(username);
    if (!user) throw new Error("Unknown username");
    if (user.password !== password) throw new Error("Wrong password");
    const session = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
    };
    setCurrentUser(session);
    return session;
  }, []);

  const register = useCallback(async (draft) => {
    const existing = await findUserByUsername(draft.username);
    if (existing) throw new Error("Username already taken");
    const created = await createUser(draft);
    const session = {
      id: created.id,
      username: created.username,
      name: created.name,
      email: created.email,
    };
    setCurrentUser(session);
    return session;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

- [ ] **Step 2: Create the useAuth hook**

Create `Pr05/src/hooks/useAuth.js`:

```js
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
```

- [ ] **Step 3: Commit**

```bash
cd "/Users/david/Documents/Documents - MacBook Pro de David/Mahon Lev/3e Année /1er semestre/FullStack/Fullstack-Course"
git add Pr05/src/contexts/AuthContext.jsx Pr05/src/hooks/useAuth.js
git commit -m "Pr05: add AuthContext with login/register/logout and LS persistence"
```

---

### Task 7: DataContext (in-memory cache + sessionStorage mirror) + useResource hook

**Files:**
- Create: `Pr05/src/contexts/DataContext.jsx`
- Create: `Pr05/src/hooks/useResource.js`

- [ ] **Step 1: Create DataContext**

Create `Pr05/src/contexts/DataContext.jsx`:

```jsx
import { createContext, useCallback, useRef, useState } from "react";

const STORAGE_KEY = "dataCache";

export const DataContext = createContext(null);

function loadInitial() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? new Map(JSON.parse(raw)) : new Map();
  } catch {
    return new Map();
  }
}

function persist(cache) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...cache]));
  } catch {
    // sessionStorage is best-effort; ignore failures
  }
}

export function DataProvider({ children }) {
  const cacheRef = useRef(loadInitial());
  const [version, setVersion] = useState(0);
  const bump = () => setVersion((v) => v + 1);

  const get = useCallback((key) => cacheRef.current.get(key), []);

  const set = useCallback((key, value) => {
    cacheRef.current.set(key, value);
    persist(cacheRef.current);
    bump();
  }, []);

  const invalidate = useCallback((prefix) => {
    let changed = false;
    for (const k of [...cacheRef.current.keys()]) {
      if (k.startsWith(prefix)) {
        cacheRef.current.delete(k);
        changed = true;
      }
    }
    if (changed) {
      persist(cacheRef.current);
      bump();
    }
  }, []);

  const clear = useCallback(() => {
    cacheRef.current.clear();
    persist(cacheRef.current);
    bump();
  }, []);

  return (
    <DataContext.Provider value={{ get, set, invalidate, clear, version }}>
      {children}
    </DataContext.Provider>
  );
}
```

- [ ] **Step 2: Create the useResource hook**

Create `Pr05/src/hooks/useResource.js`:

```js
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../contexts/DataContext.jsx";

export function useResource(key, fetcher) {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useResource must be used inside DataProvider");

  const cached = key ? ctx.get(key) : undefined;
  const [data, setData] = useState(cached);
  const [loading, setLoading] = useState(cached === undefined && key !== null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!key) return;
    const cachedValue = ctx.get(key);
    if (cachedValue !== undefined) {
      setData(cachedValue);
      setLoading(false);
      setError(null);
      return;
    }
    let active = true;
    setLoading(true);
    setError(null);
    fetcher()
      .then((value) => {
        if (!active) return;
        ctx.set(key, value);
        setData(value);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [key, ctx.version]); // re-run on cache invalidations

  return { data, loading, error };
}
```

- [ ] **Step 3: Commit**

```bash
cd "/Users/david/Documents/Documents - MacBook Pro de David/Mahon Lev/3e Année /1er semestre/FullStack/Fullstack-Course"
git add Pr05/src/contexts/DataContext.jsx Pr05/src/hooks/useResource.js
git commit -m "Pr05: add DataContext cache and useResource hook"
```

---

### Task 8: Routing skeleton + guards

**Files:**
- Create: `Pr05/src/components/ProtectedRoute.jsx`
- Create: `Pr05/src/components/OwnerRoute.jsx`
- Modify: `Pr05/src/App.jsx`

- [ ] **Step 1: ProtectedRoute**

Create `Pr05/src/components/ProtectedRoute.jsx`:

```jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function ProtectedRoute() {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  return <Outlet />;
}
```

- [ ] **Step 2: OwnerRoute**

Create `Pr05/src/components/OwnerRoute.jsx`:

```jsx
import { Navigate, Outlet, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function OwnerRoute() {
  const { currentUser } = useAuth();
  const { userId } = useParams();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (String(currentUser.id) !== String(userId)) {
    return <Navigate to="/home" replace />;
  }
  return <Outlet />;
}
```

- [ ] **Step 3: Wire the router in App.jsx**

Replace `Pr05/src/App.jsx`:

```jsx
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
```

- [ ] **Step 4: Create page stubs so the import graph compiles**

Create each of these files with the matching one-line stub so Vite can resolve the imports. We'll fill them in subsequent tasks.

Create `Pr05/src/pages/LoginPage.jsx`:
```jsx
export default function LoginPage() { return <div>LoginPage</div>; }
```

Create `Pr05/src/pages/RegisterPage.jsx`:
```jsx
export default function RegisterPage() { return <div>RegisterPage</div>; }
```

Create `Pr05/src/pages/RegisterDetailsPage.jsx`:
```jsx
export default function RegisterDetailsPage() { return <div>RegisterDetailsPage</div>; }
```

Create `Pr05/src/pages/HomePage.jsx`:
```jsx
export default function HomePage() { return <div>HomePage</div>; }
```

Create `Pr05/src/pages/TodosPage.jsx`:
```jsx
export default function TodosPage() { return <div>TodosPage</div>; }
```

Create `Pr05/src/pages/PostsPage.jsx`:
```jsx
export default function PostsPage({ feed }) { return <div>PostsPage {feed ? "(feed)" : "(mine)"}</div>; }
```

Create `Pr05/src/pages/PostDetailPage.jsx`:
```jsx
export default function PostDetailPage() { return <div>PostDetailPage</div>; }
```

Create `Pr05/src/pages/AlbumsPage.jsx`:
```jsx
export default function AlbumsPage() { return <div>AlbumsPage</div>; }
```

Create `Pr05/src/pages/AlbumDetailPage.jsx`:
```jsx
export default function AlbumDetailPage() { return <div>AlbumDetailPage</div>; }
```

- [ ] **Step 5: Verify routing**

```bash
cd Pr05 && npm run dev
```

Open `http://localhost:5173/` → redirected to `/login` → "LoginPage" text. Try `http://localhost:5173/home` → should also redirect to `/login` (no auth). Stop the server.

- [ ] **Step 6: Commit**

```bash
cd "/Users/david/Documents/Documents - MacBook Pro de David/Mahon Lev/3e Année /1er semestre/FullStack/Fullstack-Course"
git add Pr05/src/components/ProtectedRoute.jsx Pr05/src/components/OwnerRoute.jsx Pr05/src/App.jsx Pr05/src/pages/
git commit -m "Pr05: add routing skeleton, ProtectedRoute and OwnerRoute"
```

---

### Task 9: LoginPage

**Files:**
- Replace: `Pr05/src/pages/LoginPage.jsx`
- Create: `Pr05/src/pages/LoginPage.module.css`

- [ ] **Step 1: Replace the LoginPage stub**

Replace `Pr05/src/pages/LoginPage.jsx`:

```jsx
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const { currentUser, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (currentUser) return <Navigate to="/home" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(username.trim(), password);
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Sign in</h1>
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
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.submit} disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
        </button>
        <p className={styles.alt}>
          No account yet? <Link to="/register">Create one</Link>
        </p>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Style the page**

Create `Pr05/src/pages/LoginPage.module.css`:

```css
.wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eef2ff, #f5f3ff);
  padding: 20px;
}

.card {
  background: var(--surface);
  padding: 32px 28px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.title {
  margin: 0 0 6px 0;
  font-size: 22px;
  text-align: center;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  color: var(--text-muted);
}

.error {
  background: #fee2e2;
  color: var(--danger);
  border-radius: var(--radius-sm);
  padding: 8px 10px;
  margin: 0;
  font-size: 13px;
}

.submit {
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
  margin-top: 6px;
}

.submit:hover:not(:disabled) {
  background: var(--primary-hover);
}

.submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.alt {
  margin: 6px 0 0 0;
  font-size: 13px;
  text-align: center;
  color: var(--text-muted);
}
```

- [ ] **Step 3: Verify**

Run `npm run start` from `Pr05/`. Open `/login`. Try `username: Bret`, password: `hildegard.org` → redirect to `/home`. Refresh `/home` → stays on `/home` (currentUser persisted). Log in again with a bad password → red error banner appears, URL stays at `/login`. Stop.

- [ ] **Step 4: Commit**

```bash
cd "/Users/david/Documents/Documents - MacBook Pro de David/Mahon Lev/3e Année /1er semestre/FullStack/Fullstack-Course"
git add Pr05/src/pages/LoginPage.jsx Pr05/src/pages/LoginPage.module.css
git commit -m "Pr05: implement LoginPage with controlled form and inline error"
```

---

### Task 10: RegisterPage (step 1 + step 2)

**Files:**
- Replace: `Pr05/src/pages/RegisterPage.jsx`
- Replace: `Pr05/src/pages/RegisterDetailsPage.jsx`
- Create: `Pr05/src/pages/RegisterPage.module.css`

- [ ] **Step 1: RegisterPage (step 1 — credentials)**

Replace `Pr05/src/pages/RegisterPage.jsx`:

```jsx
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
```

- [ ] **Step 2: RegisterDetailsPage (step 2 — profile)**

Replace `Pr05/src/pages/RegisterDetailsPage.jsx`:

```jsx
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
```

- [ ] **Step 3: Style both register screens**

Create `Pr05/src/pages/RegisterPage.module.css`:

```css
.wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eef2ff, #f5f3ff);
  padding: 20px;
}

.card {
  background: var(--surface);
  padding: 32px 28px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.title {
  margin: 0 0 6px 0;
  font-size: 22px;
  text-align: center;
}

.subtitle {
  margin: -4px 0 6px 0;
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  color: var(--text-muted);
}

.error {
  background: #fee2e2;
  color: var(--danger);
  border-radius: var(--radius-sm);
  padding: 8px 10px;
  margin: 0;
  font-size: 13px;
}

.submit {
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
  margin-top: 6px;
}

.submit:hover:not(:disabled) {
  background: var(--primary-hover);
}

.submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.alt {
  margin: 6px 0 0 0;
  font-size: 13px;
  text-align: center;
  color: var(--text-muted);
}
```

- [ ] **Step 4: Verify**

`npm run start`. Open `/register`. Submit a username that exists (e.g. `Bret`) → "Username already taken". Submit a new username with matching passwords → land on `/register/details`. Fill the form, submit → land on `/home`. Open devtools: a `POST /users` was sent. Stop.

- [ ] **Step 5: Commit**

```bash
cd "/Users/david/Documents/Documents - MacBook Pro de David/Mahon Lev/3e Année /1er semestre/FullStack/Fullstack-Course"
git add Pr05/src/pages/RegisterPage.jsx Pr05/src/pages/RegisterDetailsPage.jsx Pr05/src/pages/RegisterPage.module.css
git commit -m "Pr05: implement two-step register flow"
```

---

### Task 11: TopBar + UserInfoModal

**Files:**
- Create: `Pr05/src/components/TopBar.jsx`
- Create: `Pr05/src/components/TopBar.module.css`
- Create: `Pr05/src/components/UserInfoModal.jsx`
- Create: `Pr05/src/components/UserInfoModal.module.css`

- [ ] **Step 1: TopBar**

Create `Pr05/src/components/TopBar.jsx`:

```jsx
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import UserInfoModal from "./UserInfoModal.jsx";
import styles from "./TopBar.module.css";

export default function TopBar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [infoOpen, setInfoOpen] = useState(false);

  if (!currentUser) return null;

  function handleLogout() {
    logout();
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
```

- [ ] **Step 2: TopBar styles**

Create `Pr05/src/components/TopBar.module.css`:

```css
.bar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  padding: 10px 24px;
}

.left { display: flex; }

.brand {
  font-weight: 700;
  font-size: 18px;
  color: var(--primary);
  text-decoration: none;
}

.center {
  display: flex;
  justify-content: center;
}

.fullName {
  font-weight: 600;
  font-size: 15px;
  color: var(--text);
  padding: 4px 14px;
  background: var(--surface-alt);
  border-radius: 999px;
}

.right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
}

.link, .linkActive {
  background: none;
  border: none;
  font-size: 14px;
  color: var(--text-muted);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  text-decoration: none;
}

.link:hover { background: var(--surface-alt); color: var(--text); }

.linkActive {
  color: var(--primary);
  background: #eef2ff;
}

.logout {
  background: none;
  border: 1px solid var(--border);
  font-size: 14px;
  color: var(--danger);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  margin-left: 6px;
}

.logout:hover { background: #fee2e2; }
```

- [ ] **Step 3: UserInfoModal**

Create `Pr05/src/components/UserInfoModal.jsx`:

```jsx
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
```

- [ ] **Step 4: UserInfoModal styles**

Create `Pr05/src/components/UserInfoModal.module.css`:

```css
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.dialog {
  background: var(--surface);
  padding: 28px 28px 22px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  width: 100%;
  max-width: 440px;
  position: relative;
}

.close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 18px;
  color: var(--text-muted);
  cursor: pointer;
}

.title {
  margin: 0 0 16px 0;
  font-size: 18px;
}

.list {
  display: grid;
  grid-template-columns: 110px 1fr;
  row-gap: 8px;
  column-gap: 14px;
  margin: 0;
  font-size: 14px;
}

.list dt { color: var(--text-muted); }
.list dd { margin: 0; }

.error { color: var(--danger); }
```

- [ ] **Step 5: Commit**

```bash
cd "/Users/david/Documents/Documents - MacBook Pro de David/Mahon Lev/3e Année /1er semestre/FullStack/Fullstack-Course"
git add Pr05/src/components/TopBar.jsx Pr05/src/components/TopBar.module.css Pr05/src/components/UserInfoModal.jsx Pr05/src/components/UserInfoModal.module.css
git commit -m "Pr05: add TopBar with centered name and UserInfoModal"
```

---

### Task 12: HomePage

**Files:**
- Replace: `Pr05/src/pages/HomePage.jsx`
- Create: `Pr05/src/pages/HomePage.module.css`

- [ ] **Step 1: HomePage**

Replace `Pr05/src/pages/HomePage.jsx`:

```jsx
import { listTodosByUser } from "../api/todos.js";
import { listPostsByUser } from "../api/posts.js";
import { listAlbumsByUser } from "../api/albums.js";
import { useAuth } from "../hooks/useAuth.js";
import { useResource } from "../hooks/useResource.js";
import TopBar from "../components/TopBar.jsx";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const { currentUser } = useAuth();
  const userId = currentUser.id;

  const todos = useResource(`todos?userId=${userId}`, () => listTodosByUser(userId));
  const posts = useResource(`posts?userId=${userId}`, () => listPostsByUser(userId));
  const albums = useResource(`albums?userId=${userId}`, () => listAlbumsByUser(userId));

  return (
    <>
      <TopBar />
      <main className={styles.main}>
        <h1 className={styles.greeting}>Hello, {currentUser.name}.</h1>
        <p className={styles.tagline}>Here is your activity at a glance.</p>
        <div className={styles.grid}>
          <Stat label="Todos" value={todos.data?.length} loading={todos.loading} />
          <Stat label="Posts" value={posts.data?.length} loading={posts.loading} />
          <Stat label="Albums" value={albums.data?.length} loading={albums.loading} />
        </div>
      </main>
    </>
  );
}

function Stat({ label, value, loading }) {
  return (
    <div className={styles.card}>
      <div className={styles.value}>{loading ? "..." : (value ?? 0)}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}
```

- [ ] **Step 2: HomePage styles**

Create `Pr05/src/pages/HomePage.module.css`:

```css
.main {
  max-width: 880px;
  margin: 48px auto;
  padding: 0 24px;
}

.greeting {
  font-size: 26px;
  margin: 0 0 4px 0;
}

.tagline {
  margin: 0 0 28px 0;
  color: var(--text-muted);
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.card {
  background: var(--surface);
  border-radius: var(--radius-md);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  text-align: center;
}

.value {
  font-size: 34px;
  font-weight: 700;
  color: var(--primary);
}

.label {
  margin-top: 4px;
  font-size: 14px;
  color: var(--text-muted);
}

@media (max-width: 640px) {
  .grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Verify**

`npm run start`. Log in. `/home` shows the TopBar with name centered, "Hello, ..." greeting, and 3 stat cards with counts. Click **Info** → modal appears with details, close it with Escape. Click each top button: navigates to placeholder pages. Stop.

- [ ] **Step 4: Commit**

```bash
cd "/Users/david/Documents/Documents - MacBook Pro de David/Mahon Lev/3e Année /1er semestre/FullStack/Fullstack-Course"
git add Pr05/src/pages/HomePage.jsx Pr05/src/pages/HomePage.module.css
git commit -m "Pr05: implement HomePage with stats and TopBar integration"
```

---

### Task 13: useDebounce hook

**Files:**
- Create: `Pr05/src/hooks/useDebounce.js`

- [ ] **Step 1: Implement**

Create `Pr05/src/hooks/useDebounce.js`:

```js
import { useEffect, useState } from "react";

export function useDebounce(value, delay = 200) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
```

- [ ] **Step 2: Commit**

```bash
cd "/Users/david/Documents/Documents - MacBook Pro de David/Mahon Lev/3e Année /1er semestre/FullStack/Fullstack-Course"
git add Pr05/src/hooks/useDebounce.js
git commit -m "Pr05: add useDebounce hook"
```

---

### Task 14: TodosPage (list, sort, search, CRUD)

**Files:**
- Create: `Pr05/src/components/TodoItem.jsx`
- Create: `Pr05/src/components/TodoItem.module.css`
- Replace: `Pr05/src/pages/TodosPage.jsx`
- Create: `Pr05/src/pages/TodosPage.module.css`

- [ ] **Step 1: TodoItem component**

Create `Pr05/src/components/TodoItem.jsx`:

```jsx
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
```

- [ ] **Step 2: TodoItem styles**

Create `Pr05/src/components/TodoItem.module.css`:

```css
.row {
  display: grid;
  grid-template-columns: 60px 28px 1fr auto auto;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--surface);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
}

.id { color: var(--text-muted); font-size: 13px; }
.check { width: 16px; height: 16px; }
.title { font-size: 14px; }
.done { text-decoration: line-through; color: var(--text-muted); }
.editInput { font-size: 14px; }

.btn, .btnDanger {
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 4px 10px;
  font-size: 12px;
  color: var(--text-muted);
}
.btn:hover { background: var(--surface-alt); color: var(--text); }
.btnDanger { color: var(--danger); }
.btnDanger:hover { background: #fee2e2; }
```

- [ ] **Step 3: TodosPage**

Replace `Pr05/src/pages/TodosPage.jsx`:

```jsx
import { useContext, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TopBar from "../components/TopBar.jsx";
import TodoItem from "../components/TodoItem.jsx";
import { createTodo, deleteTodo, listTodosByUser, updateTodo } from "../api/todos.js";
import { DataContext } from "../contexts/DataContext.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useDebounce } from "../hooks/useDebounce.js";
import { useResource } from "../hooks/useResource.js";
import styles from "./TodosPage.module.css";

const SORTS = {
  id: (a, b) => a.id - b.id,
  title: (a, b) => a.title.localeCompare(b.title),
  done: (a, b) => Number(a.completed) - Number(b.completed),
};

export default function TodosPage() {
  const { currentUser } = useAuth();
  const userId = currentUser.id;
  const cache = useContext(DataContext);
  const cacheKey = `todos?userId=${userId}`;

  const { data: todos, loading, error } = useResource(cacheKey, () => listTodosByUser(userId));

  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort") ?? "id";
  const queryId = searchParams.get("id") ?? "";
  const queryTitle = searchParams.get("q") ?? "";
  const queryDone = searchParams.get("done") ?? "all";

  const debouncedTitle = useDebounce(queryTitle, 200);

  const [newTitle, setNewTitle] = useState("");

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value === "" || value === null || value === undefined) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  }

  const filtered = useMemo(() => {
    if (!todos) return [];
    return todos
      .filter((t) => (queryId === "" ? true : String(t.id) === queryId.trim()))
      .filter((t) => (debouncedTitle === "" ? true : t.title.toLowerCase().includes(debouncedTitle.toLowerCase())))
      .filter((t) => queryDone === "all" ? true : queryDone === "done" ? t.completed : !t.completed)
      .sort(SORTS[sort] ?? SORTS.id);
  }, [todos, queryId, debouncedTitle, queryDone, sort]);

  async function handleToggle(id, completed) {
    const updated = await updateTodo(id, { completed });
    cache.set(cacheKey, todos.map((t) => (t.id === id ? updated : t)));
  }

  async function handleEdit(id, patch) {
    const updated = await updateTodo(id, patch);
    cache.set(cacheKey, todos.map((t) => (t.id === id ? updated : t)));
  }

  async function handleDelete(id) {
    await deleteTodo(id);
    cache.set(cacheKey, todos.filter((t) => t.id !== id));
  }

  async function handleAdd(event) {
    event.preventDefault();
    if (!newTitle.trim()) return;
    const created = await createTodo({ title: newTitle.trim(), userId, completed: false });
    cache.set(cacheKey, [created, ...todos]);
    setNewTitle("");
  }

  return (
    <>
      <TopBar />
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>My todos</h1>
          <p className={styles.count}>{filtered.length} of {todos?.length ?? 0}</p>
        </header>

        <form className={styles.addRow} onSubmit={handleAdd}>
          <input
            placeholder="Add a new todo..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button type="submit" className={styles.addBtn}>Add</button>
        </form>

        <section className={styles.controls}>
          <label className={styles.control}>
            <span>Sort by</span>
            <select value={sort} onChange={(e) => updateParam("sort", e.target.value)}>
              <option value="id">ID</option>
              <option value="title">Title</option>
              <option value="done">Completion</option>
            </select>
          </label>
          <label className={styles.control}>
            <span>Search by ID</span>
            <input value={queryId} onChange={(e) => updateParam("id", e.target.value)} />
          </label>
          <label className={styles.control}>
            <span>Search title</span>
            <input value={queryTitle} onChange={(e) => updateParam("q", e.target.value)} />
          </label>
          <label className={styles.control}>
            <span>Status</span>
            <select value={queryDone} onChange={(e) => updateParam("done", e.target.value)}>
              <option value="all">All</option>
              <option value="done">Done</option>
              <option value="open">Open</option>
            </select>
          </label>
        </section>

        {loading && <p>Loading todos...</p>}
        {error && <p className={styles.error}>{error.message}</p>}

        <ul className={styles.list}>
          {filtered.map((t) => (
            <TodoItem
              key={t.id}
              todo={t}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      </main>
    </>
  );
}
```

- [ ] **Step 4: TodosPage styles**

Create `Pr05/src/pages/TodosPage.module.css`:

```css
.main {
  max-width: 880px;
  margin: 32px auto;
  padding: 0 24px;
}

.header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 14px;
}

.title { margin: 0; font-size: 22px; }
.count { color: var(--text-muted); font-size: 13px; margin: 0; }

.addRow {
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
}
.addRow input { flex: 1; }

.addBtn {
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  padding: 8px 16px;
  font-weight: 500;
}
.addBtn:hover { background: var(--primary-hover); }

.controls {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 18px;
}

.control { display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: var(--text-muted); }

.list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }

.error { color: var(--danger); }

@media (max-width: 640px) {
  .controls { grid-template-columns: 1fr 1fr; }
}
```

- [ ] **Step 5: Verify**

`npm run start`. Log in as `Bret/hildegard.org`. Open Todos. Verify: list renders, sort changes order, search by ID filters to one row, title search debounces, status filter toggles. Toggle a checkbox → updates server (check network tab). Double-click a title to edit. Add a new todo → appears at the top. Refresh the page → same filters preserved via URL params. Stop.

- [ ] **Step 6: Commit**

```bash
cd "/Users/david/Documents/Documents - MacBook Pro de David/Mahon Lev/3e Année /1er semestre/FullStack/Fullstack-Course"
git add Pr05/src/components/TodoItem.jsx Pr05/src/components/TodoItem.module.css Pr05/src/pages/TodosPage.jsx Pr05/src/pages/TodosPage.module.css
git commit -m "Pr05: implement TodosPage with sort, search, CRUD and URL-persisted filters"
```

---

### Task 15: PostsPage (my posts + feed) and PostCard

**Files:**
- Create: `Pr05/src/components/PostCard.jsx`
- Create: `Pr05/src/components/PostCard.module.css`
- Replace: `Pr05/src/pages/PostsPage.jsx`
- Create: `Pr05/src/pages/PostsPage.module.css`

- [ ] **Step 1: PostCard**

Create `Pr05/src/components/PostCard.jsx`:

```jsx
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
```

- [ ] **Step 2: PostCard styles**

Create `Pr05/src/components/PostCard.module.css`:

```css
.card {
  background: var(--surface);
  border-radius: var(--radius-md);
  padding: 14px 16px;
  box-shadow: var(--shadow-sm);
  border: 2px solid transparent;
}

.selected { border-color: var(--primary); background: #eef2ff; }

.header {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.id { color: var(--text-muted); font-size: 13px; }
.title { margin: 0; font-size: 15px; flex: 1; }
.titleInput { flex: 1; font-size: 15px; }
.author { color: var(--text-muted); font-size: 12px; }

.body {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.body p { margin: 0; color: var(--text); font-size: 14px; }

.actions { display: flex; gap: 8px; flex-wrap: wrap; }

.action, .actionDanger, .selectBtn {
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 4px 10px;
  font-size: 12px;
  color: var(--text-muted);
  text-decoration: none;
}
.action:hover, .selectBtn:hover { background: var(--surface-alt); color: var(--text); }
.actionDanger { color: var(--danger); }
.actionDanger:hover { background: #fee2e2; }
.selectBtn { margin-top: 8px; }
```

- [ ] **Step 3: PostsPage**

Replace `Pr05/src/pages/PostsPage.jsx`:

```jsx
import { useContext, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import TopBar from "../components/TopBar.jsx";
import PostCard from "../components/PostCard.jsx";
import { createPost, deletePost, listAllPosts, listPostsByUser, updatePost } from "../api/posts.js";
import { apiGet } from "../api/client.js";
import { DataContext } from "../contexts/DataContext.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useDebounce } from "../hooks/useDebounce.js";
import { useResource } from "../hooks/useResource.js";
import styles from "./PostsPage.module.css";

export default function PostsPage({ feed = false }) {
  const { currentUser } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();
  const cache = useContext(DataContext);

  const myKey = `posts?userId=${currentUser.id}`;
  const allKey = `posts`;
  const cacheKey = feed ? allKey : myKey;

  const { data: posts, loading, error } = useResource(
    cacheKey,
    () => (feed ? listAllPosts() : listPostsByUser(currentUser.id)),
  );

  // Author names for the feed view
  const authorMapKey = `users-map`;
  const { data: usersMap } = useResource(
    feed ? authorMapKey : null,
    async () => {
      const users = await apiGet("/users");
      return Object.fromEntries(users.map((u) => [u.id, u.name]));
    },
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const queryId = searchParams.get("id") ?? "";
  const queryTitle = searchParams.get("q") ?? "";
  const selectedId = searchParams.get("post");
  const debouncedTitle = useDebounce(queryTitle, 200);

  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(key); else next.set(key, value);
    setSearchParams(next, { replace: true });
  }

  const filtered = useMemo(() => {
    if (!posts) return [];
    return posts
      .filter((p) => (queryId === "" ? true : String(p.id) === queryId.trim()))
      .filter((p) => (debouncedTitle === "" ? true : p.title.toLowerCase().includes(debouncedTitle.toLowerCase())));
  }, [posts, queryId, debouncedTitle]);

  async function handleAdd(event) {
    event.preventDefault();
    if (!newTitle.trim()) return;
    const created = await createPost({ title: newTitle.trim(), body: newBody.trim(), userId: currentUser.id });
    cache.set(myKey, [created, ...(cache.get(myKey) ?? [])]);
    cache.invalidate(allKey);
    setNewTitle(""); setNewBody("");
  }

  async function handleEdit(id, patch) {
    if (feed) throw new Error("Editing other users' posts is not allowed");
    const updated = await updatePost(id, patch);
    cache.set(myKey, (cache.get(myKey) ?? []).map((p) => (p.id === id ? updated : p)));
    cache.invalidate(allKey);
  }

  async function handleDelete(id) {
    if (feed) throw new Error("Deleting other users' posts is not allowed");
    await deletePost(id);
    cache.set(myKey, (cache.get(myKey) ?? []).filter((p) => p.id !== id));
    cache.invalidate(allKey);
  }

  return (
    <>
      <TopBar />
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>{feed ? "All users' posts" : "My posts"}</h1>
          {feed ? (
            <Link className={styles.toggle} to={`/users/${currentUser.id}/posts`}>Back to my posts</Link>
          ) : (
            <Link className={styles.toggle} to={`/users/${currentUser.id}/posts/feed`}>See other users' posts</Link>
          )}
        </header>

        {!feed && (
          <form className={styles.addRow} onSubmit={handleAdd}>
            <input placeholder="New post title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <textarea placeholder="Body" rows={2} value={newBody} onChange={(e) => setNewBody(e.target.value)} />
            <button type="submit" className={styles.addBtn}>Add post</button>
          </form>
        )}

        <section className={styles.controls}>
          <label className={styles.control}>
            <span>Search by ID</span>
            <input value={queryId} onChange={(e) => updateParam("id", e.target.value)} />
          </label>
          <label className={styles.control}>
            <span>Search title</span>
            <input value={queryTitle} onChange={(e) => updateParam("q", e.target.value)} />
          </label>
        </section>

        {loading && <p>Loading posts...</p>}
        {error && <p className={styles.error}>{error.message}</p>}

        <div className={styles.list}>
          {filtered.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              viewerId={currentUser.id}
              authorName={feed ? usersMap?.[p.userId] : null}
              selected={String(p.id) === selectedId}
              onSelect={(id) => feed
                ? navigate(`/users/${currentUser.id}/posts/${id}`)
                : updateParam("post", String(id))}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 4: PostsPage styles**

Create `Pr05/src/pages/PostsPage.module.css`:

```css
.main {
  max-width: 880px;
  margin: 32px auto;
  padding: 0 24px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 14px;
}
.title { margin: 0; font-size: 22px; }

.toggle {
  font-size: 13px;
  color: var(--primary);
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  text-decoration: none;
}
.toggle:hover { background: var(--surface-alt); }

.addRow {
  display: grid;
  grid-template-columns: 1fr 2fr auto;
  gap: 8px;
  margin-bottom: 18px;
}
.addRow input, .addRow textarea { font-size: 14px; }

.addBtn {
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  padding: 8px 16px;
  font-weight: 500;
}

.controls { display: grid; grid-template-columns: 1fr 2fr; gap: 10px; margin-bottom: 18px; }
.control { display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: var(--text-muted); }

.list { display: flex; flex-direction: column; gap: 10px; }
.error { color: var(--danger); }

@media (max-width: 640px) {
  .addRow { grid-template-columns: 1fr; }
  .controls { grid-template-columns: 1fr; }
}
```

- [ ] **Step 5: Verify**

`npm run start`. Log in. Click Posts. List shows my posts only (id + title cards). Select one → body expands with "Show comments" + Edit + Delete. Edit and save → server updates. Click "See other users' posts" → URL becomes `/users/.../posts/feed`, all posts visible with author names, no edit/delete buttons. Click "Select" on a foreign post → navigates to the PostDetail placeholder. Stop.

- [ ] **Step 6: Commit**

```bash
cd "/Users/david/Documents/Documents - MacBook Pro de David/Mahon Lev/3e Année /1er semestre/FullStack/Fullstack-Course"
git add Pr05/src/components/PostCard.jsx Pr05/src/components/PostCard.module.css Pr05/src/pages/PostsPage.jsx Pr05/src/pages/PostsPage.module.css
git commit -m "Pr05: implement PostsPage with my/feed toggle and PostCard"
```

---

### Task 16: PostDetailPage with CommentList

**Files:**
- Create: `Pr05/src/components/CommentList.jsx`
- Create: `Pr05/src/components/CommentList.module.css`
- Replace: `Pr05/src/pages/PostDetailPage.jsx`
- Create: `Pr05/src/pages/PostDetailPage.module.css`

- [ ] **Step 1: CommentList component**

Create `Pr05/src/components/CommentList.jsx`:

```jsx
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
```

- [ ] **Step 2: CommentList styles**

Create `Pr05/src/components/CommentList.module.css`:

```css
.section { margin-top: 24px; }
.heading { font-size: 16px; margin: 0 0 12px 0; }

.addRow { display: grid; grid-template-columns: 1fr auto; gap: 8px; margin-bottom: 14px; }
.addRow textarea { font-size: 14px; }

.list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }

.row {
  background: var(--surface);
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
}

.author { display: flex; gap: 8px; align-items: baseline; font-size: 13px; }
.email { color: var(--text-muted); font-size: 12px; }
.body { margin: 6px 0 0 0; font-size: 14px; }

.actions { display: flex; gap: 6px; margin-top: 8px; }

.btn, .btnDanger {
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 4px 10px;
  font-size: 12px;
  color: var(--text-muted);
}
.btnDanger { color: var(--danger); }
.btn:hover { background: var(--surface-alt); color: var(--text); }
.btnDanger:hover { background: #fee2e2; }
```

- [ ] **Step 3: PostDetailPage**

Replace `Pr05/src/pages/PostDetailPage.jsx`:

```jsx
import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import TopBar from "../components/TopBar.jsx";
import CommentList from "../components/CommentList.jsx";
import { createComment, deleteComment, listCommentsByPost, updateComment } from "../api/comments.js";
import { getPost } from "../api/posts.js";
import { DataContext } from "../contexts/DataContext.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useResource } from "../hooks/useResource.js";
import styles from "./PostDetailPage.module.css";

export default function PostDetailPage() {
  const { currentUser } = useAuth();
  const { postId, userId } = useParams();
  const cache = useContext(DataContext);
  const postKey = `posts/${postId}`;
  const commentsKey = `comments?postId=${postId}`;

  const { data: post, loading: postLoading, error: postError } = useResource(postKey, () => getPost(postId));
  const { data: comments, loading: cmtLoading, error: cmtError } = useResource(commentsKey, () => listCommentsByPost(postId));

  async function handleAdd(body) {
    const created = await createComment({
      postId: Number(postId),
      name: currentUser.name,
      email: currentUser.email,
      body,
    });
    cache.set(commentsKey, [...(cache.get(commentsKey) ?? []), created]);
  }

  async function handleEdit(id, patch) {
    const target = (cache.get(commentsKey) ?? []).find((c) => c.id === id);
    if (!target || target.email !== currentUser.email) throw new Error("Not authorized");
    const updated = await updateComment(id, patch);
    cache.set(commentsKey, (cache.get(commentsKey) ?? []).map((c) => (c.id === id ? updated : c)));
  }

  async function handleDelete(id) {
    const target = (cache.get(commentsKey) ?? []).find((c) => c.id === id);
    if (!target || target.email !== currentUser.email) throw new Error("Not authorized");
    await deleteComment(id);
    cache.set(commentsKey, (cache.get(commentsKey) ?? []).filter((c) => c.id !== id));
  }

  return (
    <>
      <TopBar />
      <main className={styles.main}>
        <Link to={`/users/${userId}/posts`} className={styles.back}>&larr; Back to posts</Link>
        {postLoading && <p>Loading...</p>}
        {postError && <p className={styles.error}>{postError.message}</p>}
        {post && (
          <article className={styles.article}>
            <header className={styles.header}>
              <span className={styles.id}>#{post.id}</span>
              <h1 className={styles.title}>{post.title}</h1>
            </header>
            <p className={styles.body}>{post.body}</p>
          </article>
        )}
        {cmtError && <p className={styles.error}>{cmtError.message}</p>}
        {cmtLoading && <p>Loading comments...</p>}
        {comments && (
          <CommentList
            comments={comments}
            viewerEmail={currentUser.email}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </main>
    </>
  );
}
```

- [ ] **Step 4: PostDetailPage styles**

Create `Pr05/src/pages/PostDetailPage.module.css`:

```css
.main {
  max-width: 720px;
  margin: 32px auto;
  padding: 0 24px;
}

.back {
  display: inline-block;
  margin-bottom: 14px;
  font-size: 13px;
}

.article {
  background: var(--surface);
  padding: 24px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.header { display: flex; align-items: baseline; gap: 10px; }
.id { color: var(--text-muted); font-size: 13px; }
.title { margin: 0; font-size: 20px; }
.body { margin: 14px 0 0 0; font-size: 15px; line-height: 1.6; }

.error { color: var(--danger); }
```

- [ ] **Step 5: Verify**

`npm run start`. Open a post via Posts → "Show comments". The detail page shows the body and a list of seeded comments. Add a comment → it appears with your name/email. Edit your comment → save. Delete it → gone. Try to find another comment (one you don't own) → no Edit/Delete buttons. Stop.

- [ ] **Step 6: Commit**

```bash
cd "/Users/david/Documents/Documents - MacBook Pro de David/Mahon Lev/3e Année /1er semestre/FullStack/Fullstack-Course"
git add Pr05/src/components/CommentList.jsx Pr05/src/components/CommentList.module.css Pr05/src/pages/PostDetailPage.jsx Pr05/src/pages/PostDetailPage.module.css
git commit -m "Pr05: implement PostDetailPage with CommentList CRUD"
```

---

### Task 17: AlbumsPage + AlbumCard

**Files:**
- Create: `Pr05/src/components/AlbumCard.jsx`
- Create: `Pr05/src/components/AlbumCard.module.css`
- Replace: `Pr05/src/pages/AlbumsPage.jsx`
- Create: `Pr05/src/pages/AlbumsPage.module.css`

- [ ] **Step 1: AlbumCard**

Create `Pr05/src/components/AlbumCard.jsx`:

```jsx
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
```

- [ ] **Step 2: AlbumCard styles**

Create `Pr05/src/components/AlbumCard.module.css`:

```css
.card {
  background: var(--surface);
  padding: 14px 18px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  display: grid;
  grid-template-columns: 60px 1fr auto;
  align-items: center;
  gap: 14px;
}

.id { color: var(--text-muted); font-size: 13px; }
.title { font-size: 15px; color: var(--text); font-weight: 500; }
.title:hover { color: var(--primary); }
.titleInput { font-size: 15px; }

.actions { display: flex; gap: 6px; }

.btn, .btnDanger {
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 4px 10px;
  font-size: 12px;
  color: var(--text-muted);
}
.btnDanger { color: var(--danger); }
.btn:hover { background: var(--surface-alt); color: var(--text); }
.btnDanger:hover { background: #fee2e2; }
```

- [ ] **Step 3: AlbumsPage**

Replace `Pr05/src/pages/AlbumsPage.jsx`:

```jsx
import { useContext, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TopBar from "../components/TopBar.jsx";
import AlbumCard from "../components/AlbumCard.jsx";
import { createAlbum, deleteAlbum, listAlbumsByUser, updateAlbum } from "../api/albums.js";
import { DataContext } from "../contexts/DataContext.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useDebounce } from "../hooks/useDebounce.js";
import { useResource } from "../hooks/useResource.js";
import styles from "./AlbumsPage.module.css";

export default function AlbumsPage() {
  const { currentUser } = useAuth();
  const userId = currentUser.id;
  const cache = useContext(DataContext);
  const key = `albums?userId=${userId}`;

  const { data: albums, loading, error } = useResource(key, () => listAlbumsByUser(userId));

  const [searchParams, setSearchParams] = useSearchParams();
  const queryId = searchParams.get("id") ?? "";
  const queryTitle = searchParams.get("q") ?? "";
  const debouncedTitle = useDebounce(queryTitle, 200);
  const [newTitle, setNewTitle] = useState("");

  function updateParam(param, value) {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(param); else next.set(param, value);
    setSearchParams(next, { replace: true });
  }

  const filtered = useMemo(() => {
    if (!albums) return [];
    return albums
      .filter((a) => (queryId === "" ? true : String(a.id) === queryId.trim()))
      .filter((a) => (debouncedTitle === "" ? true : a.title.toLowerCase().includes(debouncedTitle.toLowerCase())));
  }, [albums, queryId, debouncedTitle]);

  async function handleAdd(event) {
    event.preventDefault();
    if (!newTitle.trim()) return;
    const created = await createAlbum({ title: newTitle.trim(), userId });
    cache.set(key, [created, ...albums]);
    setNewTitle("");
  }

  async function handleEdit(id, patch) {
    const target = (cache.get(key) ?? []).find((a) => a.id === id);
    if (!target || String(target.userId) !== String(userId)) throw new Error("Not authorized");
    const updated = await updateAlbum(id, patch);
    cache.set(key, albums.map((a) => (a.id === id ? updated : a)));
  }

  async function handleDelete(id) {
    const target = (cache.get(key) ?? []).find((a) => a.id === id);
    if (!target || String(target.userId) !== String(userId)) throw new Error("Not authorized");
    await deleteAlbum(id);
    cache.set(key, albums.filter((a) => a.id !== id));
  }

  return (
    <>
      <TopBar />
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>My albums</h1>
          <p className={styles.count}>{filtered.length} of {albums?.length ?? 0}</p>
        </header>

        <form className={styles.addRow} onSubmit={handleAdd}>
          <input placeholder="New album title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          <button type="submit" className={styles.addBtn}>Add album</button>
        </form>

        <section className={styles.controls}>
          <label className={styles.control}><span>Search by ID</span><input value={queryId} onChange={(e) => updateParam("id", e.target.value)} /></label>
          <label className={styles.control}><span>Search title</span><input value={queryTitle} onChange={(e) => updateParam("q", e.target.value)} /></label>
        </section>

        {loading && <p>Loading albums...</p>}
        {error && <p className={styles.error}>{error.message}</p>}

        <div className={styles.list}>
          {filtered.map((a) => (
            <AlbumCard key={a.id} album={a} viewerId={userId} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 4: AlbumsPage styles**

Create `Pr05/src/pages/AlbumsPage.module.css`:

```css
.main { max-width: 880px; margin: 32px auto; padding: 0 24px; }

.header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 14px; }
.title { margin: 0; font-size: 22px; }
.count { color: var(--text-muted); font-size: 13px; margin: 0; }

.addRow { display: flex; gap: 8px; margin-bottom: 18px; }
.addRow input { flex: 1; }
.addBtn { background: var(--primary); color: #fff; border: none; border-radius: var(--radius-sm); padding: 8px 16px; font-weight: 500; }
.addBtn:hover { background: var(--primary-hover); }

.controls { display: grid; grid-template-columns: 1fr 2fr; gap: 10px; margin-bottom: 18px; }
.control { display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: var(--text-muted); }

.list { display: flex; flex-direction: column; gap: 8px; }
.error { color: var(--danger); }

@media (max-width: 640px) {
  .controls { grid-template-columns: 1fr; }
}
```

- [ ] **Step 5: Verify**

`npm run start`. Log in. Click Albums. List shows only my albums (filter via URL `userId=` confirmed in network tab). Add a new album, edit title, delete. Search filters work. Click an album title → goes to placeholder AlbumDetail. Stop.

- [ ] **Step 6: Commit**

```bash
cd "/Users/david/Documents/Documents - MacBook Pro de David/Mahon Lev/3e Année /1er semestre/FullStack/Fullstack-Course"
git add Pr05/src/components/AlbumCard.jsx Pr05/src/components/AlbumCard.module.css Pr05/src/pages/AlbumsPage.jsx Pr05/src/pages/AlbumsPage.module.css
git commit -m "Pr05: implement AlbumsPage with CRUD and search"
```

---

### Task 18: AlbumDetailPage with PhotoGrid (lazy "Load more")

**Files:**
- Create: `Pr05/src/components/PhotoGrid.jsx`
- Create: `Pr05/src/components/PhotoGrid.module.css`
- Replace: `Pr05/src/pages/AlbumDetailPage.jsx`
- Create: `Pr05/src/pages/AlbumDetailPage.module.css`

- [ ] **Step 1: PhotoGrid**

Create `Pr05/src/components/PhotoGrid.jsx`:

```jsx
import { useContext, useEffect, useState } from "react";
import { createPhoto, deletePhoto, listPhotosByAlbum, updatePhoto } from "../api/photos.js";
import { DataContext } from "../contexts/DataContext.jsx";
import styles from "./PhotoGrid.module.css";

const PAGE_SIZE = 12;

export default function PhotoGrid({ albumId }) {
  const cache = useContext(DataContext);
  const [pages, setPages] = useState(1);
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    setItems([]);
    setPages(1);
    setHasMore(true);
  }, [albumId]);

  useEffect(() => {
    let active = true;
    async function load() {
      const key = `photos?albumId=${albumId}&page=${pages}`;
      const cached = cache.get(key);
      if (cached !== undefined) {
        if (!active) return;
        setItems((prev) => mergePage(prev, cached));
        setHasMore(cached.length === PAGE_SIZE);
        return;
      }
      setLoading(true);
      try {
        const fresh = await listPhotosByAlbum(albumId, pages, PAGE_SIZE);
        if (!active) return;
        cache.set(key, fresh);
        setItems((prev) => mergePage(prev, fresh));
        setHasMore(fresh.length === PAGE_SIZE);
      } catch (err) {
        if (active) setError(err);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [albumId, pages, cache]);

  function mergePage(prev, page) {
    const seen = new Set(prev.map((p) => p.id));
    return [...prev, ...page.filter((p) => !seen.has(p.id))];
  }

  async function handleAdd(event) {
    event.preventDefault();
    if (!newTitle.trim()) return;
    const seed = Math.floor(Math.random() * 100000);
    const created = await createPhoto({
      albumId: Number(albumId),
      title: newTitle.trim(),
      thumbnailUrl: `https://picsum.photos/seed/photo${seed}/150/150`,
      url: `https://picsum.photos/seed/photo${seed}/600/400`,
    });
    setItems((prev) => [created, ...prev]);
    cache.invalidate(`photos?albumId=${albumId}`);
    setAdding(false);
    setNewTitle("");
  }

  async function handleDelete(id) {
    await deletePhoto(id);
    setItems((prev) => prev.filter((p) => p.id !== id));
    cache.invalidate(`photos?albumId=${albumId}`);
  }

  async function handleRename(photo) {
    const next = prompt("New title", photo.title);
    if (!next || next === photo.title) return;
    const updated = await updatePhoto(photo.id, { title: next.trim() });
    setItems((prev) => prev.map((p) => (p.id === photo.id ? updated : p)));
    cache.invalidate(`photos?albumId=${albumId}`);
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        {adding ? (
          <form className={styles.addForm} onSubmit={handleAdd}>
            <input
              autoFocus
              placeholder="Photo title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <button type="submit" className={styles.btnPrimary}>Add</button>
            <button type="button" className={styles.btn} onClick={() => { setAdding(false); setNewTitle(""); }}>Cancel</button>
          </form>
        ) : (
          <button type="button" className={styles.btnPrimary} onClick={() => setAdding(true)}>+ Add photo</button>
        )}
      </div>

      {error && <p className={styles.error}>{error.message}</p>}

      <div className={styles.grid}>
        {items.map((photo) => (
          <figure key={photo.id} className={styles.tile}>
            <img
              src={photo.thumbnailUrl}
              alt={photo.title}
              loading="lazy"
              onClick={() => setLightbox(photo)}
            />
            <figcaption className={styles.caption}>{photo.title}</figcaption>
            <div className={styles.tileActions}>
              <button type="button" className={styles.btn} onClick={() => handleRename(photo)}>Rename</button>
              <button type="button" className={styles.btnDanger} onClick={() => handleDelete(photo.id)}>Delete</button>
            </div>
          </figure>
        ))}
      </div>

      <div className={styles.more}>
        {loading && <span>Loading...</span>}
        {!loading && hasMore && (
          <button type="button" className={styles.loadMore} onClick={() => setPages((p) => p + 1)}>
            Load more
          </button>
        )}
        {!hasMore && items.length > 0 && <span className={styles.end}>No more photos.</span>}
      </div>

      {lightbox && (
        <div className={styles.lightbox} onClick={() => setLightbox(null)}>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.url} alt={lightbox.title} />
            <figcaption>{lightbox.title}</figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: PhotoGrid styles**

Create `Pr05/src/components/PhotoGrid.module.css`:

```css
.wrap { display: flex; flex-direction: column; gap: 16px; }

.toolbar { display: flex; justify-content: flex-end; }

.addForm { display: flex; gap: 6px; }
.addForm input { font-size: 14px; }

.btn, .btnDanger, .btnPrimary, .loadMore {
  border-radius: var(--radius-sm);
  padding: 6px 12px;
  font-size: 13px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
}
.btnDanger { color: var(--danger); border-color: var(--border); }
.btnDanger:hover { background: #fee2e2; }
.btnPrimary { background: var(--primary); color: #fff; border-color: var(--primary); }
.btnPrimary:hover { background: var(--primary-hover); }
.btn:hover { background: var(--surface-alt); }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 14px;
}

.tile {
  margin: 0;
  background: var(--surface);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.tile img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  cursor: zoom-in;
  display: block;
}

.caption {
  font-size: 12px;
  padding: 6px 8px;
  color: var(--text);
  line-height: 1.3;
  flex: 1;
}

.tileActions {
  display: flex;
  gap: 4px;
  padding: 6px 8px;
  border-top: 1px solid var(--border);
}

.tileActions button {
  flex: 1;
  padding: 4px;
  font-size: 11px;
}

.more {
  display: flex;
  justify-content: center;
  padding: 12px 0;
}

.loadMore { background: var(--primary); color: #fff; border-color: var(--primary); padding: 8px 18px; }
.loadMore:hover { background: var(--primary-hover); }

.end { color: var(--text-muted); font-size: 13px; }

.error { color: var(--danger); }

.lightbox {
  position: fixed; inset: 0;
  background: rgba(15, 23, 42, 0.85);
  display: flex; align-items: center; justify-content: center;
  z-index: 100;
  padding: 24px;
}

.lightbox figure { margin: 0; max-width: 90vw; max-height: 90vh; }
.lightbox img { max-width: 90vw; max-height: 80vh; border-radius: var(--radius-md); }
.lightbox figcaption { color: #fff; text-align: center; margin-top: 10px; }
```

- [ ] **Step 3: AlbumDetailPage**

Replace `Pr05/src/pages/AlbumDetailPage.jsx`:

```jsx
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
```

- [ ] **Step 4: AlbumDetailPage styles**

Create `Pr05/src/pages/AlbumDetailPage.module.css`:

```css
.main { max-width: 1080px; margin: 32px auto; padding: 0 24px; }

.back { display: inline-block; margin-bottom: 14px; font-size: 13px; }

.header { display: flex; align-items: baseline; gap: 10px; margin-bottom: 14px; }
.id { color: var(--text-muted); font-size: 13px; }
.title { margin: 0; font-size: 22px; }

.error { color: var(--danger); }
```

- [ ] **Step 5: Verify**

`npm run start`. Open Albums → click an album. 12 thumbnails appear. Click a thumbnail → lightbox shows the larger image. Click backdrop or press Escape → closes. Click "Load more" → 12 more appended. Click "+ Add photo", title it, submit → new tile at the top with a random picsum image. Rename → prompt appears, save → caption updates. Delete → removed. Stop.

- [ ] **Step 6: Commit**

```bash
cd "/Users/david/Documents/Documents - MacBook Pro de David/Mahon Lev/3e Année /1er semestre/FullStack/Fullstack-Course"
git add Pr05/src/components/PhotoGrid.jsx Pr05/src/components/PhotoGrid.module.css Pr05/src/pages/AlbumDetailPage.jsx Pr05/src/pages/AlbumDetailPage.module.css
git commit -m "Pr05: implement AlbumDetailPage and PhotoGrid with load more"
```

---

### Task 19: Wire logout to invalidate the cache

**Files:**
- Modify: `Pr05/src/components/TopBar.jsx`

- [ ] **Step 1: Clear cache on logout**

Edit `Pr05/src/components/TopBar.jsx`. Replace the import block and the `handleLogout` function:

Find the current import section:

```jsx
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import UserInfoModal from "./UserInfoModal.jsx";
import styles from "./TopBar.module.css";
```

Replace with:

```jsx
import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { DataContext } from "../contexts/DataContext.jsx";
import UserInfoModal from "./UserInfoModal.jsx";
import styles from "./TopBar.module.css";
```

Find:

```jsx
  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }
```

Replace with:

```jsx
  const cache = useContext(DataContext);

  function handleLogout() {
    logout();
    cache.clear();
    navigate("/login", { replace: true });
  }
```

- [ ] **Step 2: Verify**

`npm run start`. Log in, navigate to Todos (data loads), Logout, log in as a different user (e.g. `Antonette` / `anastasia.net`). Open devtools Network: a fresh GET to `/todos?userId=2` should fire (not served from cache). Stop.

- [ ] **Step 3: Commit**

```bash
cd "/Users/david/Documents/Documents - MacBook Pro de David/Mahon Lev/3e Année /1er semestre/FullStack/Fullstack-Course"
git add Pr05/src/components/TopBar.jsx
git commit -m "Pr05: clear data cache on logout"
```

---

### Task 20: README + run instructions

**Files:**
- Create: `Pr05/README.md`

- [ ] **Step 1: Create README.md**

Create `Pr05/README.md`:

```markdown
# Pr05 — React + JSON-Server REST App

Full-stack academic project for Prof. Kipnis's course (year 5786).
React 19 + Vite client, json-server backend, English-only UI.

## Run

```bash
npm install
npm run start
```

This boots Vite at http://localhost:5173 and json-server at http://localhost:3001.

Sign in with any seeded user, e.g. `Bret` / `hildegard.org`, `Antonette` / `anastasia.net`.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Vite client only |
| `npm run server` | json-server only |
| `npm run start` | Both, in parallel |
| `npm run build` | Production build |

## Demo flow (oral defense)

1. `/login` → wrong creds → inline error.
2. Sign in as `Bret` / `hildegard.org`.
3. Home: stats appear, click **Info** → modal with profile.
4. **Todos** → add, edit, toggle, sort, search. Refresh F5 → URL params restore filters.
5. **Posts** → CRUD on my posts → click "See other users' posts" → feed → open a post → add a comment → edit/delete my comment.
6. **Albums** → create, edit, open one → photos load 12 at a time → click "Load more" → add a photo → rename → delete.
7. **Logout** → cache cleared, redirect to `/login`. Sign in as a different user → data is fresh.
8. Paste forged URL `/users/5/albums` while logged in as user 1 → redirected to `/home`.
9. DevTools Network tab: navigate Posts → Albums → back → no duplicate fetch (cache hit).

## Part-ז mechanisms

- **Refresh persistence:** `currentUser` in `localStorage`, view state in URL query params, cache mirrored to `sessionStorage`.
- **Client cache:** `DataContext` holds a `Map` keyed by stable URLs; `useResource` checks cache first; mutations call `invalidate(prefix)`.
- **User isolation:** `OwnerRoute` guards private routes; `userId=` filter on every "my" fetch; ownership checks in mutation handlers. Honest limitation: json-server has no real auth.
```

- [ ] **Step 2: Commit**

```bash
cd "/Users/david/Documents/Documents - MacBook Pro de David/Mahon Lev/3e Année /1er semestre/FullStack/Fullstack-Course"
git add Pr05/README.md
git commit -m "Pr05: add README with run instructions and demo flow"
```

---

### Task 21: Final manual QA pass

This task contains no file changes — it's a checklist to walk before declaring the project done.

- [ ] **Step 1: Boot a clean environment**

```bash
cd Pr05 && rm -rf node_modules && npm install && npm run start
```

Expected: both processes start cleanly.

- [ ] **Step 2: Login flows**
  - Wrong username → "Unknown username".
  - Right username, wrong password → "Wrong password".
  - Right credentials (`Bret` / `hildegard.org`) → land on `/home`, name centered in TopBar.

- [ ] **Step 3: Register flow**
  - Mismatched passwords → inline error.
  - Existing username (`Bret`) → "Username already taken".
  - New username + matching passwords → land on `/register/details`. Fill profile, submit → land on `/home`. Devtools shows `POST /users`.

- [ ] **Step 4: Home + Info modal**
  - Stats render with non-zero numbers.
  - Info button → modal with all profile fields.
  - Escape closes the modal. Backdrop click closes the modal.

- [ ] **Step 5: Todos**
  - All 4 controls (sort + 3 searches) work and persist after F5 via URL params.
  - Add → top of list.
  - Toggle → checkbox flips and persists.
  - Double-click title → inline edit → Enter saves, Escape cancels.
  - Delete → row gone.

- [ ] **Step 6: Posts**
  - "My posts": id + title cards only by default.
  - Search by id and title filters.
  - Add a post → appears.
  - Select a post → body expands → Edit → Save → body updates.
  - Delete → gone.
  - "See other users' posts" → feed shows all with author names; no edit/delete buttons.
  - From feed, "Select" navigates to PostDetail.

- [ ] **Step 7: PostDetail / Comments**
  - Title + body render.
  - Comments list with name + email + body.
  - Add comment → appears with my name and email.
  - Edit/Delete buttons only on my comments.

- [ ] **Step 8: Albums**
  - Only my albums (verify `?userId=` in Network).
  - Search by id and title.
  - Add → edit → delete.
  - Click title → AlbumDetail.

- [ ] **Step 9: AlbumDetail / PhotoGrid**
  - First 12 thumbnails load.
  - Click thumbnail → lightbox with bigger image.
  - Load more → 12 more.
  - Add photo → new tile with random picsum image.
  - Rename → prompt → caption updates.
  - Delete → tile gone.

- [ ] **Step 10: Part-ז verification**
  - F5 on `/users/1/todos?sort=title&q=re` → filters preserved.
  - Open Posts (network shows fetch), open Albums, come back to Posts → no second fetch (cache hit). Open the cache: `JSON.parse(sessionStorage.getItem("dataCache"))` returns the populated array.
  - While logged in as user 1, paste `/users/5/albums` in the URL bar → instantly redirected to `/home`.

- [ ] **Step 11: Logout**
  - Logout button → `/login`.
  - `localStorage.getItem("currentUser")` returns `null`.
  - Browser back button → still on `/login` (route guard redirects).

- [ ] **Step 12: Edge cases**
  - Refresh `/users/1/albums/1/photos?` directly → works (no white screen, no console error).
  - Stop json-server → fetch errors surface as inline banners, not white screens.
  - Restart json-server → next action recovers.

- [ ] **Step 13: Final commit**

If any minor fix was needed during QA, commit it:

```bash
cd "/Users/david/Documents/Documents - MacBook Pro de David/Mahon Lev/3e Année /1er semestre/FullStack/Fullstack-Course"
git status
# If clean, no action needed. Otherwise:
git add Pr05/
git commit -m "Pr05: QA polish"
```

---

## Self-review notes

- **Spec coverage:** all eight feature sections of the spec (§5–§10) are covered by Tasks 8–18 and §10 extensions by Tasks 7/8/14 (cache, OwnerRoute, URL params).
- **Placeholders:** none — every step has runnable code and expected output.
- **Type consistency:** `cacheKey` strings follow the same `resource?query` shape throughout; `cache.set`, `cache.get`, `cache.invalidate`, `cache.clear` are used consistently. Component prop names are stable (`onEdit`, `onDelete`, `onAdd`).
- **Out-of-band gotchas:** `react-router-dom@7` API used (`useSearchParams`, `Outlet`, `Navigate`). `json-server@1.0.0-beta.3` supports `?_page=` and `?_limit=`.
