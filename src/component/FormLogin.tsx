import * as React from 'react';
import { Trans } from 'react-i18next';
import { Cancel, Done } from '@mui/icons-material';
import { Button, IconButton, TextField } from '@mui/material';

import '@component/formLogin.scss';
import { ContextStore, contextStore } from '@src/component/ContextStore';

export const FormLogin = () => {
  const context:ContextStore = contextStore();
  const [currentLogin, setCurrentLogin] = React.useState('');
  if (!context.login) {
    return (
      <form className="containerFormLogin"
        onSubmit={e => {
          e.preventDefault();
          contextStore.setState({ login: currentLogin });
        }}
      >
        <TextField
          label={<Trans>formLogin.login.label</Trans>}
          variant="standard"
          size="small"
          onChange={(e) => { 
            setCurrentLogin(e.target.value);
          }}
        />
        <Button 
          type="submit"
          variant="contained"
          size="small"
          startIcon={<Done />}
          disabled={!(currentLogin.length > 3)}
        ><Trans>common.done</Trans></Button>
      </form>
    )
  } else {
    return <form className="containerFormLogin"
      onSubmit={e => {
        e.preventDefault();
        contextStore.setState({ login: '' });
      }}
    >
      <div className='name'>
        <Trans>formLogin.name</Trans>{context.login}
        <IconButton 
          type="submit"
          size="small"
        >
          <Cancel/>
        </IconButton>
      </div>
    </form>
  }
}