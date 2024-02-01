import * as React from 'react';
import { Add } from '@mui/icons-material';
import { useMutation } from "@apollo/client";
import { Button, TextField } from '@mui/material';

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
        <TextField
          label="Session name"
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
        >Create</Button>
      </form>
    </div>
  );
};