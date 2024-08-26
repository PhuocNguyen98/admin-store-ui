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

import { useState, useEffect } from 'react';
import { getCategoryApi } from '~/api/categoryApi';

const columns = [
  { label: 'ID', accessor: 'id', sortTable: true, sortbyOrder: 'desc' }, // sortbyOrder => cột được chỉ định sắp xếp trong lần đầu
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
  const [data, setData] = useState(null);

  const getData = async () => {
    const res = await getCategoryApi();
    if (res) {
      setData(res.data);
    }
  };

  useEffect(() => {
    getData();
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
        {data ? (
          <TableStyle
            titleInputSearch='Search by category name'
            columns={columns}
            data={data}
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
