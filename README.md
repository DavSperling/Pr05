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
