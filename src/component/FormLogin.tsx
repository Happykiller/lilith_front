import * as React from 'react';
import { Trans } from 'react-i18next';
import { useLazyQuery } from '@apollo/client';
import { Cancel, Done } from '@mui/icons-material';
import { Box, Button, IconButton, TextField } from '@mui/material';

import '@component/formLogin.scss';
import { GQL } from '@src/common/gql';
import { ContextStore, contextStore } from '@src/component/ContextStore';

export const FormLogin = () => {
  const context:ContextStore = contextStore();
  const reset = contextStore((state) => state.reset);
  const [currentLogin, setCurrentLogin] = React.useState('');
  const [currentSecret, setCurrentSecret] = React.useState('');

  const [executeQuery, {loading, data, error}] = useLazyQuery(GQL.QRY_AUTH, {
    errorPolicy: "all",
    onCompleted: (data) => {
      console.log(data)
      contextStore.setState({ 
        code: data.auth.code,
        id: data.auth.id,
        accessToken: data.auth.accessToken
      });
    }
  });

  const handleClick = () => {
    executeQuery({
      variables: {
        login: currentLogin,
        secret: currentSecret
      }
    })
  }

  if(loading) {
    return <Trans>common.loading</Trans>
  }

  let errorMessage = <div></div>;
  if(error) {
    errorMessage = <div><Trans>formLogin.error</Trans><Trans>{error.message}</Trans></div>
  }

  if (!context.code) {
    return (
      <form className="containerFormLogin"
        onSubmit={handleClick}
      >
        <Box
          display="flex"
          alignItems="center"
          sx={{ 
            flexDirection: 'column',
            gap: '10px;'
           }}
        >
          <TextField
            sx={{ marginRight:1}}
            label={<Trans>formLogin.login.label</Trans>}
            variant="standard"
            size="small"
            onChange={(e) => { 
              e.preventDefault();
              setCurrentLogin(e.target.value);
            }}
          />
          <TextField
            sx={{ marginRight:1}}
            label={<Trans>formLogin.secret.label</Trans>}
            variant="standard"
            size="small"
            onChange={(e) => { 
              e.preventDefault();
              setCurrentSecret(e.target.value);
            }}
          />
          <Button 
            type="submit"
            variant="contained"
            size="small"
            startIcon={<Done />}
            disabled={!(currentLogin.length > 3 && currentSecret.length > 3)}
          ><Trans>common.done</Trans></Button>
          {errorMessage}
        </Box>
      </form>
    )
  } else {
    return <form className="containerFormLogin"
      onSubmit={e => {
        e.preventDefault();
        reset();
      }}
    >
      <div className='name'>
        <Trans>formLogin.name</Trans>{context.code}
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