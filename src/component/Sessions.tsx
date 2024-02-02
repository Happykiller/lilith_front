import * as React from 'react';
import { useQuery } from "@apollo/client";
import InputIcon from '@mui/icons-material/Input';
import { Button, List, ListItem } from '@mui/material';

import { GQL } from '@src/common/gql';
import { contextStore } from '@src/component/ContextStore';

export const Sessions = () => {
  const {sessionId} = contextStore();
  const { loading, error, data, subscribeToMore } = useQuery(GQL.QRY_SESSIONS);

  subscribeToMore({
    document: GQL.SUB_SESSIONS,
    updateQuery: (prev:any, { subscriptionData }:any) => {
      if (!subscriptionData.data) return prev;
      const sessions = subscriptionData.data.subToSessions;
      return {
        sessions: sessions,
      };
    },
  });

  if (loading) return <p>"Loading...";</p>;
  if (error) return <p>`Error! ${error.message}`</p>;
  if (!data) return <p>Nothing</p>;

  return (
    <div>
      <List>
        {data.sessions.map((session: any) => (
          <ListItem disablePadding key={session.id}>
            <div style={{
              margin: "5px 0"
            }}>
              <Button
                variant="contained"
                size="small"
                startIcon={<InputIcon />}
                disabled={(sessionId === session.id)}
                onClick={(e) => {
                  contextStore.setState({ sessionId: session.id });
                }}
              >{session.name}</Button>
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
};