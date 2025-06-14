// src\components\vues\PLay.tsx
import { Trans, useTranslation } from "react-i18next";
import { useQuery, useSubscription } from "@apollo/client";
import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Avatar,
  AvatarGroup,
  Chip,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

import { GQL } from "@src/common/gql";
import { GameModel } from '@src/types/game';
import { Item } from "@components/molecules/Item";
import { contextStore } from "@stores/ContextStore";
import { CreateItem } from "@components/molecules/CreateItem";
import { GameItemGrid } from "@components/molecules/GameItemGrid";

export const Play = () => {
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

  const membersAvatars = useMemo(() => (
    <AvatarGroup max={10}>
      {game?.members_obj.map((member) => (
        <Avatar {...stringAvatar(member.code)} title={member.code} key={member.id} />
      ))}
    </AvatarGroup>
  ), [game, stringAvatar]);

  if (!context.game_id) {
    return (
      <Typography variant="body2" color="text.secondary">
        <Trans>game.choose</Trans>
      </Typography>
    );
  }

  if (queryLoading) {
    return (
      <Typography variant="body2" color="text.secondary">
        <Trans>common.loading</Trans>
      </Typography>
    );
  }

  if (queryError) {
    return (
      <Typography variant="body2" color="error">
        <Trans>common.error</Trans> {queryError.message}
      </Typography>
    );
  }

  if (!game) {
    return (
      <Typography variant="body2" color="text.secondary">
        <Trans>common.nothing</Trans>
      </Typography>
    );
  }

  return (
    <Grid container direction="column" spacing={3}>
      {/* Header */}
      <Grid>
        <Typography
          variant="h5"
          component="h1"
          fontWeight={700}
          fontFamily="Montserrat"
          title={`${t("game.author")}${game.author.code}`}
        >
          {game.name}
        </Typography>
      </Grid>

      {/* Avatars */}
      <Grid display="flex" justifyContent="center">
        {membersAvatars}
      </Grid>

      {/* CreateItem */}
      {context.id && game.members.includes(context.id) && (
        <Grid>
          <CreateItem />
        </Grid>
      )}

      {/* Divider */}
      <Grid>
        <Divider>
          <Chip label={<Trans>game.items</Trans>} />
        </Divider>
      </Grid>

      {/* Items grid */}
      <Grid>
        <GameItemGrid game={game} />
      </Grid>

      {/* Item details */}
      {context.item_id && (
        <Grid>
          <Item game={game} />
        </Grid>
      )}
    </Grid>
  );
};
