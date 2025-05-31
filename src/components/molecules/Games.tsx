// src/components/molecules/Games.tsx
import { useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useCallback, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Input as InputIcon,
  ContentCopy,
} from "@mui/icons-material";
import ClearIcon from '@mui/icons-material/Clear';

import { GQL } from "@src/common/gql";
import { contextStore } from "@src/stores/ContextStore";
import { useFlashStore } from "@happykiller/sunny-ui";

interface GameModel {
  id: string | null;
  name: string | null;
}

export const Games = () => {
  const theme = useTheme();
  const flash = useFlashStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [leaveGame] = useMutation(GQL.MUT_LEAVE_GAME);
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const { loading, error, data, subscribeToMore } = useQuery(GQL.QRY_GAMES);

  const [games, setGames] = useState<GameModel[]>([]);

  useEffect(() => {
    if (data?.games) {
      const sorted = [...data.games].sort((a, b) =>
        a.id && b.id ? a.id.localeCompare(b.id) : 0
      );
      setGames(sorted);
    }
  }, [data]);

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: GQL.SUB_GAMES,
      updateQuery: (_, { subscriptionData }) => {
        if (!subscriptionData.data) return;
        const sorted = [...subscriptionData.data.subToGames].sort((a, b) =>
          a.id && b.id ? a.id.localeCompare(b.id) : 0
        );
        setGames(sorted);
      },
    });
    return () => unsubscribe();
  }, [subscribeToMore]);

  const handleJoinGame = useCallback(
    (id: string | null) => {
      if (!id) return;
      contextStore.setState({
        game_id: id,
        item_id: null,
        current_vote: null,
      });
      navigate("/play");
    },
    [navigate]
  );

  const handleLeaveGame = useCallback(
    (id: string | null) => {
      if (!id) return;
      leaveGame({ variables: { game_id: id } });
      flash.open(t("games.leaved"));
    },
    [leaveGame, flash, t]
  );

  const handleCopyGameId = useCallback(
    (id: string | null) => {
      if (!id) return;
      navigator.clipboard.writeText(id);
      flash.open(t("games.copied"));
    },
    [flash, t]
  );

  if (loading)
    return (
      <Typography variant="body2" color="text.secondary">
        <Trans>common.loading</Trans>
      </Typography>
    );

  if (error)
    return (
      <Typography variant="body2" color="error">
        <Trans>common.error</Trans>: {error.message}
      </Typography>
    );

  if (!games.length)
    return (
      <Typography variant="body2" color="text.secondary">
        <Trans>common.nothing</Trans>
      </Typography>
    );

  return (
    <Table size="small" aria-label="games table">
      <TableBody>
        {games.map((row) => (
          <TableRow
            key={row.id ?? row.name}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <TableCell align="center">
              <Tooltip title={t("games.join")}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<InputIcon />}
                  onClick={() => handleJoinGame(row.id)}
                >
                  {row.name}
                </Button>
              </Tooltip>
            </TableCell>

            <TableCell align="center">
              <Tooltip title={t("games.copy")}>
                <Button
                  size="small"
                  color="info"
                  startIcon={<ContentCopy />}
                  onClick={() => handleCopyGameId(row.id)}
                >
                  {!isXs && <Trans>games.copy</Trans>}
                </Button>
              </Tooltip>
            </TableCell>

            <TableCell align="center">
              <Tooltip title={t("games.leave")}>
                <Button
                  size="small"
                  color="warning"
                  startIcon={<ClearIcon />}
                  onClick={() => handleLeaveGame(row.id)}
                >
                  {!isXs && <Trans>games.leave</Trans>}
                </Button>
              </Tooltip>
            </TableCell>

          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
