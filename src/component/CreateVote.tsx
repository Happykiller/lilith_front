import * as React from 'react';
import { useMutation } from "@apollo/client";
import { Add, RestartAlt } from '@mui/icons-material';
import { Button, MenuItem, Select, SelectChangeEvent } from '@mui/material';

import { GQL } from '@src/common/gql';
import { ContextStore, contextStore } from '@src/component/ContextStore';

export const CreateVote = (param: {
  session: any
}) => {
  const context:ContextStore = contextStore();
  const [CreateVoteSmt, { data, loading, error }] = useMutation(GQL.MUT_CREATE_VOTE);
  const [vote, setVote] = React.useState('L');

  const handleChange = (event: SelectChangeEvent) => {
    const voteChoosen = event.target.value;
    setVote(voteChoosen);
  };

  if (loading) return <p>"Loading...";</p>;
  if (error) return <p>`Error! ${error.message}`</p>;

  if (context.login && param.session.members.find((elt:any) => elt.name === name)) {
    return <p></p>
  } else {
    return (
      <div>
        <form className="formCreateVote"
          onSubmit={e => {
            e.preventDefault();
            CreateVoteSmt({ variables: { 
              sessionId: context.sessionId,
              member: context.login,
              vote: vote,
              itemId: context.itemId
            } });
          }}
        >
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={vote}
            label="Vote"
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
            startIcon={<Add />}
          >Vote</Button>
        </form>
      </div>
    );
  }
};