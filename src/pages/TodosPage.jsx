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

// three filter parameters: queryId for filtering by ID, queryTitle for filtering by title, and queryDone for filtering by completion status.
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
