import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  xp: number;
  streak: number;
  level: number;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

// Simulated user database in localStorage
const USERS_KEY = "gabcode_users";

function getUsers(): Record<string, { password: string; user: User }> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveUser(email: string, password: string, user: User) {
  const users = getUsers();
  users[email] = { password, user };
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        // Simulate async request
        await new Promise((r) => setTimeout(r, 600));

        const users = getUsers();
        const entry = users[email.toLowerCase()];

        if (!entry) {
          return { success: false, error: "E-mail não encontrado." };
        }
        if (entry.password !== password) {
          return { success: false, error: "Senha incorreta." };
        }

        set({ user: entry.user, isAuthenticated: true });
        return { success: true };
      },

      register: async (name, email, password) => {
        await new Promise((r) => setTimeout(r, 600));

        const users = getUsers();
        if (users[email.toLowerCase()]) {
          return { success: false, error: "E-mail já cadastrado." };
        }

        const newUser: User = {
          id: crypto.randomUUID(),
          name: name.trim(),
          email: email.toLowerCase(),
          xp: 0,
          streak: 0,
          level: 1,
          createdAt: new Date().toISOString(),
        };

        saveUser(email.toLowerCase(), password, newUser);
        set({ user: newUser, isAuthenticated: true });
        return { success: true };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (data) => {
        set((state) => {
          if (!state.user) return state;
          const updated = { ...state.user, ...data };
          // Persist updated user in "database"
          const users = getUsers();
          if (users[state.user.email]) {
            users[state.user.email].user = updated;
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
          }
          return { user: updated };
        });
      },
    }),
    {
      name: "gabcode_auth",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
