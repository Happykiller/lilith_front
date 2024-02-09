import * as React from 'react';
import { Trans } from 'react-i18next';

import '@component/play.scss';
import { Footer } from '@component/Footer';
import { Game } from '@component/Game';
import ResponsiveAppBar from './Bar';

export const Play = () => {
  return (
    <div>
      <ResponsiveAppBar/>
      <div className='containerPlay'>
        <div className='game'>
          <Game/>
        </div>
        <Footer />
      </div>
    </div>
  )
}