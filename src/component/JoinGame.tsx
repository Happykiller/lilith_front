import * as React from 'react';
import { Trans } from 'react-i18next';
import { useMutation } from "@apollo/client";
import InputIcon from '@mui/icons-material/Input';
import { Box, Button, TextField } from '@mui/material';

import { GQL } from '@src/common/gql';
import { ContextStore, contextStore } from '@component/ContextStore';

export const JoinGame = () => {
  const context:ContextStore = contextStore();
  const [joinGameSmt, { data, loading, error }] = useMutation(GQL.MUT_JOIN_GAME);
  const [gameId, setGameId] = React.useState('');

  if (loading) return <Trans>common.loading</Trans>;
  if (error) return <div><Trans>common.error</Trans><Trans>{error.message}</Trans></div>;

  if (!context.id) {
    return <Trans>joinGame.log</Trans>
  } else {
    return (
      <div>
        <form className="formJoinGame"
          onSubmit={e => {
            e.preventDefault();
            joinGameSmt({ 
              variables: { 
                game_id: gameId
              } 
            });
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            sx={{
              gap: '10px;'
            }}
          >
            <TextField
              sx={{ marginRight:1}}
              label={<Trans>joinGame.game.id</Trans>}
              variant="standard"
              size="small"
              onChange={(e) => { 
                e.preventDefault();
                setGameId(e.target.value);
              }}
            />
            <Button 
              type="submit"
              variant="contained"
              size="small"
              startIcon={<InputIcon />}
              disabled={!(gameId.length === 24)}
            ><Trans>joinGame.join</Trans></Button>
          </Box>
        </form>
      </div>
    );
  }
};