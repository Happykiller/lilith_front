import * as React from 'react';
import { useMutation } from "@apollo/client";
import { Trans, useTranslation } from 'react-i18next';
import { Add, RestartAlt, Visibility } from '@mui/icons-material';
import { Button, IconButton, List, ListItem } from '@mui/material';

import { GQL } from '@src/common/gql';
import { CreateVote } from '@component/CreateVote';
import { ContextStore, contextStore } from '@component/ContextStore';

export const Item = (param: {
  game: any
}) => {
  const context:ContextStore = contextStore();
  const [resetSmt, stateResetSmt] = useMutation(GQL.MUT_RESET);
  const [revealSmt, stateRevealSmt] = useMutation(GQL.MUT_REVEAL);

  if (context.item_id) {
    const { t } = useTranslation();
    const currentItem = param.game.items.find((item:any) => item.id === context.item_id);

    if (currentItem) {

      /**
       * Voting possible
       * If not reveal and not vote already
       */
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

      /**
       * Reveal possible
       * If not reveal and author of the item
       */
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
          <u><Trans>item.item</Trans></u>{currentItem.name} (<Trans>item.author</Trans>{currentItem.author.code})
        </p>
        {revealBt}
        <List>
          {
            /**
             * View all member of game
             */
            param.game.members_obj.map((user: any) => {
              const vote = currentItem.votes.find((vote:any) => vote.author_id === user.id);
              if (!vote) {
                /**
                 * If the user no vote yet and item not reveal show him 
                 */
                if (currentItem.state !== 'REVEAL') {
                  return (
                    <ListItem disablePadding key={user.id}>
                      {user.code} = &gt; ?
                    </ListItem>
                  )
                } else {
                  return
                }
              } else if (vote.author_id === context.id) {
                /**
                 * If the user has vote and item not reveal show his vote active
                 */
                if (currentItem.state !== 'REVEAL') {
                  return (
                    <ListItem disablePadding key={user.id}>
                      {vote.author.code} = &gt; {vote.vote} <form
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
                /**
                 * If the user has vote and item reveal show his vote inactive
                 */
                } else {
                  return (
                    <ListItem disablePadding key={vote.author.id}>
                      {vote.author.code} = &gt; {vote.vote}
                    </ListItem>
                  )
                }
              /**
               * If not his vote and item is reveal
               */
              } else if (currentItem.state === 'REVEAL') {
                return (
                  <ListItem disablePadding key={vote.author.id}>
                    {vote.author.code} = &gt; {vote.vote}
                  </ListItem>
                )
              /**
               * If not his vote and item is not reveal
               */
              } else {
                return (
                  <ListItem disablePadding key={vote.author.id}>
                    {vote.author.code} = &gt; <Trans>item.suspence</Trans>
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