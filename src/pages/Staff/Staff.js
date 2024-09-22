import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import VisibilityIcon from '@mui/icons-material/Visibility';
import ControlPointIcon from '@mui/icons-material/ControlPoint';

import { toast, ToastContainer } from 'react-toastify';
import { useForm, useFieldArray } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';

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
    label: 'Role',
    accessor: 'role_id',
    displayType: [
      { title: 'Admin', value: 1 },
      { title: 'Trưởng phòng', value: 2 },
      { title: 'Nhân viên', value: 3 },
    ],
    editTable: true,
    component: 'select',
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
  const [isLoading, setIsLoading] = useState(false);
  const { control, setValue, handleSubmit } = useForm({
    defaultValues: {
      formList: [],
    },
  });
  const { fields } = useFieldArray({
    control,
    name: 'formList',
  });

  // State sort
  const { sortField, order, setSortField, setOrder } = useSortTable(
    'id',
    'desc',
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
    const res = await getStaffApi(order, sort, page, rowsPerPage, search);
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
  }, [debounceValue, isLoading]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const result = await updateStaffAccountApi(data);
      if (result.status === 200) {
        if (result?.flag) {
          toast.info(result.message);
        } else {
          toast.success(result.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  });

  const handleOpen = () => setOpen(true);

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
          <Search label='Search staff username' handleSearch={handleSearch} />
          {data.length > 0 ? (
            <ToolTipStyle title='Cập nhật nhanh quyền và trạng thái'>
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

      <StaffModal open={open} setOpen={setOpen} setIsLoading={setIsLoading} />
    </div>
  );
}

export default Staff;
