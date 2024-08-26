import * as React from 'react';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';

import { Box, TextField, TablePagination } from '@mui/material';

import TableHeadStyle from './TableHeadStyle';
import TableBodyStyle from './TableBodyStyle';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import useSortableTable from '~/hooks/useSortableTable';

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

function TableStyle({ titleInputSearch, columns, data, actions }) {
  const [tableData, handleSorting] = useSortableTable(data, columns);
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
        <TableContainer component={Paper} elevation={4}>
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
