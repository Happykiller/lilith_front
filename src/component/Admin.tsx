import * as React from 'react';
import { Trans } from 'react-i18next';

import '@component/admin.scss';
import { Footer } from '@component/Footer';
import { Games } from '@component/Games';
import { FormGame } from '@component/FormGame';
import ResponsiveAppBar from '@src/component/Bar';

export const Admin = () => {
  return (
    <div>
      <ResponsiveAppBar/>
      <div className='containerAdmin'>
        <div className='title'>
          <Trans>admin.title</Trans>
        </div>
        <div className='games'>
          <FormGame />
          <Games/>
        </div>
        <Footer />
      </div>
    </div>
  )
}