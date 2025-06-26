'use client'
import { createTheme, responsiveFontSizes, ThemeOptions } from '@mui/material';

// src/theme.d.ts
import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      neutral: Record<number, string>;
      standard: Record<number, string>;
    };
  }

  interface PaletteOptions {
    custom?: {
      neutral?: Record<number, string>;
      standard: Record<number, string>;
    };
  }
}


const lightThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: { 
        main: '#004870' 
    },
    secondary: { 
        main: '#CF5B13' 
    },
    background: {
        default: '#DCDFE4',
        paper: '#F7F8F9',
    },
    text: {
        primary: '#000000',
        secondary: '#rgba(0, 0, 0, 0.8)',
    },
    
    custom: {
        neutral: {
            0: '#FFFFFF',
            100: '#F7F8F9',
            200: '#F1F2F4',
            300: '#DCDFE4',
            400: '#B3B9C4',
            500: '#8590A2',
            600: '#758195',
            700: '#626F86',
            800: '#44546F',
            900: '#2C3E5D',
            1000: '#172B4D',
            1100: '#091E42'
        },
        standard: {
			0: '#DCDFE4',
			1: '#F1F2F4',
			2: '#F7F8F9',
			3: '#FFFFFF',
        }
    }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          padding: '1rem',
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '1rem',
        }
      }
    },
    MuiContainer: {
      defaultProps: {
        disableGutters: true,
      },
      styleOverrides: {
        root: {
          paddingLeft: '1rem',
          paddingRight: '1rem',
        },
      },
    },
  }
};

export const theme = responsiveFontSizes(createTheme(lightThemeOptions));