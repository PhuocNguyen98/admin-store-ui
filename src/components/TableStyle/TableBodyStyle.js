import { TableBody, TableRow, TableCell, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import classnames from 'classnames/bind';
import styles from './TableStyle.module.scss';

const cx = classnames.bind(styles);

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
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '1.2rem',
        },
      },
    },
  },
});

function TableBodyStyle({ columns, tableData, actions }) {
  const renderTableBody = () =>
    tableData.map((data, index) => (
      <TableRow key={data.id}>
        {columns.map((col) => {
          if (col.accessor === 'thumbnail') {
            return (
              <TableCell key={col.accessor}>
                <img
                  src={`${process.env.REACT_APP_BASE_URL}/${
                    data[col.accessor]
                  }`}
                  alt=''
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                  }}
                />
              </TableCell>
            );
          }
          if (col.accessor === 'actions') {
            return (
              <TableCell key={col.accessor}>
                {actions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.to ? `${action.to}/${data.id}` : null}
                    className={cx('action-link')}
                  >
                    <Button
                      component='div'
                      variant='contained'
                      startIcon={action.icon}
                      onClick={action?.onClick ? action.onClick : null}
                      {...action?.css}
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
      <TableBody>
        {tableData.length > 0 ? (
          renderTableBody()
        ) : (
          <TableRow>
            <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
              No records found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </ThemeProvider>
  );
}

export default TableBodyStyle;
