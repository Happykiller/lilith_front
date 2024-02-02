import * as React from 'react';
import { useMutation } from "@apollo/client";
import { Add, RestartAlt } from '@mui/icons-material';
import { Button, List, ListItem } from '@mui/material';

import { GQL } from '@src/common/gql';
import { CreateVote } from '@component/CreateVote';
import { ContextStore, contextStore } from '@src/component/ContextStore';

export const Item = (param: {
  session: any
}) => {
  const context:ContextStore = contextStore();
  if (context.itemId) {
    const currentItem = param.session.items.find((item:any) => item.id === context.itemId);

    if (currentItem) {
      const [revealSmt, { data, loading, error }] = useMutation(GQL.MUT_REVEAL);
      const [resetSmt, state] = useMutation(GQL.MUT_RESET);

      let formVote;
      if (
        currentItem
        && context.login
        && currentItem.state !== 'REVEAL'
        && param.session.members.includes(context.login)
        && !currentItem.votes.find((elt:any) => elt.member === context.login)
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
        && param.session.members.includes(context.login)
        && context.login === currentItem.author
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
          startIcon={<Add />}
        >Reveal</Button>
      </form>
      } else {
        revealBt = <p></p>
      }

      return <div>
        <p>
          <u>Item</u> : {currentItem.name} (state:{currentItem.state})
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
              } else if (vote.member === context.login) {
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
                        <Button 
                          type="submit"
                          variant="contained"
                          size="small"
                          startIcon={<RestartAlt />}
                        >Reset</Button>
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
                    {vote.member} =&gt; Suspense
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