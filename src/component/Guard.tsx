import * as React from 'react';
import { useLocation, Navigate } from "react-router-dom";

import { ContextStore, contextStore } from '@component/ContextStore';

export function Guard({ children }: { children: JSX.Element }) {
  let location = useLocation();
  
  const context:ContextStore = contextStore();

  if (!context.code) {
    return <Navigate to="/" state={{ from: location }} replace />;
  } else {
    return children;
  }
}