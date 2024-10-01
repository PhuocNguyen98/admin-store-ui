import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import EditIcon from '@mui/icons-material/Edit';
import ControlPointIcon from '@mui/icons-material/ControlPoint';

import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

import config from '~/config';
import useDebounce from '~/hooks/useDebounce';

import Search from '~/components/Search';
import Loader from '~/components/Loader';
import TableStyle from '~/components/TableStyle';
import ToolTipStyle from '~/components/ToolTipStyle';
import BackdropStyle from '~/components/BackdropStyle';
import BreadcrumbStyle from '~/components/BreadcrumbStyle';
import TableHeadStyle from '~/components/TableStyle/TableHeadStyle';
import TableBodyStyle from '~/components/TableStyle/TableBodyStyle';
import TablePaginationStyle from '~/components/TableStyle/TablePaginationStyle';

import { toast } from 'react-toastify';
import { getDiscountApi, quickUpdateDiscountApi } from '~/api/discountApi';

// Define column table
const columns = [
  { label: 'STT', accessor: 'stt', component: 'text' },
  {
    label: 'Name',
    accessor: 'name',
    sortTable: true,
    component: 'text',
  },
  { label: 'Discount', accessor: 'percent', component: 'text', sortTable: true },
  { label: 'Thumbnail', accessor: 'thumbnail', component: 'image' },
  { label: 'Start time', accessor: 'start_time', component: 'text', sortTable: true },
  { label: 'End time', accessor: 'end_time', component: 'text', sortTable: true },
  {
    label: 'Status',
    accessor: 'is_status',
    displayType: [
      { title: 'Đang áp dụng', value: 1, color: 'success' },
      { title: 'Chưa áp dụng', value: 0, color: 'primary' },
    ],
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
  const [data, setData] = useState([]);
  const [sort, setSort] = useState('id');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(0); // Chỉ mục của số trang hiện tại( số 0 tương ứng với trang 1 )
  const [totalRows, setTotalRows] = useState(-1); //Tổng số hàng
  const [rowsPerPage, setRowsPerPage] = useState(5); // Số lượng hàng trên 1 trang
  const [pageCurrent, setPageCurrent] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const debounceValue = useDebounce(searchValue, 500);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { control, setValue, handleSubmit } = useForm({
    defaultValues: {
      formList: [],
    },
  });
  const { fields } = useFieldArray({
    control,
    name: 'formList',
  });

  // Handle sort
  const handleSorting = (sortField, sortOrder) => {
    setSort(sortField);
    setOrder(sortOrder);
  };

  // Handle pagination
  const handleChangePage = (newPage) => {
    setPage(newPage);
    setPageCurrent(newPage + 1);
  };

  const handleChangeRowsPerPage = (newPage, newRowsPerPage) => {
    setPage(newPage);
    setPageCurrent(newPage + 1);
    setRowsPerPage(newRowsPerPage);
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchValue(value);
    setPage(0);
    setPageCurrent(1);
  };

  // Get data
  const getDataApi = async () => {
    try {
      const res = await getDiscountApi(searchValue, sort, order, pageCurrent, rowsPerPage);
      if (res?.status === 200 && res?.data) {
        setData(res.data);
        if (res?.pagination) {
          setRowsPerPage(res.pagination?.rowsPerPage);
          setTotalRows(res.pagination?.totalRows);
          setPage(res.pagination?.pageCurrent - 1);
          setPageCurrent(res.pagination?.pageCurrent);
        }
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle Submit
  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsSuccess(true);
      const res = await quickUpdateDiscountApi(data);
      if (res?.status === 200) {
        res?.flag ? toast.info(res.message) : toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      setIsSuccess(false);
    } catch (error) {
      toast.error(error.message);
      setIsSuccess(false);
    }
  });

  useEffect(() => {
    if (!isSuccess) {
      getDataApi();
    }
  }, [debounceValue, order, sort, rowsPerPage, pageCurrent, isSuccess]);

  return (
    <>
      {!data.length > 0 && isLoading ? (
        <Loader />
      ) : (
        <div className='wrapper'>
          <BackdropStyle open={isSuccess} title='Updating...' />
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
              {data.length > 0 ? (
                <ToolTipStyle title='Quickly update status'>
                  <Button
                    variant='contained'
                    sx={{ fontSize: '1.3rem' }}
                    onClick={() => onSubmit()}
                  >
                    Quick Update
                  </Button>
                </ToolTipStyle>
              ) : null}
            </Box>

            <TableStyle>
              <TableHeadStyle columns={columns} handleSorting={handleSorting}></TableHeadStyle>
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
                rowsPerPageOptions={[5, 10, 15]}
                page={page}
                count={totalRows}
                rowsPerPage={rowsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
              />
            ) : null}
          </Paper>
        </div>
      )}
    </>
  );
}

export default Discount;
