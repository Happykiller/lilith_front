import * as React from 'react';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { Login } from '@mui/icons-material';

import '@component/home.scss';
import { Footer } from '@component/Footer';
import { FormLogin } from '@component/FormLogin';
import { ContextStore, contextStore } from '@component/ContextStore';

export const Home = () => {
  const context:ContextStore = contextStore();

  const entry = (context.login)?<div className='entry'>
  <Button component={Link} to={'/root'}
    type="submit"
    variant="contained"
    size="small"
    startIcon={<Login />}><Trans>home.enter</Trans></Button>
</div>:'';

  return (
    <div className='containerHome'>
      <div className='title'>
        <Trans>home.title</Trans>
      </div>
      <div className='form'>
        <FormLogin />
        {entry}
      </div>
      <Footer />
    </div>
  )
}