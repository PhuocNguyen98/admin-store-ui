import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { getCategoryApi } from '~/api/categoryApi';

import config from '~/config';
import TableStyle from '~/components/TableStyle';
import TableHeadStyle from '~/components/TableStyle/TableHeadStyle';
import TableBodyStyle from '~/components/TableStyle/TableBodyStyle';

const columns = [
  { label: 'ID', accessor: 'id', sortTable: true },
  { label: 'Name', accessor: 'name', sortTable: true },
  { label: 'Thumbnail', accessor: 'thumbnail', sortTable: true },
  { label: 'Slug', accessor: 'slug', sortTable: true },
  { label: 'Actions', accessor: 'actions' },
];

const actions = [
  {
    icon: <EditIcon />,
    title: 'Edit',
    to: '/category/edit',
    css: {
      color: 'info',
    },
  },
  {
    icon: <DeleteIcon />,
    title: 'Delete',
    css: {
      color: 'error',
    },
    onClick: () => alert(1),
  },
];

function Category() {
  const [data, setData] = useState([]);
  const [sortField, setSortField] = useState('id');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(2);
  const [totalRows, settotalRows] = useState(1);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    getData(sortField, order, newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    let newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    getData(sortField, order, 0, parseInt(event.target.value, 10));
  };

  const getData = async (order, sort, page, rowsPerPage) => {
    page++;
    const res = await getCategoryApi(order, sort, page, rowsPerPage);
    if (res) {
      setData(res.data);
      settotalRows(res.pagination.totalRows);
      setRowsPerPage(res.pagination.pageSize);
    }
  };

  const handleSorting = useCallback(
    (sortField, sortOrder) => {
      setSortField(sortField);
      setOrder(sortOrder);
      getData(sortField, sortOrder, page, rowsPerPage);
    },
    [sortField, order],
  );

  useEffect(() => {
    if (data.length === 0) {
      getData(sortField, order, page, rowsPerPage);
    }
  }, []);

  return (
    <div className='wrapper'>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography
            variant='h3'
            component='h4'
            sx={{
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            Categories
          </Typography>
          <Typography
            variant='subtitle1'
            component='span'
            gutterBottom
            sx={{
              fontSize: '1.4rem',
              color: '#919aa3',
              display: 'inline-flex',
              paddingBottom: 1,
            }}
          >
            Manage your categories
          </Typography>
        </Box>
        <Link to={config.category.add}>
          <Button
            variant='contained'
            sx={{ fontSize: '1.3rem' }}
            startIcon={<ControlPointIcon />}
          >
            Add category
          </Button>
        </Link>
      </Box>
      <Divider />
      <Paper
        sx={{
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: 2,
          marginTop: 3,
        }}
      >
        <TableStyle>
          <TableHeadStyle
            columns={columns}
            handleSorting={handleSorting}
          ></TableHeadStyle>
          <TableBodyStyle
            columns={columns}
            tableData={data}
            actions={actions}
          ></TableBodyStyle>
        </TableStyle>
        <TablePagination
          component='div'
          rowsPerPageOptions={[2, 4, 6, 8]}
          rowsPerPage={rowsPerPage}
          count={totalRows}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

export default Category;
