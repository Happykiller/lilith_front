// src/components/molecules/JoinGame.tsx
import { Trans, useTranslation } from "react-i18next";
import { useState, useCallback, useEffect, FormEvent } from "react";
import { useMutation } from "@apollo/client";
import {
  Input as InputIcon,
  HelpOutline as HelpIcon
} from "@mui/icons-material";
import {
  Box,
  Button,
  Alert,
  Typography
} from "@mui/material";
import KeyIcon from '@mui/icons-material/Key';
import { Input, useFlashStore } from "@happykiller/sunny-ui";

import { GQL } from "@src/common/gql";
import { contextStore } from "@src/stores/ContextStore";

export const JoinGame = () => {
  const flash = useFlashStore();
  const { t } = useTranslation();
  const context = contextStore();

  const [gameId, setGameId] = useState({ value: "", valid: false });

  const [joinGame, { data, loading, error }] = useMutation(GQL.MUT_JOIN_GAME, {
    onCompleted: () => {
      flash.open(t('joinGame.success'));
    },
    onError: (err) => {
      flash.open(err.message);
    },
  });

  useEffect(() => {
    if (data) setGameId({ value: "", valid: false });
  }, [data]);

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    joinGame({ variables: { game_id: gameId.value } });
  }, [joinGame, gameId]);

  if (!context.id) {
    return (
      <Typography variant="body2" color="text.secondary">
        <Trans>joinGame.log</Trans>
      </Typography>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
        <Input
          label={<Trans>joinGame.game.id</Trans>}
          tooltip="24-character MongoDB Game ID"
          regex="^[a-fA-F0-9]{24}$"
          entity={gameId}
          onChange={setGameId}
          require
          virgin
          fullWidth
          startIcon={<KeyIcon />}
          icons={{
            help: <HelpIcon fontSize="small" />,
          }}
        />

        <Button
          type="submit"
          variant="contained"
          size="small"
          startIcon={<InputIcon />}
          disabled={!gameId.valid || loading}
        >
          <Trans>joinGame.join</Trans>
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error.message}
        </Alert>
      )}
    </form>
  );
};
