import * as React from 'react';
import InputIcon from '@mui/icons-material/Input';
import { Button, List, ListItem } from '@mui/material';
import { useQuery, useSubscription } from "@apollo/client";

import { GQL } from '@src/common/gql';
import { Item } from '@component/Item';
import { CreateItem } from '@component/CreateItem';
import { JoinGame } from '@src/component/JoinGame';
import { ContextStore, contextStore } from '@src/component/ContextStore';
import { Trans } from 'react-i18next';

export const Game = () => {
  const context:ContextStore = contextStore();

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

    console.log('context.id', context.id)
    console.log('data.game.members', data.game.members)

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
      <div>
        <div className='title'>
          {data.game.name}
        </div>
        <JoinGame 
          game={data.game} 
        />
        {formCreateItem}
        <p>
          <u><Trans>game.items</Trans></u>
        </p>
        <List>
          {data.game.items.map((item: any) => (
            <ListItem disablePadding key={item.id}>
              <div style={{
                margin: "5px 0"
              }}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<InputIcon />}
                  disabled={(context.item_id === item.id)}
                  onClick={(e) => {
                    contextStore.setState({ item_id: item.id });
                  }}
                >{item.name}</Button>
              </div>
            </ListItem>
          ))}
        </List>
        {item}
      </div>
    );
  } else {
    return <Trans>game.choose</Trans>
  }
}