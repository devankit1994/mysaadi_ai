"use client";

import * as React from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
};

export const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;

    const init = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!active) return;

      if (error) {
        setSession(null);
      } else {
        setSession(data.session ?? null);
      }

      setIsLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setIsLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = React.useMemo<AuthContextValue>(() => {
    return {
      session,
      user: session?.user ?? null,
      isLoggedIn: !!session,
      isLoading,
    };
  }, [session, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
