// src/component/Item.tsx
import { useMemo, useCallback } from "react";
import { useMutation } from "@apollo/client";
import { Trans, useTranslation } from "react-i18next";
import { OpenInNew as OpenInNewIcon, Visibility } from "@mui/icons-material";
import { Button, Chip, Divider, Grid2, IconButton, Tooltip } from "@mui/material";

import '@component/item.scss';
import { GQL } from "@src/common/gql";
import { Vote } from '@component/Vote';
import { contextStore } from "@component/ContextStore";

export const Item = ({ game }: { game: any }) => {
  const { t } = useTranslation();
  const context = contextStore();
  const [resetVote] = useMutation(GQL.MUT_RESET);
  const [revealItem] = useMutation(GQL.MUT_REVEAL);

  const currentItem = useMemo(() => game.items.find((item: any) => item.id === context.item_id), [game, context.item_id]);

  const handleReveal = useCallback(() => {
    if (context.game_id && context.item_id) {
      revealItem({ variables: { game_id: context.game_id, item_id: context.item_id } });
    }
  }, [context.game_id, context.item_id, revealItem]);

  const handleVoteReset = useCallback((voteId: string) => {
    if (context.game_id && context.item_id) {
      resetVote({ variables: { game_id: context.game_id, item_id: context.item_id, vote_id: voteId } });
    }
  }, [context.game_id, context.item_id, resetVote]);

  const winnerVote = useMemo(() => {
    if (currentItem?.state === "REVEAL") {
      const voteCounts = currentItem.votes.reduce((acc: Record<string, number>, { vote }: any) => {
        acc[vote] = (acc[vote] || 0) + 1;
        return acc;
      }, {});

      return Object.keys(voteCounts).reduce((maxVote, vote) => (voteCounts[vote] > (voteCounts[maxVote] || 0) ? vote : maxVote), "");
    }
    return null;
  }, [currentItem]);

  if (!currentItem) return null;

  return (
    <div>
      <Divider>
        <Tooltip
          title={
            <>
              <strong>{t("item.name")}: </strong> {currentItem.name} <br />
              <strong>{t("item.author")}: </strong> {currentItem.author.code} <br />
              <strong>{t("item.status")}: </strong> {currentItem.state} <br />
              {currentItem.description && <strong>{t("item.description")}: </strong>}{currentItem.description}
            </>
          }
        >
          <Chip label={currentItem.name} />
        </Tooltip>
        {currentItem.url && (
          <IconButton title={currentItem.url} onClick={() => window.open(currentItem.url, "_blank")}>
            <OpenInNewIcon />
          </IconButton>
        )}
      </Divider>

      {currentItem.state !== "REVEAL" && game.members.includes(context.id) && context.id === currentItem.author_id && (
        <Grid2 display="flex" justifyContent="center" alignItems="center" marginTop={1}>
          <Button variant="contained" size="small" startIcon={<Visibility />} onClick={handleReveal}>
            <Trans>item.reveal</Trans>
          </Button>
        </Grid2>
      )}

      <Grid2 container>
        {game.members_obj.map((user: any) => {
          const vote = currentItem.votes.find((v: any) => v.author_id === user.id);
          let state = "NO_VOTED_AND_NOT_REVEAL";

          if (currentItem.state !== "REVEAL") {
            if (!vote && user.id === context.id) {
              state = "HAVE_TO_VOTE";
            } else if (vote && vote.author_id === context.id) {
              state = "VOTED";
            } else if (vote) {
              state = "VOTED_AND_NOT_REVEAL";
            }
          } else if (vote) {
            state = "VOTED_AND_REVEAL";
          } else {
            state = "NO_VOTED_AND_REVEAL";
          }

          return <Vote key={user.id} state={state} vote={vote} user={user} winner={winnerVote} game={game} onResetVote={handleVoteReset} />;
        })}
      </Grid2>
    </div>
  );
};