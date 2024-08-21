import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { Box } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import classnames from 'classnames/bind';
import styles from './Menu.module.scss';

const cx = classnames.bind(styles);

const theme = createTheme({
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: '1.6rem',
          color: '#dcdcdc',
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 32,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontSize: '1.5rem',
          color: '#dcdcdc',
        },
      },
    },
  },
});

function MenuItem({ items = {} }) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const renderItems = (items) => {
    return items.map((item, index) => {
      const isParent = !!item?.children;
      return (
        <Box key={index}>
          {isParent ? (
            <>
              <ListItemButton onClick={handleClick}>
                <ListItemIcon>{item?.icon}</ListItemIcon>
                <ListItemText primary={item?.title} />
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pl: 4 }}>
                  {renderItems(item.children)}
                </List>
              </Collapse>
            </>
          ) : (
            <NavLink
              key={index}
              to={item?.to}
              className={(isActives) => cx({ active: isActives })}
            >
              <ListItemButton>
                <ListItemIcon>{item?.icon}</ListItemIcon>
                <ListItemText primary={item?.title} />
              </ListItemButton>
            </NavLink>
          )}
        </Box>
      );
    });
  };

  return (
    <ThemeProvider theme={theme}>
      {items ? renderItems(items) : ''}
    </ThemeProvider>
  );
}

export default MenuItem;
