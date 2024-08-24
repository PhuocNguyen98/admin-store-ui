import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

import ControlPointIcon from '@mui/icons-material/ControlPoint';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { Link } from 'react-router-dom';

import TableStyle from '~/components/TableStyle';
import config from '~/config';

const DATA_CATEGORY = [
  {
    id: 1,
    full_name: 'Nguyễn Hữu Phước',
    email: 'bt.phuocnguyen@gmail.com',
    gender: 'Female',
    age: 26,
    start_date: '2022-01-20',
  },
  {
    id: 2,
    full_name: 'Lê Thị B',
    email: 'lethi@gmail.com',
    gender: 'Male',
    age: 30,
    start_date: '2022-09-18',
  },
  {
    id: 3,
    full_name: 'Huỳnh Văn C',
    email: 'huynhvan@gmail.com',
    gender: 'Female',
    age: 22,
    start_date: '2021-10-05',
  },
  {
    id: 4,
    full_name: 'Nguyễn Hữu Phước',
    email: 'bt.phuocnguyen@gmail.com',
    gender: 'Female',
    age: 26,
    start_date: '2022-01-20',
  },
  {
    id: 5,
    full_name: 'Lê Thị B',
    email: 'lethi@gmail.com',
    gender: 'Male',
    age: 30,
    start_date: '2022-09-18',
  },
  {
    id: 6,
    full_name: 'Huỳnh Văn C',
    email: 'huynhvan@gmail.com',
    gender: 'Female',
    age: 22,
    start_date: '2021-10-05',
  },
  {
    id: 7,
    full_name: 'Nguyễn Hữu Phước',
    email: 'bt.phuocnguyen@gmail.com',
    gender: 'Female',
    age: 26,
    start_date: '2022-01-20',
  },
  {
    id: 8,
    full_name: 'Lê Thị B',
    email: 'lethi@gmail.com',
    gender: 'Male',
    age: 30,
    start_date: '2022-09-18',
  },
  {
    id: 9,
    full_name: 'Huỳnh Văn C',
    email: 'huynhvan@gmail.com',
    gender: 'Female',
    age: 22,
    start_date: '2021-10-05',
  },
];

const columns = [
  { label: 'ID', accessor: 'id', sortTable: true, sortbyOrder: 'asc' }, // sortbyOrder => cột được chỉ định sắp xếp trong lần đầu
  { label: 'Full Name', accessor: 'full_name', sortTable: true },
  { label: 'Email', accessor: 'email', sortTable: true },
  { label: 'Gender', accessor: 'gender', sortTable: false },
  { label: 'Age', accessor: 'age', sortTable: true },
  { label: 'Start date', accessor: 'start_date', sortTable: false },
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
        {DATA_CATEGORY ? (
          <TableStyle
            titleInputSearch='Search by category name'
            columns={columns}
            data={DATA_CATEGORY}
            actions={actions}
          />
        ) : (
          ''
        )}
      </Paper>
    </div>
  );
}

export default Category;
