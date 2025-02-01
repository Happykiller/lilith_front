import { Trans } from "react-i18next";
import { Add } from "@mui/icons-material";
import { useMutation } from "@apollo/client";
import { useState, useCallback, useMemo } from "react";
import { Box, Button, MenuItem, Select, SelectChangeEvent, TextField, CircularProgress, Alert } from "@mui/material";

import { GQL } from "@src/common/gql";

export const FormGame = () => {
  const enumList = useMemo(() => [
    ["XXS", "XS", "S", "M", "L", "XL", "XXL", "?", "coffee"],
    ["1", "3", "5", "8", "13", "21", "24", "34", "55", "89", "?", "coffee"],
    ["0.5", "1", "2", "3", "5", "8", "13", "20", "40", "100", "?", "coffee"],
    ["1", "2", "4", "8", "16", "32", "64", "?", "coffee"],
    ["1", "2", "3", "4", "5", "6", "7", "8", "10", "13"]
  ], []);

  const [name, setName] = useState("");
  const [voting, setVoting] = useState("0");

  const [createGame, { loading, error }] = useMutation(GQL.MUT_CREATE_GAME);

  const handleChange = useCallback((event: SelectChangeEvent) => {
    setVoting(event.target.value);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      createGame({ variables: { name, voting: enumList[parseInt(voting)] } });
      setName("");
    },
    [name, voting, createGame, enumList]
  );

  return (
    <div>
      {error && <Alert severity="error">{error.message}</Alert>}

      <form className="formCreateGame" onSubmit={handleSubmit}>
        <Box display="flex" alignItems="center" flexDirection="column" gap={2}>
          <TextField
            label={<Trans>formGame.game.label</Trans>}
            variant="standard"
            size="small"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Select value={voting} onChange={handleChange} fullWidth>
            {enumList.map((option, index) => (
              <MenuItem key={index} value={index.toString()}>
                {option.join(", ")}
              </MenuItem>
            ))}
          </Select>
          <Button type="submit" variant="contained" size="small" disabled={name.length <= 3 || loading} startIcon={<Add />}>
            {loading ? <CircularProgress size={20} /> : <Trans>common.create</Trans>}
          </Button>
        </Box>
      </form>
    </div>
  );
};
