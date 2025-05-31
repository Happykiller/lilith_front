// src\components\molecules\CreateItem.tsx
import { useMutation } from "@apollo/client";
import { useTranslation, Trans } from "react-i18next";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import {
  Add,
  KeyboardArrowUp,
  KeyboardArrowDown,
  Link as LinkIcon,
  Description as DescriptionIcon,
  DriveFileRenameOutline as NameIcon,
} from "@mui/icons-material";
import {
  Grid2,
  Button,
  Collapse,
  Divider,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';

import { GQL } from "@src/common/gql";
import { contextStore } from "@stores/ContextStore";
import { useFlashStore, Input } from "@happykiller/sunny-ui";

export const CreateItem = () => {
  const { t } = useTranslation();
  const flash = useFlashStore();
  const context = contextStore();

  const [formVisible, setFormVisible] = useState(false);
  const [item, setItem] = useState({ name: "", url: "", description: "" });

  const [createItem, { loading, error }] = useMutation(GQL.MUT_CREATE_ITEM, {
    onCompleted: () => {
      flash.open(t("createItem.created"));
      setItem({ name: "", url: "", description: "" });
      setFormVisible(false);
    },
    errorPolicy: "all",
  });

  const toggleForm = useCallback(() => {
    setFormVisible((prev) => !prev);
  }, []);

  const handleChange = useCallback(
    (field: keyof typeof item, value: string) => {
      setItem((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      createItem({ variables: { ...item, game_id: context.game_id } });
    },
    [item, context.game_id, createItem]
  );

  const isDisabled = useMemo(
    () => item.name.trim().length < 4 || !context.id,
    [item.name, context.id]
  );

  return (
    <Box>
      <Divider sx={{ mb: 2 }}>
        <Chip label={<Trans>createItem.title</Trans>} />
        <IconButton onClick={toggleForm} size="small">
          {formVisible ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      </Divider>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
        </Alert>
      )}

      <Collapse in={formVisible}>
        <form onSubmit={handleSubmit}>
          <Grid2 container spacing={2} p={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Input
                label={<Trans>createItem.label</Trans>}
                tooltip={t("createItem.label_tooltip")}
                entity={{ value: item.name, valid: item.name.length > 3 }}
                onChange={(e) => handleChange("name", e.value)}
                regex=".{4,}"
                require
                virgin
                startIcon={<NameIcon />}
                fullWidth
                icons={{
                  help: <InfoIcon fontSize="small" />,
                }}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Input
                label={<Trans>createItem.url</Trans>}
                placeholder="https://..."
                tooltip={t("createItem.url_tooltip")}
                entity={{ value: item.url, valid: true }}
                onChange={(e) => handleChange("url", e.value)}
                startIcon={<LinkIcon />}
                fullWidth
                icons={{
                  help: <InfoIcon fontSize="small" />,
                }}
              />
            </Grid2>

            <Grid2 size={12}>
              <Input
                label={<Trans>createItem.description</Trans>}
                tooltip={t("createItem.description_tooltip")}
                entity={{ value: item.description, valid: true }}
                onChange={(e) => handleChange("description", e.value)}
                startIcon={<DescriptionIcon />}
                fullWidth
                multiline
                minRows={3}
                icons={{
                  help: <InfoIcon fontSize="small" />,
                }}
              />
            </Grid2>

            <Grid2 size={12} textAlign="center">
              <Button
                type="submit"
                variant="contained"
                size="small"
                startIcon={<Add />}
                disabled={isDisabled || loading}
              >
                {loading ? <CircularProgress size={20} /> : <Trans>common.create</Trans>}
              </Button>
            </Grid2>
          </Grid2>
        </form>
      </Collapse>
    </Box>
  );
};
