import * as React from 'react';
import { Trans } from 'react-i18next';
import { Add } from '@mui/icons-material';
import { useMutation } from "@apollo/client";
import { Box, Button, TextField } from '@mui/material';

import { GQL } from '@src/common/gql';
import { ContextStore, contextStore } from '@src/component/ContextStore';

export const CreateItem = () => {
  const context:ContextStore = contextStore();
  const [itemLabel, setItemLabel] = React.useState('');
  const [createItemSmt, { data, loading, error }] = useMutation(GQL.MUT_CREATE_ITEM);

  if (error) return <p>`Error! ${error.message}`</p>;

  return (
    <div>
      <form className="formCreateItem"
        onSubmit={e => {
          e.preventDefault();
          createItemSmt({ variables: { 
            name: itemLabel, 
            game_id: context.game_id,
            author: context.code
          } });
          setItemLabel('');
        }}
      >
        <Box
          display="flex"
          alignItems="center"
        >
          <TextField
            sx={{ marginRight:1}}
            label={<Trans>createItem.label</Trans>}
            variant="standard"
            size="small"
            value={itemLabel}
            onChange={(e) => { setItemLabel(e.target.value) }}
          />
          <Button 
            type="submit"
            variant="contained"
            size="small"
            startIcon={<Add />}
            disabled={!(itemLabel && itemLabel.length > 3) || context.code === null}
          ><Trans>common.create</Trans></Button>
        </Box>
      </form>
    </div>
  );
};