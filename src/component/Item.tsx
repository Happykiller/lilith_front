import * as React from 'react';
import { useMutation } from "@apollo/client";
import { Trans, useTranslation } from 'react-i18next';
import { Add, RestartAlt, Visibility } from '@mui/icons-material';
import { Button, IconButton, List, ListItem } from '@mui/material';

import { GQL } from '@src/common/gql';
import { CreateVote } from '@component/CreateVote';
import { ContextStore, contextStore } from '@src/component/ContextStore';

export const Item = (param: {
  session: any
}) => {
  const context:ContextStore = contextStore();
  if (context.itemId) {
    const { t } = useTranslation();
    const currentItem = param.session.items.find((item:any) => item.id === context.itemId);

    if (currentItem) {
      const [revealSmt, { data, loading, error }] = useMutation(GQL.MUT_REVEAL);
      const [resetSmt, state] = useMutation(GQL.MUT_RESET);

      let formVote;
      if (
        currentItem
        && context.code
        && currentItem.state !== 'REVEAL'
        && param.session.members.includes(context.code)
        && !currentItem.votes.find((elt:any) => elt.member === context.code)
      ) {
        formVote = <CreateVote
        session={param.session}
        />
      } else {
        formVote = <p></p>
      }

      let revealBt;
      if (
        currentItem
        && currentItem.state !== 'REVEAL'
        && param.session.members.includes(context.code)
        && context.code === currentItem.author
      ) {
        revealBt = <form
        onSubmit={e => { 
          e.preventDefault();
          revealSmt({ variables: { 
            sessionId: context.sessionId,
            itemId: context.itemId
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
            param.session.members.map((member: any) => {
              const vote = currentItem.votes.find((vote:any) => vote.member === member);
              if (!vote) {
                if (currentItem.state !== 'REVEAL') {
                  return (
                    <ListItem disablePadding key={member}>
                      {member} =&gt; ?
                    </ListItem>
                  )
                } else {
                  return
                }
              } else if (vote.member === context.code) {
                if (currentItem.state !== 'REVEAL') {
                  return (
                    <ListItem disablePadding key={member}>
                      {vote.member} =&gt; {vote.vote} <form
                        onSubmit={e => { 
                          e.preventDefault();
                          resetSmt({ 
                            variables: { 
                              sessionId: context.sessionId,
                              itemId: context.itemId,
                              voteId: vote.id
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
                    <ListItem disablePadding key={member}>
                      {vote.member} =&gt; {vote.vote}
                    </ListItem>
                  )
                }
              } else if (currentItem.state === 'REVEAL') {
                return (
                  <ListItem disablePadding key={member}>
                    {vote.member} =&gt; {vote.vote}
                  </ListItem>
                )
              } else {
                return (
                  <ListItem disablePadding key={member}>
                    {vote.member} =&gt; <Trans>item.suspence</Trans>
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