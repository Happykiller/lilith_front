// src/page/Admin.tsx
import { Trans } from "react-i18next";
import { Container, Typography, useTheme } from "@mui/material";

import { Games } from "@components/molecules/Games";
import { JoinGame } from "@components/molecules/JoinGame";
import { FormGame } from "@components/molecules/FormGame";
import { SectionCard } from '@components/molecules/SectionCard';

export const Admin = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="md" sx={{ pt: 4, pb: 6 }}>
      {/* Page Title */}
      <Typography
        variant="h4"
        component="h1"
        fontWeight={700}
        gutterBottom
        sx={{
          fontFamily: "Montserrat",
          color: theme.palette.text.primary,
          textAlign: "center",
        }}
      >
        <Trans>admin.title</Trans>
      </Typography>

      <SectionCard id="new-game-title" title={<Trans>admin.newGame</Trans>}>
        <FormGame />
      </SectionCard>

      <SectionCard id="join-game-title" title={<Trans>admin.joinGame</Trans>}>
        <JoinGame />
      </SectionCard>

      <SectionCard id="your-games-title" title={<Trans>admin.yourGames</Trans>}>
        <Games />
      </SectionCard>
    </Container>
  );
};