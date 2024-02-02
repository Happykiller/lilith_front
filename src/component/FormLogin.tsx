import * as React from 'react';
import { Add, Cancel, Done } from '@mui/icons-material';
import { Button, TextField } from '@mui/material';

import { ContextStore, contextStore } from '@src/component/ContextStore';
import { Trans } from 'react-i18next';

export const FormLogin = () => {
  const context:ContextStore = contextStore();
  const [currentLogin, setCurrentLogin] = React.useState('');
  if (!context.login) {
    return (
      <form className="formSetUserName"
        onSubmit={e => {
          e.preventDefault();
          contextStore.setState({ login: currentLogin });
        }}
      >
        <TextField
          label="User name"
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
    return <form className="formSetUserName"
      onSubmit={e => {
        e.preventDefault();
        contextStore.setState({ login: '' });
      }}
    >
      <h3>{context.login}</h3>
      <Button 
        type="submit"
        variant="contained"
        size="small"
        startIcon={<Cancel />}
      ><Trans>common.cancel</Trans></Button>
    </form>
  }
}