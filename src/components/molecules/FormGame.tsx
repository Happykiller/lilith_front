// src/components/molecules/FormGame.tsx
import { useMutation } from "@apollo/client";
import { Trans, useTranslation } from "react-i18next";
import { useState, useCallback, useMemo } from "react";
import {
  Add,
  HelpOutline as HelpIcon
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme
} from "@mui/material";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

import { GQL } from "@src/common/gql";
import { Input, useFlashStore } from "@happykiller/sunny-ui";

export const FormGame = () => {
  const theme = useTheme();
  const flash = useFlashStore();
  const { t } = useTranslation();

  const enumList = useMemo(
    () => [
      ["XXS", "XS", "S", "M", "L", "XL", "XXL", "?", "coffee"],
      ["1", "3", "5", "8", "13", "21", "24", "34", "55", "89", "?", "coffee"],
      ["0.5", "1", "2", "3", "5", "8", "13", "20", "40", "100", "?", "coffee"],
      ["1", "2", "4", "8", "16", "32", "64", "?", "coffee"],
      ["1", "2", "3", "4", "5", "6", "7", "8", "10", "13"]
    ],
    []
  );

  const [name, setName] = useState({ value: "", valid: false });
  const [voting, setVoting] = useState("0");

  const [createGame, { loading, error }] = useMutation(GQL.MUT_CREATE_GAME, {
    onCompleted: () => {
      flash.success(t('formGame.success'));
      setName({ value: "", valid: false });
    },
    onError: (err) => {
      flash.open(err.message);
    }
  });

  const handleChange = useCallback((event: SelectChangeEvent) => {
    setVoting(event.target.value);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      createGame({
        variables: {
          name: name.value,
          voting: enumList[parseInt(voting)],
        },
      });
    },
    [name.value, voting, createGame, enumList]
  );

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Input
          startIcon={<DriveFileRenameOutlineIcon />}
          label={<Trans>formGame.game.label</Trans>}
          tooltip={<Trans>formGame.game.tooltip</Trans>}
          regex=".{4,}"
          entity={name}
          onChange={setName}
          require
          virgin
          fullWidth
          icons={{
            help: <HelpIcon fontSize="small" />,
          }}
        />

        <FormControl fullWidth size="small">
          <InputLabel id="voting-select-label">
            <Trans>formGame.voting.label</Trans>
          </InputLabel>
          <Select
            labelId="voting-select-label"
            value={voting}
            onChange={handleChange}
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: theme.shape.borderRadius,
            }}
          >
            {enumList.map((option, index) => (
              <MenuItem key={index} value={index.toString()}>
                {option.join(", ")}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box textAlign="center">
          <Button
            type="submit"
            variant="contained"
            startIcon={<Add />}
            size="small"
            disabled={!name.valid || loading}
          >
            {loading ? <CircularProgress size={20} /> : <Trans>common.create</Trans>}
          </Button>
        </Box>

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error.message}
          </Typography>
        )}
      </Box>
    </form>
  );
};
