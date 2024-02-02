import * as React from 'react';
import { Trans } from 'react-i18next';

import '@component/root.scss';
import { Session } from '@component/Session';
import { Sessions } from '@component/Sessions';
import { FormLogin } from '@component/FormLogin';
import { FormSession } from '@component/FormSession';
import { DebugSession } from '@component/DebugSession';
import { ContextStore, contextStore } from './ContextStore';
 
const Root = () => {
  const context:ContextStore = contextStore();
  return (
    <div className='root'>
        <h1>{context.login}</h1>
        <DebugSession />
        <div className='app-container '>
          <div className='left-container'>
            <Session/>
          </div>
          <div className='right-container'>
            <FormSession />
            <Sessions/>
          </div>
        </div>
    </div>
  )
}
 
export default Root;