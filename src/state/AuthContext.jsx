import { createContext, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "inkwell_user";

const AuthContext = createContext({
  currentUser: null,
  login: (username) => {},
  logout: () => {},
});

const getInitialUser = () => {
  try {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    return parsed?.username ? parsed : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(getInitialUser);

  const login = (username) => {
    if (!username) return;
    const user = { username: String(username) };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentUser(null);
  };

  const value = useMemo(() => ({ currentUser, login, logout }), [currentUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
