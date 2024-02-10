import * as React from 'react';
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import InputIcon from '@mui/icons-material/Input';
import { Trans, useTranslation } from 'react-i18next';
import { Button, Table, TableBody, TableCell, TableRow } from '@mui/material';

import { GQL } from '@src/common/gql';
import { contextStore } from '@src/component/ContextStore';
import { ContentCopy } from '@mui/icons-material';
import { FlashStore, flashStore } from './Flash';

export const Games = () => {
  const { loading, error, data, subscribeToMore } = useQuery(GQL.QRY_GAMES);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const flash:FlashStore = flashStore();

  interface GameModel {
    id: string
    name: string
  };

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

  if (loading) return <Trans>common.loading</Trans>;
  if (error) return <div><Trans>common.error</Trans><Trans>{error.message}</Trans></div>;
  if (!data) return <Trans>common.nothing</Trans>

  return (
    <div>
      <Table size="small" aria-label="a dense table">
        <TableBody>
          {data.games.map((row:GameModel) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <h3>{row.name}</h3>
              </TableCell>
              <TableCell component="th" scope="row">
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<InputIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    contextStore.setState({ game_id: row.id, item_id: null });
                    navigate("/play");
                  }}
                ><Trans>games.join</Trans></Button>
              </TableCell>
              <TableCell align="right">
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<ContentCopy />}
                    onClick={(e) => {
                      e.stopPropagation();
                      flash.open(t('games.copied'));
                      navigator.clipboard.writeText(row.id);
                    }}
                  ><Trans>games.copy</Trans></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};