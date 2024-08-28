import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import ControlPointIcon from '@mui/icons-material/ControlPoint';

import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import config from '~/config';
import useDebounce from '~/hooks/useDebounce';
import useSortTable from '~/hooks/useSortTable';
import usePagination from '~/hooks/usePagination';

import TableStyle from '~/components/TableStyle';
import TableHeadStyle from '~/components/TableStyle/TableHeadStyle';
import TableBodyStyle from '~/components/TableStyle/TableBodyStyle';
import TablePaginationStyle from '~/components/TableStyle/TablePaginationStyle';

import { getCategoryApi } from '~/api/categoryApi';

const columns = [
  { label: 'ID', accessor: 'id', sortTable: true },
  { label: 'Name', accessor: 'name', sortTable: true },
  { label: 'Thumbnail', accessor: 'thumbnail' },
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

  const { sortField, order, setSortField, setOrder } = useSortTable(
    'id',
    'asc',
  );

  const [pagination, setPagination] = useState({});
  const { page, rowsPerPage, setPage, setRowsPerPage } = usePagination(
    0,
    5,
    -1,
  );

  const [searchValue, setSearchValue] = useState('');
  const [showIconSearch, setShowIconSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceValue = useDebounce(searchValue, 500);

  const handleChangeInput = (e) => {
    const searchValue = e.target.value;
    setShowIconSearch(true);
    setIsLoading(true);
    if (!searchValue.startsWith(' ')) {
      setSearchValue(searchValue);
      setPage(0);
    }
  };

  const handleChangePage = (newPage, rowsPerPage) => {
    setPage(newPage);
    getData(sortField, order, newPage, rowsPerPage, debounceValue);
  };

  const handleChangeRowsPerPage = (newPage, newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    getData(sortField, order, newPage, newRowsPerPage, debounceValue);
  };

  const getData = async (order, sort, page, rowsPerPage, search) => {
    page++;
    const res = await getCategoryApi(order, sort, page, rowsPerPage, search);
    if (res) {
      setData(res.data);
      setPagination(res.pagination);
      setIsLoading(false);
    }
  };

  const handleSorting = (sortField, sortOrder) => {
    setSortField(sortField);
    setOrder(sortOrder);
    setPage(0);
    getData(sortField, sortOrder, page, rowsPerPage, debounceValue);
  };

  const handleClearSearch = () => {
    setSearchValue('');
    setPage(0);
    setIsLoading(false);
    setShowIconSearch(false);
  };

  useEffect(() => {
    if (data.length === 0 && !debounceValue.trim()) {
      getData(sortField, order, page, rowsPerPage);
    } else {
      getData(sortField, order, 0, rowsPerPage, searchValue);
    }
  }, [debounceValue]);

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
        <FormControl sx={{ mb: 3, width: '25%' }} variant='standard'>
          <OutlinedInput
            placeholder='Search category name'
            sx={{ fontSize: '1.6rem' }}
            endAdornment={
              <InputAdornment position='end'>
                {showIconSearch ? (
                  <IconButton edge='end' onClick={() => handleClearSearch()}>
                    {isLoading ? <RotateLeftIcon /> : <CloseIcon />}
                  </IconButton>
                ) : null}
              </InputAdornment>
            }
            value={searchValue}
            onChange={(e) => handleChangeInput(e)}
          />
        </FormControl>

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

        <TablePaginationStyle
          rowsPerPageValue={pagination.rowsPerPage}
          totalRowsValue={pagination.totalRows}
          rowsPerPageOptions={[5, 10, 15]}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

export default Category;
