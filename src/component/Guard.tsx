import React = require('react');
import { useLocation, Navigate } from "react-router-dom";
import { ContextStore, contextStore } from './ContextStore';

export function Guard({ children }: { children: JSX.Element }) {
  let location = useLocation();
  
  const context:ContextStore = contextStore();

  if (!context.login) {
    return <Navigate to="/" state={{ from: location }} replace />;
  } else {
    return children;
  }
}