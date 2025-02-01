// src/component/Vote.tsx
import { useTranslation } from "react-i18next";
import { RestartAlt } from "@mui/icons-material";
import { Grid2, IconButton, Typography } from "@mui/material";

import { CreateVote } from "@component/CreateVote";

export const Vote = ({ state, vote, user, winner, game, onResetVote }: any) => {
  const { t } = useTranslation();

  if (state === "HAVE_TO_VOTE") {
    return <Grid2 size={3} display="flex" justifyContent="center" alignItems="center">
      <CreateVote game={game} />
    </Grid2>;
  }

  const cardStyle: any = state === "VOTED_AND_REVEAL" || state === "VOTED" ? {
    backgroundImage: `url(${vote ? `public/${game.voting.indexOf(vote.vote) > 11 ? 11 : game.voting.indexOf(vote.vote)}.png` : ""})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  } : {};

  return (
    <Grid2 size={3} display="flex" justifyContent="center" alignItems="center">
      <div className="card" style={cardStyle}>
        <div className={`rank ${state === "VOTED_AND_REVEAL" && winner === vote?.vote ? "winner" : ""}`}>
          {state === "NO_VOTED_AND_NOT_REVEAL" ? "?" : state === "VOTED_AND_NOT_REVEAL" ? ":D" : vote?.vote}
        </div>
        <div className="suit">
          <Typography noWrap fontWeight="bold" sx={{ backgroundColor: "rgba(255, 255, 255, 0.8)", padding: "3px", borderRadius: "2px" }}>
            {vote?.author?.code || user.code}
          </Typography>
          {state === "VOTED" && (
            <IconButton size="small" title={t("item.reset")} sx={{ color: "#018786", backgroundColor: "#F5EBFF" }} onClick={() => onResetVote(vote.id)}>
              <RestartAlt />
            </IconButton>
          )}
        </div>
      </div>
    </Grid2>
  );
};
