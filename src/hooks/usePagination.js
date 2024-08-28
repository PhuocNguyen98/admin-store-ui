import { useState } from 'react';

export default function usePagination(
  pageValue,
  rowsPerPageValue,
  totalRowsValue,
) {
  const [page, setPageValue] = useState(pageValue); // chỉ mục của số trang hiện tại
  const [rowsPerPage, setRowsPerPageValue] = useState(rowsPerPageValue); // Số lượng hàng trên 1 trang
  const [totalRows, setTotalRowsValue] = useState(totalRowsValue); //Tổng số hàng

  const setPage = (page) => {
    setPageValue(page);
  };

  const setTotalRows = (totalRows) => {
    setTotalRowsValue(totalRows);
  };

  const setRowsPerPage = (rowsPerPage) => {
    setRowsPerPageValue(rowsPerPage);
  };

  return {
    page,
    totalRows,
    rowsPerPage,
    setPage,
    setTotalRows,
    setRowsPerPage,
  };
}
