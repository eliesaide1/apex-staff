import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authStore } from '@apex/shared';
import { StaffRole } from '../roles';

interface AuthState {
  token: string | null;
  role: StaffRole;
  ready: boolean;
  signIn: (token: string, role: StaffRole) => Promise<void>;
  signOut: () => Promise<void>;
  setRole: (role: StaffRole) => void;
}

const AuthCtx = createContext<AuthState>({
  token: null,
  role: 'teacher',
  ready: false,
  signIn: async () => undefined,
  signOut: async () => undefined,
  setRole: () => undefined,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<StaffRole>('teacher');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    authStore.hydrate().then((t) => {
      setToken(t);
      setReady(true);
    });
    authStore.setUnauthenticatedHandler(() => setToken(null));
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      token,
      role,
      ready,
      signIn: async (t: string, r: StaffRole) => {
        await authStore.setToken(t);
        setRole(r);
        setToken(t);
      },
      signOut: async () => {
        await authStore.setToken(null);
        setToken(null);
      },
      setRole,
    }),
    [token, role, ready],
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
};

export const useAuth = () => useContext(AuthCtx);
