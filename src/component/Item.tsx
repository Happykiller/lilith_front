import * as React from 'react';
import { useMutation } from "@apollo/client";
import { Trans, useTranslation } from 'react-i18next';
import { Add, RestartAlt, Visibility } from '@mui/icons-material';
import { Button, IconButton, List, ListItem } from '@mui/material';

import { GQL } from '@src/common/gql';
import { CreateVote } from '@component/CreateVote';
import { ContextStore, contextStore } from '@src/component/ContextStore';

export const Item = (param: {
  game: any
}) => {
  const context:ContextStore = contextStore();
  const [revealSmt, stateRevealSmt] = useMutation(GQL.MUT_REVEAL);
  const [resetSmt, stateResetSmt] = useMutation(GQL.MUT_RESET);

  if (context.item_id) {
    const { t } = useTranslation();
    const currentItem = param.game.items.find((item:any) => item.id === context.item_id);

    if (currentItem) {
      let formVote;
      if (
        context.id
        && currentItem.state !== 'REVEAL'
        && param.game.members.includes(context.id)
        && !currentItem.votes.find((elt:any) => elt.author_id === context.id)
      ) {
        formVote = <CreateVote
        game={param.game}
        />
      } else {
        formVote = <p></p>
      }

      let revealBt;
      if (
        currentItem.state !== 'REVEAL'
        && param.game.members.includes(context.id)
        && context.id === currentItem.author_id
      ) {
        revealBt = <form
        onSubmit={e => { 
          e.preventDefault();
          revealSmt({ variables: { 
            game_id: context.game_id,
            item_id: context.item_id
          } });
        }}
      >
        <Button 
          type="submit"
          variant="contained"
          size="small"
          startIcon={<Visibility />}
        ><Trans>item.reveal</Trans></Button>
      </form>
      } else {
        revealBt = <p></p>
      }

      return <div>
        <p>
          <u><Trans>item.item</Trans></u>{currentItem.name}
        </p>
        {revealBt}
        <List>
          {
            param.game.members.map((user_id: any) => {
              const vote = currentItem.votes.find((vote:any) => vote.author_id === user_id);
              if (!vote) {
                if (currentItem.state !== 'REVEAL') {
                  return (
                    <ListItem disablePadding key={user_id}>
                      {user_id} = &gt; ?
                    </ListItem>
                  )
                } else {
                  return
                }
              } else if (vote.author_id === context.id) {
                if (currentItem.state !== 'REVEAL') {
                  return (
                    <ListItem disablePadding key={user_id}>
                      {vote.author_id} = &gt; {vote.vote} <form
                        onSubmit={e => { 
                          e.preventDefault();
                          resetSmt({ 
                            variables: { 
                              game_id: context.game_id,
                              item_id: context.item_id,
                              vote_id: vote.id
                            } 
                          });
                        }}
                      >
                        <IconButton 
                          type="submit"
                          size="small"
                          title={t('item.reset')}
                        >
                          <RestartAlt/>
                        </IconButton>
                      </form>
                    </ListItem>
                  )
                } else {
                  return (
                    <ListItem disablePadding key={user_id}>
                      {vote.author_id} = &gt; {vote.vote}
                    </ListItem>
                  )
                }
              } else if (currentItem.state === 'REVEAL') {
                return (
                  <ListItem disablePadding key={user_id}>
                    {vote.author_id} = &gt; {vote.vote}
                  </ListItem>
                )
              } else {
                return (
                  <ListItem disablePadding key={user_id}>
                    {vote.member} = &gt; <Trans>item.suspence</Trans>
                  </ListItem>
                )  
              }
            })
          }
        </List>
        {formVote}
      </div>
    }
    
  } else {
    return <p></p>
  }
}