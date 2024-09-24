import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';

const themeTablePagination = createTheme({
  components: {
    MuiTablePagination: {
      styleOverrides: {
        selectLabel: {
          fontSize: '1.6rem',
        },
        displayedRows: {
          fontSize: '1.6rem',
        },
        actions: {
          fontSize: '1.6rem',
        },
        menuItem: {
          fontSize: '1.6rem',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          fontSize: '2em',
          minHeight: '2rem',
          display: 'flex',
          alignItems: 'center',
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: '2rem',
        },
      },
    },
  },
});

function TablePaginationStyle({
  page,
  count,
  rowsPerPage,
  rowsPerPageOptions,
  handleChangePage,
  handleChangeRowsPerPage,
}) {
  const [totalRowsValue, setTotalRows] = useState(0);
  const onChangePage = (event, newPage) => {
    handleChangePage(newPage);
  };

  const onChangeRowsPerPage = (event) => {
    let newRowsPerPage = parseInt(event.target.value, 10);
    let newPage = page;

    // Kiểm tra số lượng hàng hiển thị vừa thay đổi so với số tổng số hàng có thể phân trang
    if (newRowsPerPage > totalRowsValue || newRowsPerPage === totalRowsValue) {
      newPage = 0;
    } else if (totalRowsValue % newRowsPerPage !== 0) {
      newPage = Math.floor(totalRowsValue / newRowsPerPage) - 1;
    }

    handleChangeRowsPerPage(newPage, newRowsPerPage);
  };

  useEffect(() => {
    if (count) {
      setTotalRows(count);
    }
  }, [count]);

  return (
    <ThemeProvider theme={themeTablePagination}>
      <TablePagination
        sx={{ mt: 3 }}
        component='div'
        page={page}
        count={count}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />
    </ThemeProvider>
  );
}

export default TablePaginationStyle;
