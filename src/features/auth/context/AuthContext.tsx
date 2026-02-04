"use client";

import {
  createContext,
  useContext,
  useCallback,
  ReactNode,
  useSyncExternalStore,
} from "react";
import { User } from "../dto/response";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "accessToken";
const USER_KEY = "user";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

let authState: AuthState = { user: null, token: null, isLoading: true };
let listeners: Array<() => void> = [];
let initialized = false;

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  
  // Initialize on first subscription (client-side)
  if (!initialized && typeof window !== "undefined") {
    initialized = true;
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    
    if (storedToken && storedUser) {
      try {
        authState = {
          token: storedToken,
          user: JSON.parse(storedUser),
          isLoading: false,
        };
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        authState = { user: null, token: null, isLoading: false };
      }
    } else {
      authState = { user: null, token: null, isLoading: false };
    }
    // Schedule emit for next tick to avoid sync state update
    setTimeout(emitChange, 0);
  }
  
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot(): AuthState {
  return authState;
}

// Cache the server snapshot to avoid infinite loops
const serverSnapshot: AuthState = { user: null, token: null, isLoading: true };

function getServerSnapshot(): AuthState {
  return serverSnapshot;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setAuth = useCallback((newUser: User, newToken: string) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    authState = { user: newUser, token: newToken, isLoading: false };
    emitChange();
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    authState = { user: null, token: null, isLoading: false };
    emitChange();
  }, []);

  const value: AuthContextType = {
    user: state.user,
    token: state.token,
    isAuthenticated: !!state.token && !!state.user,
    isLoading: state.isLoading,
    setAuth,
    clearAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
