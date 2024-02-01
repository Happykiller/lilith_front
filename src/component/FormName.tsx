import * as React from 'react';
import { Add } from '@mui/icons-material';
import { Button, TextField } from '@mui/material';

import { sessionStore } from '@component/SessionStore';

export const FormName = () => {
  const {name} = sessionStore();
  const [currentName, setCurrentName] = React.useState('');
  if (!name) {
    return (
      <form className="formSetUserName"
        onSubmit={e => {
          e.preventDefault();
          sessionStore.setState({ name: currentName });
        }}
      >
        <TextField
          label="User name"
          variant="standard"
          size="small"
          onChange={(e) => { 
            setCurrentName(e.target.value);
          }}
        />
        <Button 
          type="submit"
          variant="contained"
          size="small"
          startIcon={<Add />}
          disabled={!(currentName.length > 3)}
        >Record</Button>
      </form>
    )
  } else {
    return <p>
      <u>Name:</u> {name}
    </p>
  }
}