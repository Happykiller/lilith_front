// src/component/Game.tsx
import { Trans, useTranslation } from "react-i18next";
import { useQuery, useSubscription } from "@apollo/client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Input as InputIcon, OpenInNew as OpenInNewIcon } from "@mui/icons-material";
import { Avatar, AvatarGroup, Grid2, Button, Tooltip, IconButton, Typography, Chip, Divider } from "@mui/material";

import { GQL } from "@src/common/gql";
import { Item } from "@component/Item";
import { CreateItem } from "@component/CreateItem";
import { contextStore } from "@src/stores/ContextStore";

interface GameModel {
  id: string;
  name: string;
  author: { code: string };
  members: string[];
  members_obj: { id: string; code: string }[];
  items: { id: string; name: string; author: { code: string }; state: string; description?: string; url?: string }[];
}

export const Game = () => {
  const { t } = useTranslation();
  const context = contextStore();
  const [game, setGame] = useState<GameModel | null>(null);

  const { loading: queryLoading, error: queryError, data: queryData } = useQuery(GQL.QRY_GAME, {
    variables: { game_id: context.game_id },
    skip: !context.game_id,
  });

  const { data: subData } = useSubscription(GQL.SUB_GAME, {
    variables: { game_id: context.game_id },
    skip: queryLoading || !!queryError,
  });

  useEffect(() => {
    if (queryData?.game) setGame(queryData.game);
    if (subData?.subToGame) setGame(subData.subToGame);
  }, [queryData, subData]);

  const stringAvatar = useCallback((name: string) => ({
    sx: {
      bgcolor: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0").toUpperCase()}`,
    },
    children: name.substring(0, 3),
  }), []);

  const handleItemClick = useCallback((itemId: string) => {
    contextStore.setState({ item_id: itemId, current_vote: null });
  }, []);

  const membersAvatars = useMemo(() => (
    <AvatarGroup max={10}>
      {game?.members_obj.map((member) => (
        <Avatar {...stringAvatar(member.code)} title={member.code} key={member.id} />
      ))}
    </AvatarGroup>
  ), [game, stringAvatar]);

  if (!context.game_id) return <Trans>game.choose</Trans>;
  if (queryLoading) return <p>Loading...</p>;
  if (queryError) return <p>Error: {queryError.message}</p>;

  return game ? (
    <Grid2 minWidth={600}>
      <div className="play">
        <h1 title={`${t("game.author")}${game.author.code}`}>{game.name}</h1>
      </div>

      <Grid2 display="flex" justifyContent="center" alignItems="center" marginBottom={2}>
        {membersAvatars}
      </Grid2>

      <Grid2 marginBottom={1}>
        {context.id && game.members.includes(context.id) ? <CreateItem /> : null}
      </Grid2>

      <Divider>
        <Chip label={<Trans>game.items</Trans>} />
      </Divider>

      <Grid2 container padding={1}>
        {game.items.map((item) => (
          <Grid2 size={4} display="flex" justifyContent="center" alignItems="center" key={item.id}>
            <Tooltip
              title={
                <>
                  Nom: {item.name} <br />
                  Auteur: {item.author.code} <br />
                  Statut: {item.state} <br />
                  {item.description ? `Description: ${item.description}` : ""}
                </>
              }
            >
              <span>
                <Button
                  variant={item.state === "REVEAL" ? "outlined" : "contained"}
                  size="small"
                  sx={{ textTransform: "none" }}
                  startIcon={<InputIcon />}
                  onClick={() => handleItemClick(item.id)}
                  disabled={context.item_id === item.id}
                >
                  <Typography noWrap>{item.name.split("]").pop() ?? item.name}</Typography>
                </Button>
              </span>
            </Tooltip>

            {item.url && (
              <IconButton
                title={item.url}
                onClick={(e) => {
                  e.preventDefault();
                  window.open(item.url, "_blank");
                }}
              >
                <OpenInNewIcon />
              </IconButton>
            )}
          </Grid2>
        ))}
      </Grid2>

      {context.item_id && <Item game={game} />}
    </Grid2>
  ) : (
    <p>Nothing</p>
  );
};
