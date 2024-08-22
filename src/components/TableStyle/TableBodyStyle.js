import { TableBody, TableRow, TableCell, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '1.4rem',
          color: '#495057',
        },
      },
    },
  },
});

function TableBodyStyle({ columns, tableData, actions }) {
  const renderTableBody = () =>
    tableData.map((data, index) => (
      <TableRow key={index}>
        {columns.map((col) => {
          if (col.accessor === 'actions') {
            return (
              <TableCell key={col.accessor}>
                {actions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.to ? `${action.to}/${data.id}` : null}
                  >
                    <Button
                      component='div'
                      variant='contained'
                      startIcon={action.icon}
                      {...action}
                    >
                      {action.title}
                    </Button>
                  </Link>
                ))}
              </TableCell>
            );
          }
          const cellData = data[col.accessor] ? data[col.accessor] : '';
          return <TableCell key={col.accessor}>{cellData}</TableCell>;
        })}
      </TableRow>
    ));

  return (
    <ThemeProvider theme={theme}>
      <TableBody>{renderTableBody()}</TableBody>
    </ThemeProvider>
  );
}

export default TableBodyStyle;
