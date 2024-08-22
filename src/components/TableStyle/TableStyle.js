import * as React from 'react';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';

import { Box, TextField, TablePagination } from '@mui/material';
import { useState } from 'react';

import TableHeadStyle from './TableHeadStyle';
import TableBodyStyle from './TableBodyStyle';
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

const getDefaultSorting = (defaultTableData, columns) => {
  const sorted = [...defaultTableData].sort((a, b) => {
    const filterColumn = columns.filter((column) => column.sortbyOrder);

    // Merge all array objects into single object and extract accessor and sortbyOrder keys
    let { accessor = 'id', sortbyOrder = 'asc' } = Object.assign(
      {},
      ...filterColumn,
    );

    if (a[accessor] === null) return 1;
    if (b[accessor] === null) return -1;
    if (a[accessor] === null && b[accessor] === null) return 0;

    const ascending = a[accessor]
      .toString()
      .localeCompare(b[accessor].toString(), 'en', {
        numeric: true,
      });
    return sortbyOrder === 'asc' ? ascending : -ascending;
  });
  return sorted;
};

function TableStyle({ titleInputSearch, columns, data, actions }) {
  const [tableData, setTableData] = useState(getDefaultSorting(data, columns));

  // const [search, setSearch] = useState('');

  // const [page, setPage] = useState(2);
  // const [rowsPerPage, setRowsPerPage] = useState(10);

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  const handleSorting = (sortField, sortOrder) => {
    if (sortField) {
      const sorted = [...tableData].sort((a, b) => {
        if (a[sortField] === null) return 1;
        if (b[sortField] === null) return -1;
        if (a[sortField] === null && b[sortField] === null) return 0;
        return (
          a[sortField].toString().localeCompare(b[sortField].toString(), 'en', {
            numeric: true,
          }) * (sortOrder === 'asc' ? 1 : -1)
        );
      });
      setTableData(sorted);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box>
        {/* cần có API */}
        <Box sx={{ mb: 3 }}>
          <TextField
            placeholder={titleInputSearch}
            sx={{
              fontSize: '1.6rem',
            }}
          />
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label='simple table'>
            <TableHeadStyle
              columns={columns}
              handleSorting={handleSorting}
            ></TableHeadStyle>
            <TableBodyStyle
              columns={columns}
              tableData={tableData}
              actions={actions}
            ></TableBodyStyle>
          </Table>
        </TableContainer>
        {/* Cần có API */}
        {/* <TablePagination
          component='div'
          count={100}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
      </Box>
    </ThemeProvider>
  );
}

export default TableStyle;
