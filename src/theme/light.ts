// src/theme/light.ts
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

import {
  createSharedComponents,
  sharedShape,
  sharedTypography,
} from './shared';

export const lightPalette = {
  mode: 'light' as const,
  primary: { main: '#01A982', light: '#4AC9B0' },
  secondary: { main: '#59B39E', light: '#C7F2E9' },
  background: {
    default: '#F3FFF9', // vert pâle en fond global
    paper: '#FFFFFF',   // carte blanche
  },
  text: {
    primary: '#1C1C1C',
  },
  gradient: `
    radial-gradient(ellipse at 50% 0%, rgba(1,169,130,0.08) 0%, transparent 70%),
    linear-gradient(135deg, #F3FFF9 0%, #E0F7F1 100%)`,
};

export const lightTheme = responsiveFontSizes(
  createTheme({
    palette: {
      ...lightPalette,
    },
    shape: sharedShape,
    typography: {
      ...sharedTypography,
      h1: { ...sharedTypography.h1, color: lightPalette.text.primary },
      body1: { ...sharedTypography.body1, color: lightPalette.text.primary },
    },
    components: {
      ...createSharedComponents(lightPalette.primary),
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: lightPalette.background.default,
            backgroundImage: lightPalette.gradient,
          },
        },
      },
    },
  })
);
