import classnames from 'classnames/bind';
import styles from './Header.module.scss';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import images from '~/assets/img';
import config from '~/config';
import MenuStyle from '~/components/PopperStyle/MenuStyle';

const cx = classnames.bind(styles);

const MENU_ITEMS = [
  {
    icon: <AccountCircleIcon fontSize="large" />,
    title: 'Profile',
    to: '/',
  },
  {
    icon: <Settings fontSize="large" />,
    title: 'Settings',
    to: '/',
  },
  {
    icon: <Logout fontSize="large" />,
    title: 'Logout',
    to: config.routes.logout,
    separate: true,
  },
];

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box className={cx('wrapper')}>
      <Box className={cx('logo')}>
        <Link to={config.routes.dashboard}>
          <img src={images.logo1} alt="Logo" />
        </Link>
      </Box>
      <Box
        flex="1"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          paddingLeft: 1,
          paddingRight: 6,
        }}
      >
        <Box>
          <IconButton size="large" onClick={() => alert(1)}>
            <MenuIcon fontSize="large" />
          </IconButton>
        </Box>
        <Box onClick={handleClick}>
          <IconButton
            size="small"
            sx={{
              border: '1px solid #ddd',
              ':hover': {
                background: 'transparent',
              },
            }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar
              sx={{ width: 32, height: 32 }}
              src={images.avatar}
              alt="Avatar"
            />
          </IconButton>
          <Typography
            component="span"
            variant="h5"
            sx={{
              pl: 1,
              ':hover': {
                cursor: 'pointer',
              },
            }}
          >
            PhuocNguyen
          </Typography>
        </Box>
      </Box>
      <MenuStyle
        items={MENU_ITEMS}
        anchorEl={anchorEl}
        open={open}
        onClick={handleClose}
        onClose={handleClose}
      ></MenuStyle>
    </Box>
  );
}

export default Header;
