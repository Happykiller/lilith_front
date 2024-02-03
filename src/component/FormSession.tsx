import * as React from 'react';
import { Trans } from 'react-i18next';
import { Add } from '@mui/icons-material';
import { useMutation } from "@apollo/client";
import { Box, Button, TextField } from '@mui/material';

import { GQL } from '@src/common/gql';

export const FormSession = () => {
  const [name, setName] = React.useState('');
  const [createSessionSmt, { data, loading, error }] = useMutation(GQL.MUT_CREATE_SESSION);

  if (error) return <p>`Error! ${error.message}`</p>;

  return (
    <div>
      <form className="formCreateSession"
        onSubmit={e => {
          e.preventDefault();
          createSessionSmt({ 
            variables: { name } 
          });
          setName('');
        }}
      >
        <Box
          display="flex"
          alignItems="center"
        >
          <TextField
            sx={{ marginRight:1}}
            label={<Trans>formSession.session.label</Trans>}
            variant="standard"
            size="small"
            value={name}
            onChange={(e) => { setName(e.target.value) }}
          />
          <Button 
            type="submit"
            variant="contained"
            size="small"
            disabled={!(name && name.length > 3)}
            startIcon={<Add />}
          ><Trans>common.create</Trans></Button>
        </Box>
      </form>
    </div>
  );
};