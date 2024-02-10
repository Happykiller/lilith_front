import * as React from 'react';
import { Trans } from 'react-i18next';
import { Button } from '@mui/material';
import InputIcon from '@mui/icons-material/Input';
import { useMutation } from "@apollo/client";

import { GQL } from '@src/common/gql';
import { ContextStore, contextStore } from '@src/component/ContextStore';

export const JoinGame = (param: {
  game: any
}) => {
  const context:ContextStore = contextStore();
  const [joinGameSmt, { data, loading, error }] = useMutation(GQL.MUT_JOIN_GAME);

  if (loading) return <p>"Loading...";</p>;
  if (error) return <p>`Error! ${error.message}`</p>;

  if (!context.id) {
    return <Trans>joinGame.log</Trans>
  } else {
    if (!param.game.members.includes(context.id)) {
      return (
        <div>
          <form className="formJoinGame"
            onSubmit={e => {
              e.preventDefault();
              joinGameSmt({ 
                variables: { 
                  game_id: context.game_id
                } 
              });
            }}
          >
            <Button 
              type="submit"
              variant="contained"
              size="small"
              startIcon={<InputIcon />}
            ><Trans>joinGame.join</Trans></Button>
          </form>
        </div>
      );
    }
  }
};