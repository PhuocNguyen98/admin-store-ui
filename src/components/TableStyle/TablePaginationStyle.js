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
  totalRowsValue,
  rowsPerPageValue,
  rowsPerPageOptions,
  handleChangePage,
  handleChangeRowsPerPage,
}) {
  const [page, setPage] = useState(0); // Chỉ mục của số trang hiện tại
  const [totalRows, setTotalRows] = useState(-1); //Tổng số hàng
  const [rowsPerPage, setRowsPerPage] = useState(5); // Số lượng hàng trên 1 trang

  const onChangePage = (event, newPage) => {
    setPage(newPage);
    handleChangePage(newPage, rowsPerPage);
  };

  const onChangeRowsPerPage = (event) => {
    let newRowsPerPage = parseInt(event.target.value, 10);
    let newPage = page;

    // Kiểm tra số lượng hàng hiển thị vừa thay đổi so với số tổng số hàng có thể phân trang
    if (newRowsPerPage > totalRows || newRowsPerPage === totalRows) {
      newPage = 0;
    } else if (totalRows % newRowsPerPage !== 0) {
      newPage = Math.floor(totalRows / newRowsPerPage) - 1;
    }

    setRowsPerPage(newRowsPerPage);
    setPage(newPage);
    handleChangeRowsPerPage(newPage, newRowsPerPage);
  };

  useEffect(() => {
    if (totalRowsValue) {
      setTotalRows(totalRowsValue);
    }

    if (rowsPerPageValue) {
      setRowsPerPage(rowsPerPageValue);
    }
  }, []);

  return (
    <ThemeProvider theme={themeTablePagination}>
      <TablePagination
        sx={{ mt: 3 }}
        component='div'
        page={page}
        count={totalRowsValue ? totalRowsValue : totalRows}
        rowsPerPage={rowsPerPageValue ? rowsPerPageValue : rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />
    </ThemeProvider>
  );
}

export default TablePaginationStyle;
