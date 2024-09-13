"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { User } from "@prisma/client";
import { getUserDetails } from "@/app/_actions/user-actions";

interface GlobalContextType {
  clientUser: User | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  const { user } = useClerk();
  const [clientUser, setClientUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchUserDetails() {
    if (!user) {
      setClientUser(null);
      setLoading(false);
      return;
    }

    const email = user.primaryEmailAddress?.emailAddress;
    const name = user.fullName;
    const clerkId = user.id;

    if (!email || !name || !clerkId) {
      setError("Missing user data");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getUserDetails({ clerkId, email, name });
      if (!response.success) throw new Error(response.error);
      setClientUser(response.data || null);
    } catch (error) {
      console.error((error as Error).message);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <GlobalContext.Provider value={{ clientUser, loading, error, refreshUser: fetchUserDetails }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalStore() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobalStore must be used within a GlobalProvider");
  }
  return context;
}
