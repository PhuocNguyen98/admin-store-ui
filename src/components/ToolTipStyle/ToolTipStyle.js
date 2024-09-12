import Tooltip from '@mui/material/Tooltip';
import { ThemeProvider, createTheme } from '@mui/material';

const themeToolTipStyle = createTheme({
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '1.2rem',
        },
      },
    },
  },
});

function ToolTipStyle({ children, ...props }) {
  return (
    <ThemeProvider theme={themeToolTipStyle}>
      <Tooltip {...props}>{children}</Tooltip>
    </ThemeProvider>
  );
}

export default ToolTipStyle;
