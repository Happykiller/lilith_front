import * as React from 'react';
import { Trans } from 'react-i18next';

import '@component/play.scss';
import { Footer } from '@component/Footer';
import { Session } from '@component/Session';
import ResponsiveAppBar from './Bar';

export const Play = () => {
  return (
    <div>
      <ResponsiveAppBar/>
      <div className='containerPlay'>
        <div className='session'>
          <Session/>
        </div>
        <Footer />
      </div>
    </div>
  )
}