// src\component\CreateItem.tsx
import { useMutation } from "@apollo/client";
import { Trans, useTranslation } from "react-i18next";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { Add, KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import { Button, Chip, Divider, Grid2, IconButton, TextField, CircularProgress, Alert } from "@mui/material";

import { GQL } from "@src/common/gql";
import { useFlashStore } from "@component/Flash";
import { contextStore } from "@src/component/ContextStore";

export const CreateItem = () => {
  const { t } = useTranslation();
  const flash = useFlashStore();
  const context = contextStore();

  const [formVisible, setFormVisible] = useState(false);
  const [item, setItem] = useState({ name: "", url: "", description: "" });

  const [createItem, { data, loading, error }] = useMutation(GQL.MUT_CREATE_ITEM);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (data && isFirstRender.current) {
      flash.open(t("createItem.created"));
      setItem({ name: "", url: "", description: "" });
      isFirstRender.current = false;
    }
  }, [data, flash, t]);

  const toggleForm = useCallback(() => setFormVisible((prev) => !prev), []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      createItem({ variables: { ...item, game_id: context.game_id } });
    },
    [item, createItem, context.game_id]
  );

  const isDisabled = useMemo(() => !item.name || item.name.length <= 3 || !context.id, [item.name, context.id]);

  return (
    <div>
      <Divider>
        <Chip label={<Trans>createItem.title</Trans>} />
        <IconButton onClick={toggleForm}>
          {formVisible ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      </Divider>

      {error && <Alert severity="error">{error.message}</Alert>}

      <form className="formCreateItem" onSubmit={handleSubmit} style={{ display: formVisible ? "block" : "none" }}>
        <Grid2 container spacing={2} padding={2}>
          <Grid2 size={6}>
            <TextField
              name="name"
              label={<Trans>createItem.label</Trans>}
              variant="standard"
              size="small"
              fullWidth
              value={item.name}
              onChange={handleChange}
            />
          </Grid2>

          <Grid2 size={6}>
            <TextField
              name="url"
              label={<Trans>createItem.url</Trans>}
              variant="standard"
              size="small"
              fullWidth
              value={item.url}
              onChange={handleChange}
            />
          </Grid2>

          <Grid2 size={12}>
            <TextField
              name="description"
              label={<Trans>createItem.description</Trans>}
              variant="standard"
              multiline
              minRows={3}
              fullWidth
              value={item.description}
              onChange={handleChange}
            />
          </Grid2>

          <Grid2 size={12} display="flex" justifyContent="center">
            <Button type="submit" variant="contained" size="small" startIcon={<Add />} disabled={isDisabled}>
              {loading ? <CircularProgress size={20} /> : <Trans>common.create</Trans>}
            </Button>
          </Grid2>
        </Grid2>
      </form>
    </div>
  );
};
