import HomeIcon from '@mui/icons-material/Home';
import LayersIcon from '@mui/icons-material/Layers';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DiscountIcon from '@mui/icons-material/Discount';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import { Box } from '@mui/material';

import classnames from 'classnames/bind';
import styles from './Sidebar.module.scss';

import Menu from './Menu';

const cx = classnames.bind(styles);

const NAV_LIST = [
  {
    subCategoty: '',
    children: [
      {
        icon: <HomeIcon />,
        title: 'Dashboard',
        to: '/dashboard',
      },
    ],
  },
  {
    subCategoty: 'Product',
    children: [
      {
        icon: <LayersIcon />,
        title: 'Category',
        to: '/category',
      },
      {
        icon: <LayersIcon />,
        title: 'Supplier',
        to: '/supplier',
      },
      {
        icon: <ListAltIcon />,
        title: 'Product',
        to: '/',
      },
      {
        icon: <InventoryIcon />,
        title: 'Inventory',
        to: '/',
      },
      {
        icon: <DiscountIcon />,
        title: 'Discount',
        to: '/',
      },
    ],
  },
  {
    subCategoty: 'Customer',
    children: [
      {
        icon: <PeopleIcon />,
        title: 'Customer',
        to: '/',
      },
    ],
  },
  {
    subCategoty: 'Staff',
    children: [
      {
        icon: <PeopleIcon />,
        title: 'Staff',
        to: '/',
      },
    ],
  },
];

function Sidebar() {
  return (
    <Box className={cx('wrapper')}>
      {NAV_LIST
        ? NAV_LIST.map((item, index) => <Menu key={index} items={item}></Menu>)
        : ''}
    </Box>
  );
}

export default Sidebar;
