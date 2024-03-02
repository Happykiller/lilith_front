import * as React from 'react';
import { Send } from '@mui/icons-material';
import { useMutation } from "@apollo/client";
import { useTranslation } from 'react-i18next';
import { IconButton, MenuItem, Select, SelectChangeEvent } from '@mui/material';

import { GQL } from '@src/common/gql';
import { ContextStore, contextStore } from '@src/component/ContextStore';

export const CreateVote = (param: {
  game: any
}) => {
  const { t } = useTranslation();
  const context:ContextStore = contextStore();
  const [createVoteSmt, { data, loading, error }] = useMutation(GQL.MUT_CREATE_VOTE);

  const indexMiddle = Math.round((param.game.voting.length - 2) / 2);
  const [vote, setVote] = React.useState(param.game.voting[indexMiddle]);

  const handleChange = (event: SelectChangeEvent) => {
    const voteChoosen = event.target.value;
    setVote(voteChoosen);
  };

  if (loading) return <p>"Loading...";</p>;
  if (error) return <p>`Error! ${error.message}`</p>;

  return (
    <div className="card">
      <div className="rank">
        <Select
          sx={{ 
            color: "#018786", 
            backgroundColor: "#F5EBFF"
          }}
          label="Vote"
          size='small'
          value={vote}
          onChange={handleChange}
        >
          {param.game.voting.map((voting: any) => (
            <MenuItem value={voting} key={voting}>{voting}</MenuItem>
          ))}
        </Select>
      </div>
      <div className="suit">
        <IconButton 
          size="small"
          title={t('item.reset')}
          sx={{ 
            color: "#018786", 
            backgroundColor: "#F5EBFF"
          }}
          onClick={(e) => {
            e.preventDefault();
            createVoteSmt({ variables: { 
              game_id: context.game_id,
              vote: vote,
              item_id: context.item_id
            }});
          }}>
          <Send/>
        </IconButton>
      </div>
    </div>
  );
};