import * as React from 'react';
import { ContextStore, contextStore } from '@src/component/ContextStore';

export const DebugGame = () => {
  const store:ContextStore = contextStore();
  if (process.env.APP_DEBUG) {
    return (
      <div>
        Debug {JSON.stringify(store)}
      </div>
    );
  }
}