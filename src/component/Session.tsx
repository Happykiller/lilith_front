import * as React from 'react';
import InputIcon from '@mui/icons-material/Input';
import { Button, List, ListItem } from '@mui/material';
import { useQuery, useSubscription } from "@apollo/client";

import { GQL } from '@src/common/gql';
import { Item } from '@component/Item';
import { CreateItem } from '@component/CreateItem';
import { JoinSession } from '@component/JoinSession';
import { ContextStore, contextStore } from '@src/component/ContextStore';
import { Trans } from 'react-i18next';

export const Session = () => {
  const context:ContextStore = contextStore();

  if (context.sessionId) {

    const respQry:{ loading:any, error?:any, data:any } = useQuery(GQL.QRY_SESSION, {
      variables: {
        sessionId: context.sessionId
      },
    });

    const respSub:{loading:any, error?:any, data?:any } = useSubscription(
      GQL.SUB_SESSION,
      { 
        variables: {
          sessionId: context.sessionId
        },
        skip: respQry.loading || respQry.error
      }
    );

    if (respQry.loading && respSub.loading) return <p>Loading...</p>;
    if (respQry.error) return <p>RespQry Error! {respQry.error.message}</p>;
    if (respSub.error) return <p>RespSub Error! {respSub.error.message}</p>;
    if (!respQry.data && !respSub.data) return <p>Nothing</p>;

    const data = {
      session: respQry.data?.session || respSub.data?.subToSession
    }

    let formCreateItem;
    if (
      context.login
      && data.session.members.includes(context.login)
    ) {
      formCreateItem = <CreateItem />
    } else {
      formCreateItem = <p></p>
    }

    let item = <p/>;
    if (data.session && context.itemId ){
      item = <Item
        session={data.session}
      />
    }

    return (
      <div>
        <div className='title'>
          {data.session.name}
        </div>
        <JoinSession 
          session={data.session} 
        />
        {formCreateItem}
        <p>
          <u><Trans>session.items</Trans></u>
        </p>
        <List>
          {data.session.items.map((item: any) => (
            <ListItem disablePadding key={item.id}>
              <div style={{
                margin: "5px 0"
              }}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<InputIcon />}
                  disabled={(context.itemId === item.id)}
                  onClick={(e) => {
                    contextStore.setState({ itemId: item.id });
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
    return (
      <div>
        <p>
          Merci de choisir une session
        </p>
      </div>
    );
  }
}