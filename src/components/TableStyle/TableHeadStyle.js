import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';

import visuallyHidden from '@mui/utils/visuallyHidden';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { useState } from 'react';

const theme = createTheme({
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '1.6rem',
          fontWeight: 600,
          color: '#495057',
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          top: '-2px',
        },
      },
    },
  },
});

function TableHeadStyle({ columns, handleSorting }) {
  const [order, setOrder] = useState('asc');
  const [sortField, setSortField] = useState('');

  const handleSortingChange = (accessor) => {
    const sortOrder = accessor === sortField && order === 'asc' ? 'desc' : 'asc';
    setSortField(accessor);
    setOrder(sortOrder);
    handleSorting(accessor, sortOrder);
  };

  const renderTableHead = () => {
    return (
      <TableRow>
        {columns.map((col) => {
          return (
            <TableCell
              align='center'
              key={col.accessor}
              onClick={col.sortTable ? () => handleSortingChange(col.accessor) : null}
            >
              {col.label}
              {col.sortTable ? (
                <TableSortLabel
                  active={sortField === col.accessor}
                  direction={sortField === col.accessor || col?.sortbyOrder ? order : 'asc'}
                >
                  {sortField === col.accessor ? (
                    <Box component='span' sx={visuallyHidden}>
                      {order === 'asc' ? 'sorted ascending' : 'sorted descending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              ) : null}
            </TableCell>
          );
        })}
      </TableRow>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <TableHead>{renderTableHead()}</TableHead>
    </ThemeProvider>
  );
}

export default TableHeadStyle;
