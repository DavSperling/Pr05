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
