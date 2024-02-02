import * as React from 'react';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FormLogin } from './FormLogin';
import { ContextStore, contextStore } from './ContextStore';
import { Button } from '@mui/material';
import { Login } from '@mui/icons-material';

export const Home = () => {
  
  const context:ContextStore = contextStore();

  const entry = (context.login)?<div>
  <Button component={Link} to={'/root'}
    type="submit"
    variant="contained"
    size="small"
    startIcon={<Login />}><Trans>home.enter</Trans></Button>
</div>:'';

  return (
    <div>
      <h1><Trans>home.title</Trans></h1>
      <FormLogin />
      {entry}
      <h3>Projet Lilith - <a href="mailto:fabrice.rosito@gmail.com">Envoyer Email</a> - Front version: 0.1.0 - Apis version: 0.1.0 - <a href="https://github.com/Happykiller">Github</a></h3>
    </div>
  )
}