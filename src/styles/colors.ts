/**
 * Centralized Color Palette for Portfolio
 *
 * LIGHT MODE
 * Monet-inspired ethereal liquid glass:
 * pearl, misty blue, sage green, lavender and soft yellow.
 *
 * DARK MODE
 * Cyber-extraterrestrial archive:
 * near-black, icy cyan, ultraviolet and alien mint.
 */

export const colors = {
  // Base colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  /**
   * Legacy accent key.
   *
   * This remains named "pink" because existing components may already use
   * colors.pink[...]. The values are now cool iridescent blue-green tones
   * instead of a dominant pink palette.
   */
  pink: {
    25: '#F7FBFA',
    50: '#EFF7F4',
    100: '#E1F0EB',
    200: '#CBE3DA',
    300: '#A9CEC0',
    400: '#86B6A8',
    500: '#67998E',
    600: '#527E76',
    700: '#42665F',
    800: '#344F4B',
    900: '#263B38',
  },

  // Neutral interface palette
  dark: {
    50: '#F8FBFC',
    100: '#EEF3F5',
    200: '#DDE6EA',
    300: '#BDC9CF',
    400: '#8E9EA6',
    500: '#667780',
    600: '#47565F',
    700: '#2C3740',
    800: '#171F26',
    900: '#0A1015',
    950: '#020406',
  },

  // Backgrounds
  background: {
    light: {
      primary: '#F7F9F7',
      secondary: '#EDF3F0',

      gradient: `
        radial-gradient(
          circle at 12% 12%,
          rgba(156, 205, 220, 0.28) 0%,
          transparent 31%
        ),
        radial-gradient(
          circle at 84% 16%,
          rgba(171, 199, 178, 0.28) 0%,
          transparent 34%
        ),
        radial-gradient(
          circle at 48% 78%,
          rgba(188, 178, 220, 0.20) 0%,
          transparent 36%
        ),
        radial-gradient(
          circle at 82% 82%,
          rgba(235, 218, 157, 0.15) 0%,
          transparent 28%
        ),
        linear-gradient(
          155deg,
          #FBFCFA 0%,
          #EEF4F1 38%,
          #E9F0F2 66%,
          #F1EFF5 100%
        )
      `,

      gradientEnd: '#F1EFF5',

      overlay: 'rgba(236, 243, 240, 0.68)',

      sections: {
        about: `
          radial-gradient(
            circle at 12% 10%,
            rgba(154, 204, 220, 0.30) 0%,
            transparent 31%
          ),
          radial-gradient(
            circle at 86% 16%,
            rgba(166, 202, 178, 0.29) 0%,
            transparent 35%
          ),
          radial-gradient(
            circle at 52% 80%,
            rgba(189, 178, 221, 0.19) 0%,
            transparent 37%
          ),
          radial-gradient(
            circle at 18% 82%,
            rgba(234, 218, 164, 0.13) 0%,
            transparent 27%
          ),
          linear-gradient(
            160deg,
            #FBFCFA 0%,
            #EEF4F1 48%,
            #EAF1F2 72%,
            #F2EFF5 100%
          )
        `,

        skills: `
          radial-gradient(
            circle at 82% 18%,
            rgba(162, 201, 176, 0.27) 0%,
            transparent 34%
          ),
          radial-gradient(
            circle at 18% 72%,
            rgba(153, 201, 219, 0.23) 0%,
            transparent 36%
          ),
          radial-gradient(
            circle at 60% 86%,
            rgba(229, 215, 163, 0.12) 0%,
            transparent 28%
          ),
          linear-gradient(
            180deg,
            #F2EFF5 0%,
            #F4F8F5 48%,
            #EAF1EE 100%
          )
        `,

        projects: `
          radial-gradient(
            circle at 14% 18%,
            rgba(183, 175, 217, 0.20) 0%,
            transparent 34%
          ),
          radial-gradient(
            circle at 84% 72%,
            rgba(157, 202, 179, 0.26) 0%,
            transparent 38%
          ),
          radial-gradient(
            circle at 68% 14%,
            rgba(151, 199, 218, 0.20) 0%,
            transparent 32%
          ),
          linear-gradient(
            180deg,
            #EAF1EE 0%,
            #F8FAF8 46%,
            #EDF3F2 100%
          )
        `,

        experience: `
          radial-gradient(
            circle at 80% 12%,
            rgba(151, 199, 218, 0.24) 0%,
            transparent 34%
          ),
          radial-gradient(
            circle at 18% 82%,
            rgba(166, 202, 178, 0.24) 0%,
            transparent 38%
          ),
          radial-gradient(
            circle at 54% 70%,
            rgba(232, 218, 164, 0.12) 0%,
            transparent 28%
          ),
          linear-gradient(
            180deg,
            #EDF3F2 0%,
            #F2F6F3 50%,
            #F1F0E9 100%
          )
        `,

        certifications: `
          radial-gradient(
            circle at 50% 16%,
            rgba(184, 174, 218, 0.18) 0%,
            transparent 34%
          ),
          radial-gradient(
            circle at 78% 78%,
            rgba(161, 201, 177, 0.22) 0%,
            transparent 36%
          ),
          linear-gradient(
            180deg,
            #F1F0E9 0%,
            #F6F9F6 52%,
            #ECF2F0 100%
          )
        `,
      },
    },

    dark: {
      primary: '#020406',
      secondary: '#070C10',

      gradient: `
        radial-gradient(
          circle at 16% 10%,
          rgba(126, 225, 235, 0.14) 0%,
          transparent 29%
        ),
        radial-gradient(
          circle at 84% 16%,
          rgba(169, 155, 224, 0.12) 0%,
          transparent 32%
        ),
        radial-gradient(
          circle at 52% 80%,
          rgba(112, 224, 181, 0.10) 0%,
          transparent 35%
        ),
        radial-gradient(
          circle at 80% 78%,
          rgba(233, 167, 178, 0.035) 0%,
          transparent 24%
        ),
        linear-gradient(
          160deg,
          #010203 0%,
          #060B10 48%,
          #020507 100%
        )
      `,

      gradientEnd: '#020507',

      overlay: 'rgba(1, 3, 6, 0.87)',

      sections: {
        about: `
          radial-gradient(
            circle at 14% 10%,
            rgba(126, 225, 235, 0.15) 0%,
            transparent 29%
          ),
          radial-gradient(
            circle at 86% 16%,
            rgba(169, 155, 224, 0.12) 0%,
            transparent 32%
          ),
          radial-gradient(
            circle at 50% 80%,
            rgba(112, 224, 181, 0.10) 0%,
            transparent 35%
          ),
          linear-gradient(
            160deg,
            #010203 0%,
            #060B10 52%,
            #020507 100%
          )
        `,

        skills: `
          radial-gradient(
            circle at 82% 18%,
            rgba(112, 224, 181, 0.11) 0%,
            transparent 34%
          ),
          radial-gradient(
            circle at 18% 76%,
            rgba(126, 225, 235, 0.10) 0%,
            transparent 36%
          ),
          radial-gradient(
            circle at 66% 84%,
            rgba(169, 155, 224, 0.06) 0%,
            transparent 28%
          ),
          linear-gradient(
            180deg,
            #020507 0%,
            #060C11 50%,
            #020405 100%
          )
        `,

        projects: `
          radial-gradient(
            circle at 16% 18%,
            rgba(169, 155, 224, 0.11) 0%,
            transparent 35%
          ),
          radial-gradient(
            circle at 84% 76%,
            rgba(112, 224, 181, 0.10) 0%,
            transparent 38%
          ),
          radial-gradient(
            circle at 70% 14%,
            rgba(126, 225, 235, 0.08) 0%,
            transparent 32%
          ),
          linear-gradient(
            180deg,
            #020405 0%,
            #070D12 50%,
            #030608 100%
          )
        `,

        experience: `
          radial-gradient(
            circle at 78% 14%,
            rgba(126, 225, 235, 0.09) 0%,
            transparent 34%
          ),
          radial-gradient(
            circle at 20% 82%,
            rgba(112, 224, 181, 0.08) 0%,
            transparent 38%
          ),
          radial-gradient(
            circle at 54% 68%,
            rgba(169, 155, 224, 0.055) 0%,
            transparent 28%
          ),
          linear-gradient(
            180deg,
            #030608 0%,
            #060C11 52%,
            #010304 100%
          )
        `,

        certifications: `
          radial-gradient(
            circle at 50% 18%,
            rgba(169, 155, 224, 0.10) 0%,
            transparent 34%
          ),
          radial-gradient(
            circle at 80% 78%,
            rgba(112, 224, 181, 0.07) 0%,
            transparent 36%
          ),
          linear-gradient(
            180deg,
            #010304 0%,
            #060A0F 52%,
            #010203 100%
          )
        `,
      },
    },
  },

  // Text colors
  text: {
    light: {
      primary: '#263337',
      secondary: '#526568',
      tertiary: '#78898B',
      accent: '#4F7E79',
      pink: '#6F688F',
    },

    dark: {
      primary: '#F0FBFC',
      secondary: '#B6CBCE',
      tertiary: '#7C9397',
      accent: '#8DE3EC',
      pink: '#B2A7E4',
    },
  },

  // Interactive states
  interactive: {
    light: {
      primary: 'rgba(137, 184, 168, 0.13)',
      hover: 'rgba(133, 194, 174, 0.23)',
      active: '#67998E',
      focus: 'rgba(131, 190, 173, 0.34)',
    },

    dark: {
      primary: 'rgba(126, 225, 235, 0.09)',
      hover: 'rgba(112, 224, 181, 0.17)',
      active: '#8DE3EC',
      focus: 'rgba(126, 225, 235, 0.30)',
    },
  },

  // Navigation
  navigation: {
    light: {
      background: 'rgba(239, 246, 242, 0.48)',
      backgroundScrolled: 'rgba(235, 243, 239, 0.76)',
      border: 'rgba(86, 126, 119, 0.14)',
      borderScrolled: 'rgba(86, 126, 119, 0.22)',
      shadow: 'rgba(49, 74, 70, 0.07)',
      shadowScrolled: 'rgba(49, 74, 70, 0.14)',
      mobile: 'rgba(239, 246, 242, 0.95)',
    },

    dark: {
      background: 'rgba(2, 5, 8, 0.50)',
      backgroundScrolled: 'rgba(3, 7, 10, 0.79)',
      border: 'rgba(141, 227, 236, 0.12)',
      borderScrolled: 'rgba(112, 224, 181, 0.18)',
      shadow: 'rgba(0, 0, 0, 0.32)',
      shadowScrolled: 'rgba(0, 0, 0, 0.52)',
      mobile: 'rgba(2, 5, 8, 0.96)',
    },
  },

  // Buttons
  button: {
    primary: {
      light: {
        background: '#67998E',
        text: '#FFFFFF',
        hover: '#79AA9D',
        shadow: 'rgba(86, 141, 128, 0.30)',
      },

      dark: {
        background: '#8DE3EC',
        text: '#031012',
        hover: '#A2E5C8',
        shadow: 'rgba(126, 225, 235, 0.34)',
      },
    },

    secondary: {
      light: {
        background: 'rgba(255, 255, 255, 0.52)',
        text: '#263A3A',
        border: 'rgba(87, 127, 119, 0.20)',
        hover: 'rgba(217, 234, 226, 0.76)',
      },

      dark: {
        background: 'rgba(7, 14, 19, 0.62)',
        text: '#EAFBFC',
        border: 'rgba(141, 227, 236, 0.21)',
        hover: 'rgba(112, 224, 181, 0.11)',
      },
    },

    outline: {
      light: {
        background: 'rgba(255, 255, 255, 0.24)',
        text: '#4F7E79',
        border: 'rgba(79, 126, 121, 0.36)',
        hover: 'rgba(211, 231, 223, 0.66)',
      },

      dark: {
        background: 'rgba(4, 10, 14, 0.48)',
        text: '#8DE3EC',
        border: 'rgba(178, 167, 228, 0.38)',
        hover: 'rgba(112, 224, 181, 0.12)',
      },
    },
  },

  // Cards
  card: {
    light: {
      background: 'rgba(250, 253, 251, 0.50)',
      border: 'rgba(91, 133, 123, 0.17)',
      shadow: 'rgba(48, 78, 70, 0.14)',
    },

    dark: {
      background: 'rgba(6, 13, 18, 0.60)',
      border: 'rgba(141, 227, 236, 0.15)',
      shadow: 'rgba(0, 0, 0, 0.54)',
    },
  },

  // Effects
  effects: {
    glow: 'rgba(126, 225, 235, 0.30)',
    dropShadow: 'rgba(92, 166, 150, 0.27)',
    textShadow: 'rgba(15, 35, 31, 0.15)',
    blur: 'rgba(235, 246, 241, 0.16)',
  },

  // Utility colors
  utility: {
    success: '#49B894',
    warning: '#D6AE5A',
    error: '#DF6471',
    info: '#5DA6CC',
    neutral: '#6D7C7D',
  },

  // Special effects
  special: {
    dragMe: '#8DE3EC',

    aurora: {
      dark: '#76DCB9',

      light: {
        1: '#D8EBE4',
        2: '#DCECF2',
        3: '#E4DFF0',
      },
    },
  },
} as const;

// Type definitions for better TypeScript support
type ColorTheme = 'light' | 'dark';
type ColorVariant = keyof typeof colors;

export type { ColorTheme, ColorVariant };

// Helper function to get theme-specific colors
export const getThemeColors = (theme: ColorTheme) => ({
  background: colors.background[theme],
  text: colors.text[theme],
  interactive: colors.interactive[theme],
  navigation: colors.navigation[theme],

  button: {
    primary: colors.button.primary[theme],
    secondary: colors.button.secondary[theme],
    outline: colors.button.outline[theme],
  },

  card: colors.card[theme],
});