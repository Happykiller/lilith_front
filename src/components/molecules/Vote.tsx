// src\components\molecules\Vote.tsx
import { useTranslation } from "react-i18next";
import { RestartAlt } from "@mui/icons-material";
import { Grid2, IconButton, Paper, useTheme } from "@mui/material";

import { VoteStatus } from "@src/types/vote_status";
import { CreateVote } from "@components/molecules/CreateVote";

export const Vote = ({ state, vote, user, winner, game, onResetVote }: any) => {
  const theme = useTheme();
  const { t } = useTranslation();

  if (state === VoteStatus.HAVE_TO_VOTE) {
    return <Grid2 size={3} display="flex" justifyContent="center" alignItems="center">
      <CreateVote game={game} />
    </Grid2>;
  }

  let cardStyle;
  let img;
  switch (state) {
    case VoteStatus.VOTED:
    case VoteStatus.VOTED_AND_REVEAL:
      img = `${game.voting.indexOf(vote.vote) > 11 ? 11 : game.voting.indexOf(vote.vote)}.png`;
      break;
    case VoteStatus.NO_VOTED_AND_REVEAL:
      img = 'abs.png';
      break;
    case VoteStatus.VOTED_AND_NOT_REVEAL:
      img = 'done.png';
      break;
    default:
      img = 'question.png';
  }

  cardStyle = {
    backgroundImage: `url(${img})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }

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
        {(state === VoteStatus.VOTED || state === VoteStatus.VOTED_AND_REVEAL) && (
          <Paper
            className="rank"
            sx={{
              color:
                state === VoteStatus.VOTED_AND_REVEAL && winner === vote?.vote
                  ? theme.palette.primary.main
                  : theme.palette.secondary.main,
            }}
          >
            {vote?.vote}
          </Paper>
        )}
        <div className="suit">
          <Paper
            className="user-badge"
            sx={{
              color: theme.palette.primary.main,
            }}
          >
            {vote?.author?.code || user.code}
          </Paper>
          {state === "VOTED" && (
            <IconButton
              size="small"
              title={t("item.reset")}
              sx={{
                color: theme.palette.primary.main,
                backgroundColor: theme.palette.background.paper
              }}
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
