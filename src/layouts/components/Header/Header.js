import classnames from 'classnames/bind';
import styles from './Header.module.scss';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Logout from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import images from '~/assets/img';
import config from '~/config';
import MenuStyle from '~/components/PopperStyle/MenuStyle';
import useToken from '~/hooks/useToken';

import { getAccountStaff } from '~/api/authApi';

const cx = classnames.bind(styles);

const MENU_ITEMS = [
  {
    icon: <AccountCircleIcon fontSize='large' />,
    title: 'Profile',
    to: config.routes.profile,
    separate: true,
  },
  {
    icon: <Logout fontSize='large' />,
    title: 'Logout',
    to: config.routes.logout,
  },
];

function Header() {
  const { getAuth } = useToken();
  const userAuth = getAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [account, setAccount] = useState({});
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const refLogo = useRef();
  const [showSidebar, setShowSidebar] = useState(false);

  const handleClickMenu = () => {
    if (showSidebar) {
      refLogo.current.style.width = '240px';
    } else {
      refLogo.current.style.width = '150px';
    }
    setShowSidebar(!showSidebar);
  };

  const getInfoAccount = async () => {
    const res = await getAccountStaff();
    if (res?.data?.status === 200 && res.data?.account) {
      setAccount(res.data.account);
    }
  };

  useEffect(() => {
    getInfoAccount();
  }, [userAuth]);

  return (
    <Box className={cx('wrapper')}>
      <Box className={cx('logo')} ref={refLogo}>
        <Link to={config.routes.dashboard}>
          <img src={images.logo1} alt='Logo' />
        </Link>
      </Box>
      <Box
        flex='1'
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        sx={{
          paddingLeft: 1,
          paddingRight: 6,
        }}
      >
        <Box>
          <IconButton size='large' onClick={() => handleClickMenu()}>
            <MenuIcon fontSize='large' />
          </IconButton>
        </Box>
        <Box
          onClick={handleClick}
          sx={{
            ':hover': {
              cursor: 'pointer',
            },
          }}
        >
          <IconButton
            size='small'
            sx={{
              border: '1px solid #ddd',
              ':hover': {
                background: 'transparent',
              },
            }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar
              sx={{ width: 32, height: 32 }}
              src={account?.avatar ? account.avatar : images.staffPlacehoder}
              alt='Avatar'
            />
          </IconButton>
          {userAuth ? (
            <Typography
              component='span'
              variant='h5'
              sx={{
                pl: 1,
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              {account?.username}
              <KeyboardArrowDownIcon sx={{ ml: 0.5 }} />
            </Typography>
          ) : (
            ''
          )}
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
