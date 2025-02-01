// src\component\DebugSession.tsx
import { useMemo } from "react";
import { contextStore } from "@src/component/ContextStore";

export const DebugGame = () => {
  if (!process.env.APP_DEBUG) return null;

  const store = useMemo(() => contextStore(), []);

  return (
    <div>
      <strong>Debug:</strong>
      <pre>{JSON.stringify(store, null, 2)}</pre>
    </div>
  );
};
