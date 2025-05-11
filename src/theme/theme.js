export const lightTheme = {
  colors: {
    background: '#F9FAFB',           // Soft light background
    surface: '#FFFFFF',              // White cards/surfaces
    primary: '#3AB4AA',              // Teal (main brand color)
    primaryLight: '#D9F1EF',         // Very light teal for highlights
    secondary: '#FFB84C',            // Warm soft orange for accents
    error: '#E63946',                // Soft red for errors
    text: {
      primary: '#1F2937',            // Deep gray for main text
      secondary: '#6B7280',          // Muted gray for subtext
    },
    dark: {
      shimmer: {
        start: '#2D2D2D',
        middle: '#3D3D3D',
        end: '#2D2D2D',
      }
    }
  },
  fonts: {
    regular: 'Roboto-Regular',
    medium: 'Roboto-Medium',
    bold: 'Roboto-Bold'
  },
  font: 'Roboto-Regular'
};

export const darkTheme = {
  colors: {
    background: '#0E0E0E',           // Near-black
    surface: '#1F1F1F',              // Deep dark gray
    primary: '#3AB4AA',              // Same teal
    secondary: '#FFB84C',            // Warm accent
    error: '#E63946',                // Same error color
    success: '#22C55E',              // Soft green
    text: {
      primary: '#F9FAFB',            // Light off-white
      secondary: '#9CA3AF'           // Muted gray
    },
  },
  fonts: {
    regular: 'Roboto-Regular',
    medium: 'Roboto-Medium',
    bold: 'Roboto-Bold'
  },
  font: 'Roboto-Regular'
};

export const themeColors = [
  {label: 'Background', path: 'background'},
  {label: 'Surface', path: 'surface'},
  {label: 'Primary', path: 'primary'},
  {label: 'Secondary', path: 'secondary'},
  {label: 'Error', path: 'error'},
  {label: 'Text Primary', path: 'text.primary'},
  {label: 'Text Secondary', path: 'text.secondary'},
];

export const themeFonts = [
  {label: 'Roboto', path: 'roboto'},
  {label: 'Monospace', path: 'monospace'},
  {label: 'Helvetica', path: 'helvetica'},
  {label: 'Times New Roman', path: 'times'},
];

export const colors = {
  white: '#FFFFFF',
  black: '#000000',
  gray: '#808080',
};
