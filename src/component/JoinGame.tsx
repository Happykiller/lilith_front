// src\component\JoinGame.tsx
import { Trans } from "react-i18next";
import { useMutation } from "@apollo/client";
import { useState, useCallback, useEffect } from "react";
import { Input as InputIcon } from "@mui/icons-material";
import { Box, Button, TextField, Alert } from "@mui/material";

import { GQL } from "@src/common/gql";
import { contextStore } from "@src/stores/ContextStore";

export const JoinGame = () => {
  const context = contextStore();
  const [gameId, setGameId] = useState("");
  const [joinGame, { data, loading, error }] = useMutation(GQL.MUT_JOIN_GAME);

  useEffect(() => {
    if (data) setGameId("");
  }, [data]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      joinGame({ variables: { game_id: gameId } });
    },
    [joinGame, gameId]
  );

  if (!context.id) return <Trans>joinGame.log</Trans>;

  return (
    <div>
      {loading && <Trans>common.loading</Trans>}
      {error && <Alert severity="error">{error.message}</Alert>}

      <form className="formJoinGame" onSubmit={handleSubmit}>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            label={<Trans>joinGame.game.id</Trans>}
            variant="standard"
            size="small"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            size="small"
            startIcon={<InputIcon />}
            disabled={gameId.length !== 24}
          >
            <Trans>joinGame.join</Trans>
          </Button>
        </Box>
      </form>
    </div>
  );
};
