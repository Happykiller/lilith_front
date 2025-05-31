// src\components\molecules\SectionCard.tsx
import { Paper, Typography, useTheme } from "@mui/material";
import { ReactNode } from "react";

interface SectionCardProps {
  id: string;
  title: ReactNode;
  children: ReactNode;
}

export const SectionCard = ({ id, title, children }: SectionCardProps) => {
  const theme = useTheme();

  return (
    <Paper
      component="section"
      aria-labelledby={id}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: { xs: 0, sm: `${theme.shape.borderRadius}px` },
        boxShadow: { xs: 'none', sm: `0 0 32px 0 ${theme.palette.primary.main}55` },
        border: { xs: 'none', sm: `2px solid ${theme.palette.primary.main}` },
        background: {
          xs: 0,
          sm: theme.palette.background.default,
        },
      }}
    >
      <Typography
        variant="h6"
        component="h2"
        id={id}
        gutterBottom
        sx={{
          fontWeight: 600,
          fontFamily: "Montserrat",
          color: theme.palette.text.secondary,
        }}
      >
        {title}
      </Typography>

      {children}
    </Paper>
  );
};
