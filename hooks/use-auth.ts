"use client";

import * as React from "react";
import {
  AuthContext,
  type AuthContextValue,
} from "@/components/auth/auth-provider";

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider />");
  }
  return ctx;
}
