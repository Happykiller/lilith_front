// src/component/Games.tsx
import { useNavigate } from "react-router-dom";
import { Trans, useTranslation } from 'react-i18next';
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useCallback, useState } from "react";
import { Button, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { Input as InputIcon, ContentCopy, Logout as LogoutIcon } from '@mui/icons-material';

import { GQL } from '@src/common/gql';
import { useFlashStore } from '@component/Flash';
import { contextStore } from '@component/ContextStore';

interface GameModel {
  id: string | null;
  name: string | null;
}

export const Games = () => {
  const { loading, error, data, subscribeToMore } = useQuery(GQL.QRY_GAMES);
  const [leaveGame] = useMutation(GQL.MUT_LEAVE_GAME);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const flash = useFlashStore();

  const [games, setGames] = useState<GameModel[]>([]);

  useEffect(() => {
    if (data?.games) {
      setGames([...data.games].sort((a, b) => (a.id && b.id ? a.id.localeCompare(b.id) : 0)));
    }
  }, [data]);

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: GQL.SUB_GAMES,
      updateQuery: (_, { subscriptionData }) => {
        if (!subscriptionData.data) return;
        setGames([...subscriptionData.data.subToGames].sort((a, b) => (a.id && b.id ? a.id.localeCompare(b.id) : 0)));
      },
    });
    return () => unsubscribe();
  }, [subscribeToMore]);

  const handleJoinGame = useCallback((id: string | null) => {
    if (!id) return;
    contextStore.setState({ game_id: id, item_id: null, current_vote: null });
    navigate("/play");
  }, [navigate]);

  const handleLeaveGame = useCallback((id: string | null) => {
    if (!id) return;
    leaveGame({ variables: { game_id: id } });
    flash.open(t('games.leaved'));
  }, [leaveGame, flash, t]);

  const handleCopyGameId = useCallback((id: string | null) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    flash.open(t('games.copied'));
  }, [flash, t]);

  if (loading) return <Trans>common.loading</Trans>;
  if (error) return <div><Trans>common.error</Trans> {error.message}</div>;
  if (!games.length) return <Trans>common.nothing</Trans>;

  return (
    <div>
      <Table size="small" aria-label="a dense table">
        <TableBody>
          {games.map((row) => (
            <TableRow key={row.id ?? row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                <h3>{row.name}</h3>
              </TableCell>
              <TableCell component="th" scope="row">
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<InputIcon />}
                  onClick={() => handleJoinGame(row.id)}
                >
                  <Trans>games.join</Trans>
                </Button>
              </TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<LogoutIcon />}
                  onClick={() => handleLeaveGame(row.id)}
                >
                  <Trans>games.leave</Trans>
                </Button>
              </TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<ContentCopy />}
                  onClick={() => handleCopyGameId(row.id)}
                >
                  <Trans>games.copy</Trans>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
