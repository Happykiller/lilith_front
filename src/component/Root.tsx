import * as React from 'react';

import '@component/root.scss';
import { Session } from '@component/Session';
import { Sessions } from '@component/Sessions';
import { FormLogin } from '@component/FormLogin';
import { FormSession } from '@component/FormSession';
import { DebugSession } from '@component/DebugSession';
 
const Root = () => {
  return (
    <div className='root'>
        <h1>Lilith</h1>
        <DebugSession />
        <div className='app-container '>
          <div className='left-container'>
            <Session/>
          </div>
          <div className='right-container'>
            <FormLogin />
            <FormSession />
            <Sessions/>
          </div>
        </div>
    </div>
  )
}
 
export default Root;