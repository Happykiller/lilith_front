import * as React from 'react';
import { Add } from '@mui/icons-material';
import { Button, TextField } from '@mui/material';

import { ContextStore, contextStore } from '@src/component/ContextStore';

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
          startIcon={<Add />}
          disabled={!(currentLogin.length > 3)}
        >Record</Button>
      </form>
    )
  } else {
    return <p>
      <u>Name:</u> {context.login}
    </p>
  }
}