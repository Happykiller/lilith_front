import * as React from 'react';

import '@component/play.scss';
import { Game } from '@component/Game';
import { Footer } from '@component/Footer';
import ResponsiveAppBar from '@component/Bar';

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