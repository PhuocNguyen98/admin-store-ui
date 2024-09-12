import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import EditIcon from '@mui/icons-material/Edit';
import ControlPointIcon from '@mui/icons-material/ControlPoint';

import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

import config from '~/config';
import useDebounce from '~/hooks/useDebounce';
import useSortTable from '~/hooks/useSortTable';
import usePagination from '~/hooks/usePagination';

import Search from '~/components/Search';
import TableStyle from '~/components/TableStyle';
import ToolTipStyle from '~/components/ToolTipStyle';
import BreadcrumbStyle from '~/components/BreadcrumbStyle';
import TableHeadStyle from '~/components/TableStyle/TableHeadStyle';
import TableBodyStyle from '~/components/TableStyle/TableBodyStyle';
import TablePaginationStyle from '~/components/TableStyle/TablePaginationStyle';

import { toast, ToastContainer } from 'react-toastify';
import { getDiscountApi, updateDiscountStatusApi } from '~/api/discountApi';

// Define column table
const columns = [
  { label: 'STT', accessor: 'stt', component: 'text' },
  {
    label: 'Name',
    accessor: 'name',
    sortTable: true,
    component: 'text',
  },
  { label: 'Thumbnail', accessor: 'thumbnail', component: 'image' },
  { label: 'Ngày bắt đầu', accessor: 'start_time', component: 'text' },
  { label: 'Ngày kết thúc', accessor: 'end_time', component: 'text' },
  {
    label: 'Trạng thái',
    accessor: 'is_status',
    displayType: [
      { title: 'Đang áp dụng', value: 1, color: 'success' },
      { title: 'Chưa áp dụng', value: 0, color: 'primary' },
    ],
    // editTable: false,
    // component: 'chip', // Lấy component Chip Material UI nếu editTable = false
    editTable: true,
    component: 'select', // Lấy component Select Material UI nếu editTable = true
  },
  { label: 'Actions', accessor: 'actions', component: 'actions' },
];

// Define column action table
const actions = [
  {
    icon: <EditIcon />,
    title: 'Edit',
    to: '/discount/edit',
    css: {
      color: 'info',
    },
  },
];

function Discount() {
  const { control, setValue, handleSubmit } = useForm({
    defaultValues: {
      formList: [],
    },
  });
  const { fields } = useFieldArray({
    control,
    name: 'formList',
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateDiscountStatusApi(data);
      toast.success(res.message);
    } catch (error) {
      toast.error(error.messages);
    }
  });

  const [data, setData] = useState([]);

  // State sort
  const { sortField, order, setSortField, setOrder } = useSortTable(
    'id',
    'asc',
  );

  // State pagination
  const [pagination, setPagination] = useState({});
  const { page, rowsPerPage, setPage, setRowsPerPage } = usePagination(
    0,
    5,
    -1,
  );

  // State search table
  const [searchValue, setSearchValue] = useState('');
  const debounceValue = useDebounce(searchValue, 500);

  // Hanle change page
  const handleChangePage = (newPage, rowsPerPage) => {
    setPage(newPage);
    getData(sortField, order, newPage, rowsPerPage, debounceValue);
  };

  // Handle change rows per page
  const handleChangeRowsPerPage = (newPage, newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    getData(sortField, order, newPage, newRowsPerPage, debounceValue);
  };

  // Get data table
  const getData = async (order, sort, page, rowsPerPage, search) => {
    page++;
    const res = await getDiscountApi(order, sort, page, rowsPerPage, search);
    if (res) {
      setData(res.data);
      setPagination(res.pagination);
    }
  };

  // Handle sorting
  const handleSorting = (sortField, sortOrder) => {
    setSortField(sortField);
    setOrder(sortOrder);
    setPage(0);
    getData(sortField, sortOrder, page, rowsPerPage, debounceValue);
  };

  // Handle search
  const handleSearch = useCallback(
    (value) => {
      setSearchValue(value);
    },
    [searchValue],
  );

  useEffect(() => {
    if (data.length === 0 && !debounceValue.trim()) {
      getData(sortField, order, page, rowsPerPage);
    } else {
      getData(sortField, order, 0, rowsPerPage, searchValue);
    }
  }, [debounceValue]);

  return (
    <div className='wrapper'>
      <ToastContainer />
      <BreadcrumbStyle />
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
            Discount
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
            Manage your discount
          </Typography>
        </Box>
        <Link to={config.discount.add}>
          <Button
            variant='contained'
            sx={{ fontSize: '1.3rem' }}
            startIcon={<ControlPointIcon />}
          >
            Add discount
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
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Search label='Search discount name' handleSearch={handleSearch} />
          <ToolTipStyle title='Cập nhật nhanh trạng thái'>
            <Button
              variant='contained'
              sx={{ fontSize: '1.3rem' }}
              onClick={() => onSubmit()}
            >
              Quick Update
            </Button>
          </ToolTipStyle>
        </Box>

        <TableStyle>
          <TableHeadStyle
            columns={columns}
            handleSorting={handleSorting}
          ></TableHeadStyle>
          <TableBodyStyle
            columns={columns}
            tableData={data}
            actions={actions}
            control={control}
            setValue={setValue}
          ></TableBodyStyle>
        </TableStyle>
        {data.length > 0 ? (
          <TablePaginationStyle
            rowsPerPageValue={pagination.rowsPerPage}
            totalRowsValue={pagination.totalRows}
            rowsPerPageOptions={[5, 10, 15]}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
          />
        ) : null}
      </Paper>
    </div>
  );
}

export default Discount;
