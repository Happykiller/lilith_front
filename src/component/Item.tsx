import * as React from 'react';
import { useMutation } from "@apollo/client";
import { Trans, useTranslation } from 'react-i18next';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { RestartAlt, Visibility } from '@mui/icons-material';
import { Button, Chip, Divider, Grid, IconButton, Link, Tooltip, Typography } from '@mui/material';

import '@component/item.scss';
import { GQL } from '@src/common/gql';
import { CreateVote } from '@component/CreateVote';
import { ContextStore, contextStore } from '@component/ContextStore';

export const Item = (param: {
  game: any
}) => {
  const { t } = useTranslation();
  const context:ContextStore = contextStore();
  const [resetSmt, stateResetSmt] = useMutation(GQL.MUT_RESET);
  const [revealSmt, stateRevealSmt] = useMutation(GQL.MUT_REVEAL);

  const Vote = (props: { args: any }) => {

    let content = <div></div>;

    if(props.args.state === 'NO_VOTED_AND_NOT_REVEAL') {
      content = (
        <div className="card">
          <div className="rank">?</div>
          <div className="suit"><Typography noWrap>{props.args.user.code}</Typography></div>
        </div>
      )
    } else if(props.args.state === 'VOTED_AND_REVEAL') {
      content = (
        <div className="card">
          <div className={`rank ${(props.args.winner===props.args.vote.vote)?'winner':''}`}>{props.args.vote.vote}</div>
          <div className="suit"><Typography noWrap>{props.args.vote.author.code}</Typography></div>
        </div>
      )
    } else if(props.args.state === 'VOTED_AND_NOT_REVEAL') {
      content = (
        <div className="card">
          <div className="rank">:D</div>
          <div className="suit"><Typography noWrap>{props.args.vote.author.code}</Typography></div>
        </div>
      )
    } else if(props.args.state === 'VOTED') {
      content = (
        <div className="card">
          <div className="rank">{props.args.vote.vote}</div>
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
                resetSmt({ 
                  variables: { 
                    game_id: context.game_id,
                    item_id: context.item_id,
                    vote_id: props.args.vote.id
                  } 
                });
              }}>
              <RestartAlt/>
            </IconButton>
          </div>
        </div>
      )
    } else if(props.args.state === 'HAVE_TO_VOTE') {
      content = (
        <CreateVote game={param.game}/>
      )
    }

    return (
      <Grid
        item
        xs={3}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {content}
      </Grid>
    )
  }

  if (context.item_id) {
    const currentItem = param.game.items.find((item:any) => item.id === context.item_id);

    if (currentItem) {
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
        revealBt = <Grid
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginTop={1}
        >
          <Button 
            variant="contained"
            size="small"
            startIcon={<Visibility />}
            onClick={e => { 
              e.preventDefault();
              revealSmt({ variables: { 
                game_id: context.game_id,
                item_id: context.item_id
              } });
            }}
          ><Trans>item.reveal</Trans></Button>
        </Grid>
      } else {
        revealBt = <p></p>
      }

      /**
       * Cal stat
       */
      let winner:string = null;
      if (currentItem.state === 'REVEAL') {
        let choosen:any = {};
        for (const vote of currentItem.votes) {
          if(!choosen[vote.vote]){
            choosen[vote.vote] = 1;
          } else {
            choosen[vote.vote]++;
          }
        }
        let max = 0;
        Object.keys(choosen).forEach((k) => {
          if (choosen[k] > max) {
            winner = k;
            max = choosen[k];
          }
        });
      }

      let openBt = <></>;
      if (currentItem.url){
        openBt = (
          <IconButton 
            title={currentItem.url}
            onClick={(e) => {
              e.preventDefault();
              window.open(currentItem.url, '_blank');
            }
          }>
            <OpenInNewIcon />
          </IconButton>
        )
      }

      return <div>
        <Divider>
          <Tooltip title={
            <>
              Autheur: {currentItem.author.code}<br/>
              {currentItem.description?`Description: ${currentItem.description}`:''}
            </>
          }>
            <Chip 
              label={currentItem.name}
            />
          </Tooltip>
          {openBt}
        </Divider>
        {revealBt}
        <Grid
          container
        >
          {
            /**
             * View all member of game
             */
            param.game.members_obj.map((user: any) => {
              const vote = currentItem.votes.find((vote:any) => vote.author_id === user.id);
              if (currentItem.state !== 'REVEAL') {
                if (!vote && user.id === context.id) {
                  return (
                    <Vote key={user.id} args={{
                      user: user,
                      state: 'HAVE_TO_VOTE'
                    }}/>
                  )
                } else if (vote && vote.author_id === context.id) {
                  return (
                    <Vote key={user.id} args={{
                      vote: vote,
                      state: 'VOTED'
                    }}/>
                  )
                } else if(vote) {
                  return (
                    <Vote key={vote.author.id} args={{
                      vote: vote,
                      state: 'VOTED_AND_NOT_REVEAL'
                    }}/>
                  )
                } else { // !vote 
                  return (
                    <Vote key={user.id} args={{
                      user: user,
                      state: 'NO_VOTED_AND_NOT_REVEAL'
                    }}/>
                  )
                }
              } else {
                // REVEAL
                if (vote) {
                  return (
                    <Vote key={vote.author.id} args={{
                      vote: vote,
                      state: 'VOTED_AND_REVEAL',
                      winner
                    }}/>
                  )
                } else {
                  <Vote key={user.id} args={{
                    user: user,
                    state: 'NO_VOTED_AND_REVEAL',
                    winner
                  }}/>
                }
              }
            })
          }
        </Grid>
      </div>
    }
    
  } else {
    return <p></p>
  }
}