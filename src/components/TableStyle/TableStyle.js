import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          minWidth: 250,
          width: 400,
          fontSize: '1.4rem',
          color: '#495057',
        },
      },
    },
  },
});

function TableStyle({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <TableContainer component={Paper} elevation={4}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          {children}
        </Table>
      </TableContainer>
    </ThemeProvider>
  );
}

export default TableStyle;
