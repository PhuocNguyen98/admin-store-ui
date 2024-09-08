import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material';

const themeButton = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '1.3rem',
          textTransform: 'capitalize',
          letterSpacing: '1px',
        },
      },
    },
  },
});

function ButtonStyle({
  variant = 'contained',
  size = 'medium',
  children,
  onClick,
  ...props
}) {
  return (
    <ThemeProvider theme={themeButton}>
      <Button variant={variant} size={size} onClick={onClick} {...props}>
        {children}
      </Button>
    </ThemeProvider>
  );
}

export default ButtonStyle;
