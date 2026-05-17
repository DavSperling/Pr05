# Pr05 — React + JSON-Server REST API App — Design Spec

**Date:** 2026-05-17
**Course:** Full-Stack Web Development (Prof. Shlomo Kipnis, Lev Academic Center, 5786)
**Author:** David
**Working mode:** Solo (single-developer build, oral defense to evaluators)

---

## 1. Goal

Build a React Single Page Application that consumes a local JSON-Server REST API replicating the structure of `jsonplaceholder.typicode.com`. The app supports authentication, profile management, and CRUD on todos, posts, comments, albums, and photos for the active user.

The project will be defended orally — every architectural choice must be simple to explain. "Simple but clean" is the design principle: no premature abstractions, no over-engineered patterns, no library magic that hides what the code does.

---

## 2. Required technologies (from the assignment)

- React (functional components, hooks)
- React Router
- React Forms (controlled inputs)
- JavaScript `async/await`
- JavaScript `fetch`

## 3. Chosen stack

| Concern | Choice | Rationale |
|---|---|---|
| Build tool | Vite + React 19 | Consistent with Pr04, fastest dev experience |
| Router | React Router v7 | Latest stable, declarative `<Route>` + nested routes |
| State (auth, cache) | React Context API | No external dependency, easy to explain |
| Forms | Controlled inputs, plain `useState` | No form library — defensible at oral defense |
| HTTP | Native `fetch` + `async/await` | Required by spec |
| Styling | CSS Modules + `theme.css` (CSS variables) | Required: simple but clean; no UI library |
| Backend | `json-server` on port `3001` | Required by spec |
| Process orchestration | `concurrently` (dev dep) | One command runs both client and server |

**Language convention:** All code, identifiers, comments, JSX text, alt text, and JSON keys are in English. UI strings are in English.

---

## 4. Project structure

```
Pr05/
├── server/
│   └── db.json
├── src/
│   ├── api/
│   │   ├── client.js
│   │   ├── users.js
│   │   ├── todos.js
│   │   ├── posts.js
│   │   ├── comments.js
│   │   ├── albums.js
│   │   └── photos.js
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   └── DataContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useResource.js
│   │   └── useDebounce.js
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── RegisterDetailsPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── TodosPage.jsx
│   │   ├── PostsPage.jsx
│   │   ├── PostDetailPage.jsx
│   │   ├── AlbumsPage.jsx
│   │   └── AlbumDetailPage.jsx
│   ├── components/
│   │   ├── TopBar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── OwnerRoute.jsx
│   │   ├── UserInfoModal.jsx
│   │   ├── TodoItem.jsx
│   │   ├── PostCard.jsx
│   │   ├── CommentList.jsx
│   │   ├── AlbumCard.jsx
│   │   └── PhotoGrid.jsx
│   ├── styles/
│   │   └── theme.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## 5. Routes (React Router)

| URL pattern | Page | Guard |
|---|---|---|
| `/login` | LoginPage | none |
| `/register` | RegisterPage | none |
| `/register/details` | RegisterDetailsPage | none (step 2 of register) |
| `/home` | HomePage | ProtectedRoute |
| `/users/:userId/todos` | TodosPage | OwnerRoute |
| `/users/:userId/posts` | PostsPage (my posts view) | OwnerRoute |
| `/users/:userId/posts/feed` | PostsPage (all users feed) | ProtectedRoute |
| `/users/:userId/posts/:postId` | PostDetailPage | ProtectedRoute |
| `/users/:userId/albums` | AlbumsPage | OwnerRoute |
| `/users/:userId/albums/:albumId/photos` | AlbumDetailPage | OwnerRoute |
| `*` | redirect to `/home` if authed, else `/login` | — |

- `ProtectedRoute` = "must be logged in".
- `OwnerRoute` = "must be logged in AND `params.userId === currentUser.id`".

URL search params carry view state (e.g. `?sort=title&q=foo`) so refresh preserves the user's current filter/sort.

---

## 6. db.json (local server data)

**Source:** copied from `jsonplaceholder.typicode.com`. Image URLs replaced with `https://picsum.photos/seed/{photoId}/600/400` because the original `via.placeholder.com` URLs are broken.

**Resources:**
- `users` — 10 entries from jsonplaceholder. Each user record adds a `password` field. For existing users, the password is the value of their `website` field (per spec). For users created via register, the password is the chosen value.
- `todos` — copied from jsonplaceholder.
- `posts` — copied from jsonplaceholder.
- `comments` — copied from jsonplaceholder.
- `albums` — copied from jsonplaceholder.
- `photos` — sampled (first ~200 entries) with `picsum.photos` URLs; full set would slow demo without adding value.

---

## 7. Authentication flow

### Login (`/login`)
1. User enters `username` and `password`.
2. `GET /users?username=<username>` → 0 or 1 result.
3. If 1 result AND `result.password === input.password` → success.
4. On success: store `{ id, username, name, email }` in `localStorage` under key `currentUser`, redirect to `/home`.
5. On failure: display inline error, stay on `/login`.

### Register (`/register`)
Step 1 — basic credentials form:
- Fields: `username`, `password`, `passwordVerify`.
- Client-side validation: passwords match, non-empty.
- `GET /users?username=<username>` → if any result, reject with "username already taken".
- If unique: stash `{ username, password }` in router state, navigate to `/register/details`.

Step 2 — profile completion (`/register/details`):
- Fields: `name`, `email`, `phone`, `website` (optional, defaults to "user.local"), and address (street, city) and company (name).
- `POST /users` with the full user object (including the password chosen in step 1).
- On success: store user in `localStorage`, redirect to `/home`.

### Logout
Clear `localStorage` key `currentUser`, redirect to `/login`. Also invalidate in-memory cache to prevent leakage.

---

## 8. Pages — feature detail

### HomePage (`/home`)
- TopBar visible (see §9).
- Center content: a welcome card "Hello, {fullName}" + summary counts (My todos / My posts / My albums) fetched from server and cached.

### UserInfoModal (triggered by Info button)
- Overlay over the current page. No URL change.
- Renders all current user fields (name, username, email, phone, website, address, company).
- Closable by Escape, backdrop click, or X button.

### TodosPage (`/users/:userId/todos`)
- Fetch `GET /todos?userId=<userId>`.
- Each row: `id` + `title` + checkbox (`completed`).
- Sort `<select>`: by id / by title / by completion state.
- Search inputs: by `id` (exact), by `title` substring (case-insensitive), by completion (`<select>` All/Done/Not done).
- Add (button + small form): new todo with `userId=<currentUser.id>`, `completed: false`, server-assigned id.
- Edit: inline edit of title.
- Toggle completed: PATCH the `completed` field.
- Delete: trash icon + confirmation.
- All filter/sort state is mirrored to URL search params for refresh resilience.

### PostsPage — "my posts" view (`/users/:userId/posts`)
- Fetch `GET /posts?userId=<userId>`.
- List view: cards showing `id` + `title` only.
- Search: by `id` (exact), by `title` (substring).
- Add post: form with `title` + `body`; `userId=<currentUser.id>`.
- Select a post → highlight card + show body inline + button "Show comments".
- Edit / delete own post.
- Top toggle button "See other users' posts" → navigates to `/users/:userId/posts/feed`.

### PostsPage — "feed" view (`/users/:userId/posts/feed`)
- Fetch `GET /posts` (all users).
- Same card display (id + title) with the post author's name appended.
- Click → `/users/:userId/posts/:postId` (PostDetail).
- No add/edit/delete on this view (read-only for others' posts).

### PostDetailPage (`/users/:userId/posts/:postId`)
- Fetch `GET /posts/:postId`.
- Render title, body, author name.
- Comments section: `GET /comments?postId=<postId>`.
- Add comment: always allowed for the current user. The comment is stored with `email: currentUser.email` and `name: currentUser.name`.
- Edit / delete comment: only allowed if the comment's `email === currentUser.email`.

### AlbumsPage (`/users/:userId/albums`)
- Fetch `GET /albums?userId=<currentUser.id>`. Pure private view.
- List of cards: `id` + `title`. Search by id, by title.
- Add new album. Edit / delete own albums.
- Click an album → AlbumDetail.

### AlbumDetailPage (`/users/:userId/albums/:albumId/photos`)
- Fetch first page: `GET /photos?albumId=<albumId>&_page=1&_limit=12`.
- Render a grid of thumbnails (`thumbnailUrl`).
- "Load more" button at the bottom: increment `_page`, append to grid.
- Click thumbnail → enlarge in a lightbox showing `url` and `title`.
- Add photo: form with `title` + image URL (default: a `picsum.photos` URL).
- Edit / delete photo.

---

## 9. TopBar

- Sticky, centered header at the top of the viewport.
- Layout: brand mark on the left, **user full name centered**, action buttons on the right: **Info · Todos · Posts · Albums · Logout**.
- Each button uses `<NavLink>` so the active route is visually highlighted.
- "Info" is a button (opens modal), not a link.
- Tailwind-free, styled via `TopBar.module.css` with the theme variables.

Theme variables (in `theme.css`):
- `--bg`, `--surface`, `--text`, `--text-muted`
- `--primary`, `--primary-hover`, `--accent`
- `--danger`
- `--radius-sm`, `--radius-md`
- `--shadow-sm`, `--shadow-md`
- `--font-sans`

Default theme: light, neutral palette with one accent color. No dark mode (out of scope).

---

## 10. Part ז — Extensions (challenges)

This section describes the three required extensions in detail, each with the chosen mechanism and a one-sentence explanation for the oral defense.

### 10.1 Page-refresh resilience

**Mechanism:**
- `currentUser` is persisted in `localStorage` under key `currentUser`. On app mount, `AuthContext` reads it synchronously before the first render.
- React Router `BrowserRouter` already keeps the active path in the URL — F5 reloads the same route.
- Per-page view state (search query, sort criterion, selected post id) is stored in URL search params via `useSearchParams`, not in component-local state. Refresh reconstructs the view exactly.
- The in-memory cache (see 10.2) is mirrored to `sessionStorage` on each write, and rehydrated on app boot.

**One-line oral defense:** "On refresh, the URL plus localStorage and sessionStorage together rebuild the exact same screen — nothing is held in volatile React state alone."

### 10.2 Client-side cache

**Mechanism:**
- `DataContext` holds a `Map<key, value>` where keys are stable URL-like strings (e.g. `posts?userId=3`, `albums/5/photos?_page=1`).
- A custom hook `useResource(key, fetcher)`:
  - returns the cached value immediately if present;
  - else triggers `fetcher()`, stores the result under `key`, and returns it.
- All mutation calls (POST/PUT/PATCH/DELETE) call `invalidate(prefix)` on `DataContext` to remove stale keys. Example: deleting a todo invalidates `todos?userId=<id>`.
- The cache is mirrored to `sessionStorage` so refresh keeps it warm.

**One-line oral defense:** "Each resource URL is a cache key; we hit the network only on miss or after an invalidation triggered by a mutation."

### 10.3 Prevent access to other users' data

**Defense in depth — three layers:**

1. **Route guard (`OwnerRoute`):** if `params.userId !== currentUser.id`, redirect to `/home`. Covers all private routes (`/users/:userId/todos`, `/users/:userId/posts`, `/users/:userId/albums`, etc.).

2. **Query-level filtering:** every "my" fetch always includes `?userId=<currentUser.id>`. The UI never asks the server for other users' albums.

3. **Mutation-level checks:** before sending a `PUT`/`PATCH`/`DELETE`, the API helpers (`api/albums.js`, `api/photos.js`, `api/comments.js`) verify ownership in code:
   - albums/photos: `target.userId === currentUser.id`
   - comments: `target.email === currentUser.email`
   - posts: `target.userId === currentUser.id`
   On mismatch, the helper throws and the UI shows a "Not authorized" message.

**Honest limitation, stated at the oral defense:** JSON-Server has no real authentication — a determined user could `curl` the API directly and bypass the client guards. The mechanism is a layered client-side defense, sufficient to demonstrate the concept; a real backend (Express + JWT) would be needed for true enforcement.

---

## 11. Error handling

- All `fetch` calls wrapped in `try/catch`. Errors bubble up to a `useErrorMessage` hook that exposes a setter to the page; the page renders an inline error banner (red, dismissible).
- Loading state is local to the hook (`{ data, loading, error }`).
- No global toast system — one inline banner per page keeps things simple and visible during demo.

---

## 12. Testing approach

This is a 20-hour academic project, oral-defended. The plan does not include an automated test suite — the implementation budget would not survive it.

Quality is verified manually via the demo flow (see §14), and code is reviewed for:
- All API calls cancel correctly on component unmount (no `setState on unmounted`).
- All forms are controlled and reset on submit/cancel.
- No props drilling beyond 2 levels (use Context if deeper).
- No hard-coded URLs in components (all live in `src/api/*`).

If time remains after the core build, a handful of smoke tests with Vitest could be added for the API helpers.

---

## 13. NPM scripts

```json
{
  "scripts": {
    "dev": "vite",
    "server": "json-server --watch server/db.json --port 3001",
    "start": "concurrently \"npm:server\" \"npm:dev\"",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## 14. Demo script (for oral defense)

1. `npm run start` — both client (Vite at :5173) and json-server (:3001) come up.
2. Open `/login` — try wrong credentials → inline error appears, URL unchanged.
3. Log in as a seeded user (e.g. `username: Bret`, password: `hildegard.org`). Redirect to `/home`.
4. On `/home`: click **Info** → modal overlay shows user details. Close modal.
5. Click **Todos** → URL becomes `/users/1/todos`. Add a todo, toggle one, sort by completion, search by title.
6. F5 (refresh) → same URL, same sort, same search query restored. Demonstrates §10.1.
7. Click **Posts** → my posts. Edit one. Switch to feed → see all users' posts. Open one → add a comment as the current user.
8. Click **Albums** → my albums. Create a new album. Open it → grid loads 12 photos → click "Load more" → 12 more appended.
9. In a new tab, paste a forged URL `/users/5/albums` → redirected to `/home`. Demonstrates §10.3.
10. Open browser devtools Network tab → navigate Posts → Albums → back to Posts: no second request to `/posts?userId=1`. Demonstrates §10.2.
11. **Logout** → localStorage cleared, redirect to `/login`. Try going back to `/home` via browser back button → redirected to `/login`.

---

## 15. Out of scope (explicit)

- Real authentication / token security.
- Multi-language i18n (English only).
- Dark mode.
- Automated tests beyond optional API smoke tests.
- Pagination on todos/posts/albums (only photos paginate, per spec).
- Mobile-first responsive design (a single desktop-friendly layout that does not break on tablet is enough).
- Optimistic UI updates (we wait for the server to confirm before updating the cache).

---

## 16. Risk + mitigation

| Risk | Mitigation |
|---|---|
| `json-server` refuses certain writes (immutable id, conflicting unique fields) | Use the assigned id from the response; never reuse client-generated ids on POST. |
| `picsum.photos` is slow under burst | Use `_limit=12` and "Load more" so we never request more than 12 images at once. |
| Cache invalidation forgotten somewhere | Centralize all mutations through `api/*` modules — each module owns the `invalidate(...)` call paired with the mutation. |
| Refresh on `/users/3/albums/4/photos` while not logged in | `OwnerRoute` runs before render; redirect happens before any fetch. |
| Concurrent users in the same browser session | Out of scope — one user per browser, logout clears state. |
