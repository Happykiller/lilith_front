import * as React from 'react';

import '@component/play.scss';
import '@component/common.scss';
import { Game } from '@component/Game';
import { Footer } from '@component/Footer';
import ResponsiveAppBar from '@component/Bar';

export const Play = () => {
  return (
    <div className="app">
      <ResponsiveAppBar/>
      <div className="parent_container">
        <div className="container">
          <Game/>
        </div>
      </div>
      <Footer />
    </div>
  )
}