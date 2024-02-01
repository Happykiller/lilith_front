import * as React from 'react';
import { SessionStore, sessionStore } from '@component/SessionStore';

export const DebugSession = () => {
  const store:SessionStore = sessionStore();
  return (
    <div>
      Debug {JSON.stringify(store)}
    </div>
  );
}