import * as React from 'react';
import { Trans } from 'react-i18next';
import { Send } from '@mui/icons-material';
import { useMutation } from "@apollo/client";
import { Button, MenuItem, Select, SelectChangeEvent } from '@mui/material';

import { GQL } from '@src/common/gql';
import { ContextStore, contextStore } from '@src/component/ContextStore';

export const CreateVote = (param: {
  game: any
}) => {
  const context:ContextStore = contextStore();
  const [CreateVoteSmt, { data, loading, error }] = useMutation(GQL.MUT_CREATE_VOTE);

  const indexMiddle = Math.round((param.game.voting.length - 2) / 2);
  const [vote, setVote] = React.useState(param.game.voting[indexMiddle]);

  const handleChange = (event: SelectChangeEvent) => {
    const voteChoosen = event.target.value;
    setVote(voteChoosen);
  };

  if (loading) return <p>"Loading...";</p>;
  if (error) return <p>`Error! ${error.message}`</p>;

  return (
    <div>
      <form className="formCreateVote"
        onSubmit={e => {
          e.preventDefault();
          CreateVoteSmt({ variables: { 
            game_id: context.game_id,
            vote: vote,
            item_id: context.item_id
          } });
        }}
      >
        <Select
          sx={{ marginRight:1}}
          labelId="selectVote"
          id="selectVote"
          value={vote}
          label="Vote"
          size='small'
          onChange={handleChange}
        >
          {param.game.voting.map((voting: any) => (
            <MenuItem value={voting} key={voting}>{voting}</MenuItem>
          ))}
        </Select>
        <Button 
          type="submit"
          variant="contained"
          size="small"
          startIcon={<Send />}
        ><Trans>createVote.vote</Trans></Button>
      </form>
    </div>
  );
};