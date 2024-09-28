import classnames from 'classnames/bind';
import styles from './Header.module.scss';
import Box from '@mui/material/Box';
// import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Logout from '@mui/icons-material/Logout';
// import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import images from '~/assets/img';
import config from '~/config';
import MenuStyle from '~/components/PopperStyle/MenuStyle';

import { getAccountStaff } from '~/api/authApi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataSuccess } from '~/store/actions/userActions';
import { toast } from 'react-toastify';

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
  const dispatch = useDispatch();
  const dataUser = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const refLogo = useRef();
  const [showSidebar, setShowSidebar] = useState(false);

  // const handleClickMenu = () => {
  //   if (showSidebar) {
  //     refLogo.current.style.width = '240px';
  //   } else {
  //     refLogo.current.style.width = '150px';
  //   }
  //   setShowSidebar(!showSidebar);
  // };

  const getInfoAccount = async () => {
    try {
      const res = await getAccountStaff();
      if (res?.status === 200 && res?.data) {
        dispatch(fetchDataSuccess(res.data));
        toast.success(res?.message);
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    if (!Object.keys(dataUser.data).length > 0) {
      getInfoAccount();
    }
  }, [Object.keys(dataUser.data).length]);

  return (
    <>
      <Box className={cx('wrapper')}>
        <Box className={cx('logo')} ref={refLogo}>
          <Link to={config.routes.dashboard}>
            <img src={images.logo1} alt='Logo' />
          </Link>
        </Box>

        {Object.keys(dataUser.data).length > 0 ? (
          <Box
            sx={{
              flex: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingLeft: 1,
              paddingRight: 6,
            }}
          >
            {/* <Box>
              <IconButton size='large' onClick={() => handleClickMenu()}>
                <MenuIcon fontSize='large' />
              </IconButton>
            </Box> */}
            <Box
              onClick={(e) => handleClick(e)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                ':hover': {
                  cursor: 'pointer',
                },
              }}
            >
              <Avatar
                sx={{ width: 40, height: 40 }}
                src={dataUser.data?.avatar ? dataUser.data.avatar : images.staffPlacehoder}
                alt='Avatar'
              />

              <Typography
                component='span'
                variant='h5'
                sx={{
                  pl: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {dataUser.data?.username}
                <KeyboardArrowDownIcon sx={{ ml: 0.5 }} />
              </Typography>
            </Box>
          </Box>
        ) : null}

        <MenuStyle
          items={MENU_ITEMS}
          anchorEl={anchorEl}
          open={open}
          onClick={handleClose}
          onClose={handleClose}
        ></MenuStyle>
      </Box>
    </>
  );
}

export default Header;
