import * as React from 'react';
import { Trans } from 'react-i18next';
import { Add } from '@mui/icons-material';
import { useMutation } from "@apollo/client";
import { Box, Button, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';

import { GQL } from '@src/common/gql';

export const FormSession = () => {
  let enumList: any = [
    ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '?', 'coffee'],
    ['1', '3', '5', '8', '13', '21', '24', '34', '55', '89', '?', 'coffee'],
    ['0.5', '1', '2', '3', '5', '8', '13', '20', '40', '100', '?', 'coffee'],
    ['1', '2', '4', '8', '16', '32', '64', '?', 'coffee']
  ];
  const [name, setName] = React.useState('');
  const [voting, setVoting] = React.useState('0');
  const [createSessionSmt, { data, loading, error }] = useMutation(GQL.MUT_CREATE_SESSION);

  if (error) return <p>`Error! ${error.message}`</p>;

  const handleChange = (event: SelectChangeEvent) => {
    setVoting(event.target.value);
  };

  return (
    <div>
      <form className="formCreateSession"
        onSubmit={e => {
          e.preventDefault();
          createSessionSmt({ 
            variables: { 
              name: name,
              voting: enumList[parseInt(voting)]
            } 
          });
          setName('');
        }}
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
            label={<Trans>formSession.session.label</Trans>}
            variant="standard"
            size="small"
            value={name}
            onChange={(e) => { setName(e.target.value) }}
          />
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={voting}
            label="Age"
            onChange={handleChange}
          >
            <MenuItem value='0'>XSS, XS, M, L, XL, XXL, ?, coffee</MenuItem>
            <MenuItem value='1'>1, 3, 5, 8, 13, 21, 24, 34, 55, 89, ?, coffee</MenuItem>
            <MenuItem value='2'>0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100, ?, coffee</MenuItem>
            <MenuItem value='3'>1, 2, 4, 8, 16, 32, 64, ?, coffee</MenuItem>
          </Select>
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