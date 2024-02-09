import * as React from 'react';
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import InputIcon from '@mui/icons-material/Input';
import { Button, List, ListItem } from '@mui/material';

import { GQL } from '@src/common/gql';
import { contextStore } from '@src/component/ContextStore';

export const Games = () => {
  const { loading, error, data, subscribeToMore } = useQuery(GQL.QRY_GAMES);
  const navigate = useNavigate();

  subscribeToMore({
    document: GQL.SUB_GAMES,
    updateQuery: (prev:any, { subscriptionData }:any) => {
      if (!subscriptionData.data) return prev;
      const games = subscriptionData.data.subToGames;
      return {
        games: games,
      };
    },
  });

  if (loading) return <p>"Loading...";</p>;
  if (error) return <p>`Error! ${error.message}`</p>;
  if (!data) return <p>Nothing</p>;

  return (
    <div>
      <List>
        {data.games.map((game: any) => (
          <ListItem disablePadding key={game.id}>
            <div style={{
              margin: "5px 0"
            }}>
              <Button
                variant="contained"
                size="small"
                startIcon={<InputIcon />}
                onClick={(e) => {
                  contextStore.setState({ game_id: game.id, item_id: null });
                  navigate("/play");
                }}
              >{game.name}</Button>
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
};