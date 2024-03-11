import * as React from 'react';
import InputIcon from '@mui/icons-material/Input';
import { Trans, useTranslation } from 'react-i18next';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useQuery, useSubscription } from "@apollo/client";
import { Avatar, AvatarGroup, Button, Chip, Divider, Grid, IconButton, Tooltip } from '@mui/material';

import { GQL } from '@src/common/gql';
import { Item } from '@component/Item';
import { CreateItem } from '@component/CreateItem';
import { ContextStore, contextStore } from '@component/ContextStore';

export const Game = () => {
  const { t } = useTranslation();
  const context:ContextStore = contextStore();
  
  function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase(),
      },
      children: name.substring(0,3),
    };
  }

  if (context.game_id) {

    const respQry:{ loading:any, error?:any, data:any } = useQuery(GQL.QRY_GAME, {
      variables: {
        game_id: context.game_id
      },
    });

    const respSub:{loading:any, error?:any, data?:any } = useSubscription(
      GQL.SUB_GAME,
      { 
        variables: {
          game_id: context.game_id
        },
        skip: respQry.loading || respQry.error
      }
    );

    if (respQry.loading && respSub.loading) return <p>Loading...</p>;
    if (respQry.error) return <p>RespQry Error! {respQry.error.message}</p>;
    if (respSub.error) return <p>RespSub Error! {respSub.error.message}</p>;
    if (!respQry.data && !respSub.data) return <p>Nothing</p>;

    const data = {
      game: respQry.data?.game || respSub.data?.subToGame
    }

    let formCreateItem;
    if (
      context.id
      && data.game.members.includes(context.id)
    ) {
      formCreateItem = <CreateItem />
    } else {
      formCreateItem = <p></p>
    }

    let item = <p/>;
    if (data.game && context.item_id ){
      item = <Item
        game={data.game}
      />
    }

    return (
      <Grid
        minWidth={600}
      >
        <div className='play'>
          <h1 title={t('game.author')+data.game.author.code}>{data.game.name}</h1>
        </div>
        <Grid
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginBottom={2}
        >
          <AvatarGroup max={10}>
            {data.game.members_obj.map((member:any) => {
              return (
                <Avatar {...stringAvatar(member.code)} title={member.code} key={member.id}/>
              )
            })}
          </AvatarGroup>
        </Grid>
        <Grid
          marginBottom={1}
        >
          {formCreateItem}
        </Grid>
        <Divider>
          <Chip label={<Trans>game.items</Trans>} />
        </Divider>
        <Grid
          container
          padding={1}
        >
          {data.game.items.map((item: any) => (
            <Grid 
              item 
              xs={4}
              display="flex"
              justifyContent="center"
              alignItems="center"
              key={item.id}
            >
              <Tooltip title={
                <>
                  Autheur: {item.author.code}<br/>
                  {item.description?`Description: ${item.description}`:''}
                </>
              }>
                <span><Button
                  variant="contained"
                  size="small"
                  startIcon={<InputIcon />}
                  disabled={(context.item_id === item.id)}
                  onClick={(e) => {
                    contextStore.setState({ item_id: item.id });
                  }}
                >{item.name}</Button></span>
              </Tooltip>
              {/* Open  */}
              <Grid
                display={(item.url)?'block':'none'}
              >
                <IconButton 
                  title={item.url}
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(item.url, '_blank');
                  }
                }>
                  <OpenInNewIcon />
                </IconButton>
              </Grid>
              {(item.state === 'REVEAL')?' Fini':''}
            </Grid>
          ))}
        </Grid>
        {item}
      </Grid>
    );
  } else {
    return <Trans>game.choose</Trans>
  }
}