// src\components\molecules\GameItemGrid.tsx
import { useCallback } from "react";
import {
  Grid2,
  Button,
  Tooltip,
  IconButton,
  Typography,
  Box,
  useTheme
} from "@mui/material";
import {
  Input as InputIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

import { GameModel } from '@src/types/game';
import { contextStore } from "@stores/ContextStore";

interface GameItemGridProps {
  game: GameModel;
}

export const GameItemGrid = ({ game }: GameItemGridProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const context = contextStore();

  const handleItemClick = useCallback((itemId: string) => {
    contextStore.setState({ item_id: itemId, current_vote: null });
  }, []);

  return (
    <Grid2 container spacing={2}>
      {game.items.map((item) => (
        <Grid2
          key={item.id}
          size={{
            xs: 12,
            sm: 6,
            md: 4
          }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={1}
        >
          <Tooltip
            title={
              <>
                {t("game.item.name")}{item.name} <br />
                {t("game.item.author")}{item.author.code} <br />
                {t("game.item.state")}{item.state} <br />
                {item.description && (
                  <>
                    {t("game.item.description")}{item.description}
                  </>
                )}
              </>
            }
          >

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: 2,
                overflow: "hidden",
                width: "100%",
                backgroundColor: item.state !== "REVEAL"
                  ? theme.palette.background.paper
                  : theme.palette.background.default,
                border: context.item_id !== item.id
                  ? `1px solid ${theme.palette.primary.main}`
                  : "none",
              }}
            >
              <Button
                startIcon={<InputIcon />}
                onClick={() => handleItemClick(item.id)}
                disabled={context.item_id === item.id}
                sx={{
                  flex: 1,
                  borderRadius: 0,
                  textTransform: "none",
                  justifyContent: "flex-start",
                  pl: 2,
                }}
              >
                <Typography noWrap>
                  {item.name.split("]").pop() ?? item.name}
                </Typography>
              </Button>

              {item.url && (
                <Tooltip title={item.url}>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(item.url, "_blank");
                    }}
                    size="small"
                    sx={{
                      borderRadius: 0,
                      minWidth: 40,
                      height: "100%",
                      borderLeft: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

          </Tooltip>

        </Grid2>
      ))}
    </Grid2>
  );
};
