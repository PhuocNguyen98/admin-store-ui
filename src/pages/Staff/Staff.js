import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import VisibilityIcon from '@mui/icons-material/Visibility';
import ControlPointIcon from '@mui/icons-material/ControlPoint';

import { toast } from 'react-toastify';
import { useForm, useFieldArray } from 'react-hook-form';
import { useState, useEffect } from 'react';

import useDebounce from '~/hooks/useDebounce';

import Search from '~/components/Search';
import Loader from '~/components/Loader';
import TableStyle from '~/components/TableStyle';
import ToolTipStyle from '~/components/ToolTipStyle';
import BreadcrumbStyle from '~/components/BreadcrumbStyle';
import TableHeadStyle from '~/components/TableStyle/TableHeadStyle';
import TableBodyStyle from '~/components/TableStyle/TableBodyStyle';
import TablePaginationStyle from '~/components/TableStyle/TablePaginationStyle';

import { getStaffApi } from '~/api/staffApi';
import { updateStaffAccountApi } from '~/api/staffApi';

import StaffModal from './StaffModal';

// Define column table
const columns = [
  { label: 'STT', accessor: 'stt', component: 'text' },
  {
    label: 'Username',
    accessor: 'username',
    component: 'text',
    sortTable: true,
  },
  { label: 'Email', accessor: 'email', component: 'text', sortTable: true },
  {
    label: 'Office',
    accessor: 'role',
    component: 'text',
  },
  {
    label: 'Status',
    accessor: 'is_status',
    displayType: [
      { title: 'Vô hiệu hóa', value: 0 },
      { title: 'Đang kích hoạt', value: 1 },
    ],
    editTable: true,
    component: 'select',
  },
  { label: 'Actions', accessor: 'actions', component: 'actions' },
];

// Define column action table
const actions = [
  {
    icon: <VisibilityIcon />,
    title: 'View',
    to: '/staff/view',
    css: {
      color: 'info',
    },
  },
];

function Staff() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState('id');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(0); // Chỉ mục của số trang hiện tại( số 0 tương ứng với trang 1 )
  const [totalRows, setTotalRows] = useState(-1); //Tổng số hàng
  const [rowsPerPage, setRowsPerPage] = useState(5); // Số lượng hàng trên 1 trang
  const [pageCurrent, setPageCurrent] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const debounceValue = useDebounce(searchValue, 500);
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

  // Handle open modal
  const handleOpen = () => setOpen(true);

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
      const res = await getStaffApi(searchValue, sort, order, pageCurrent, rowsPerPage);
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateStaffAccountApi(data);
      if (res?.status === 200) {
        res?.flag ? toast.info(res?.message) : toast.success(res?.message);
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  });

  useEffect(() => {
    getDataApi();
  }, [debounceValue, order, sort, rowsPerPage, pageCurrent, isLoading]);

  return (
    <>
      {!data.length > 0 && isLoading ? (
        <Loader />
      ) : (
        <div className='wrapper'>
     
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
                Staffs
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
                Manage your staffs
              </Typography>
            </Box>
            <Button
              variant='contained'
              sx={{ fontSize: '1.3rem' }}
              startIcon={<ControlPointIcon />}
              onClick={handleOpen}
            >
              Create account
            </Button>
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
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Search label='Search staff username or email' handleSearch={handleSearch} />
              {data.length > 0 ? (
                <ToolTipStyle title='Quickly update status staff account'>
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

          <StaffModal open={open} setOpen={setOpen} setIsLoading={setIsLoading} />
        </div>
      )}
    </>
  );
}

export default Staff;
