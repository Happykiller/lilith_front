// src\component\Guard.tsx
import { ReactNode } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { contextStore } from "@component/ContextStore";

interface GuardProps {
  children: ReactNode;
}

export function Guard({ children }: GuardProps) {
  const location = useLocation();
  const context = contextStore();

  return context.id ? children : <Navigate to="/" state={{ from: location }} replace />;
}
