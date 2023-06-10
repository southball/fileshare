import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useUrql } from "./UrqlContext";

type AuthUser = {
  username: string;
  displayName: string;
};

type AuthContextType = {
  user: AuthUser | null;
  isInitialLoading: boolean;
  refetch: () => Promise<void>;
  login: (username: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isInitialLoading: true,
  refetch: () => {
    throw new Error("Context is not initialized");
  },
  login: (_username, _password) => {
    throw new Error("Context is not initialized");
  },
  logout: () => {
    throw new Error("Context is not initialized");
  },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const { reset: resetUrql } = useUrql();

  const refetchUser = useCallback(async () => {
    const user = JSON.parse(
      (await fetch("/auth/whoami").then((r) => r.text())) || "null"
    );
    setUser(user);
    return user;
  }, []);

  useEffect(() => {
    void (async () => {
      await refetchUser();
      setIsInitialLoading(false);
    })();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    return await refetchUser();
  }, []);

  const logout = useCallback(async () => {
    await fetch("/auth/logout", {
      method: "POST",
    });
    setUser(null);
    resetUrql();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isInitialLoading, user, login, logout, refetch: refetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
