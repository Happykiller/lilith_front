import * as React from 'react';
import { Trans } from 'react-i18next';

import '@component/admin.scss';
import { Games } from '@component/Games';
import { Footer } from '@component/Footer';
import ResponsiveAppBar from '@component/Bar';
import { JoinGame } from '@component/JoinGame';
import { FormGame } from '@component/FormGame';

export const Admin = () => {
  return (
    <div>
      <ResponsiveAppBar/>
      <div className='containerAdmin'>
        <div className='title'>
          <Trans>admin.title</Trans>
        </div>
        <div className='games'>
          <h2><Trans>admin.newGame</Trans></h2>
          <FormGame />
          <h2><Trans>admin.joinGame</Trans></h2>
          <JoinGame />
          <h2><Trans>admin.yourGames</Trans></h2>
          <Games/>
        </div>
        <Footer />
      </div>
    </div>
  )
}