// src\components\molecules\Vote.tsx
import { useTranslation } from "react-i18next";
import { RestartAlt } from "@mui/icons-material";
import { Grid2, IconButton, Paper, useTheme } from "@mui/material";

import { CreateVote } from "@components/molecules/CreateVote";

export const Vote = ({ state, vote, user, winner, game, onResetVote }: any) => {
  const theme = useTheme();
  const { t } = useTranslation();

  if (state === "HAVE_TO_VOTE") {
    return <Grid2 size={3} display="flex" justifyContent="center" alignItems="center">
      <CreateVote game={game} />
    </Grid2>;
  }

  const cardStyle: any = state === "VOTED_AND_REVEAL" || state === "VOTED" ? {
    backgroundImage: `url(${vote ? `${game.voting.indexOf(vote.vote) > 11 ? 11 : game.voting.indexOf(vote.vote)}.png` : ""})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  } : {};

  return (
    <Grid2 size={3} display="flex" justifyContent="center" alignItems="center">
      <Paper
        className="card"
        sx={{
          borderRadius: `${theme.shape.borderRadius}px`,
          boxShadow: `0 0 32px 0 ${theme.palette.primary.main}55`,
          border: `2px solid ${theme.palette.primary.main}`
        }}
        style={cardStyle}
      >
        <div className={`rank ${state === "VOTED_AND_REVEAL" && winner === vote?.vote ? "winner" : ""}`}>
          {state === "NO_VOTED_AND_NOT_REVEAL" ? "?" : state === "VOTED_AND_NOT_REVEAL" ? ":D" : vote?.vote}
        </div>
        <div className="suit">
          <div className="user-badge">
            {vote?.author?.code || user.code}
          </div>
          {state === "VOTED" && (
            <IconButton
              size="small"
              title={t("item.reset")}
              sx={{ color: theme.palette.primary.main, backgroundColor: theme.palette.background.paper }}
              onClick={() => onResetVote(vote.id)}
            >
              <RestartAlt />
            </IconButton>
          )}
        </div>
      </Paper>
    </Grid2>
  );
};
