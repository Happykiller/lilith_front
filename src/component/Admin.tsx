import * as React from 'react';
import { Trans } from 'react-i18next';

import '@component/admin.scss';
import { Footer } from '@component/Footer';
import { Sessions } from '@component/Sessions';
import { FormSession } from '@component/FormSession';
import ResponsiveAppBar from '@src/component/Bar';

export const Admin = () => {
  return (
    <div>
      <ResponsiveAppBar/>
      <div className='containerAdmin'>
        <div className='title'>
          <Trans>admin.title</Trans>
        </div>
        <div className='sessions'>
          <FormSession />
          <Sessions/>
        </div>
        <Footer />
      </div>
    </div>
  )
}