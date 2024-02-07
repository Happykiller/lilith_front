import * as React from 'react';
import { Trans } from 'react-i18next';
import { Send } from '@mui/icons-material';
import { useMutation } from "@apollo/client";
import { Button, MenuItem, Select, SelectChangeEvent } from '@mui/material';

import { GQL } from '@src/common/gql';
import { ContextStore, contextStore } from '@src/component/ContextStore';

export const CreateVote = (param: {
  session: any
}) => {
  const context:ContextStore = contextStore();
  const [CreateVoteSmt, { data, loading, error }] = useMutation(GQL.MUT_CREATE_VOTE);

  const indexMiddle = Math.round((param.session.voting.length - 2) / 2);
  const [vote, setVote] = React.useState(param.session.voting[indexMiddle]);

  const handleChange = (event: SelectChangeEvent) => {
    const voteChoosen = event.target.value;
    setVote(voteChoosen);
  };

  if (loading) return <p>"Loading...";</p>;
  if (error) return <p>`Error! ${error.message}`</p>;

  if (context.code && param.session.members.find((elt:any) => elt.name === context.code)) {
    return <p></p>
  } else {
    return (
      <div>
        <form className="formCreateVote"
          onSubmit={e => {
            e.preventDefault();
            CreateVoteSmt({ variables: { 
              sessionId: context.sessionId,
              member: context.code,
              vote: vote,
              itemId: context.itemId
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
            {param.session.voting.map((voting: any) => (
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
  }
};