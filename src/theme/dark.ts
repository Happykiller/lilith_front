// src\theme\dark.ts
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

import {
  createSharedComponents,
  sharedShape,
  sharedTypography,
} from './shared';

export const darkPalette = {
  mode: 'dark' as const,
  primary: { main: '#01A982', light: '#4AC9B0' },
  secondary: { main: '#8DC9B3', light: '#BFEADF' },
  background: {
    default: '#012A24', // fond global vert profond
    paper: '#014035',   // carte principale
  },
  text: {
    primary: '#F1F1F1',
  },
  gradient: `
    radial-gradient(ellipse at 50% 0%, rgba(1,169,130,0.25) 0%, transparent 70%),
    linear-gradient(135deg, #012A24 0%, #014035 100%)`,
};

export const darkTheme = responsiveFontSizes(
  createTheme({
    palette: {
      ...darkPalette,
    },
    shape: sharedShape,
    typography: {
      ...sharedTypography,
      h1: { ...sharedTypography.h1, color: darkPalette.text.primary },
      body1: { ...sharedTypography.body1, color: darkPalette.text.primary },
    },
    components: {
      ...createSharedComponents(darkPalette.primary),
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: darkPalette.background.default,
            backgroundImage: darkPalette.gradient,
          },
        },
      },
    },
  })
);