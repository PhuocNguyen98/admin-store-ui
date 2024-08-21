import Divider from '@mui/material/Divider';
import { ListItemIcon, Menu, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const MenuItemCustom = styled(MenuItem)(({ theme }) => ({
  fontSize: '1.6rem',
  color: theme.palette.text.primary,
  padding: '10px 16px',
}));

function MenuStyle({ items = [], anchorEl, open, onClick, onClose }) {
  const renderItems = () => {
    if (items) {
      return items.map((item, index) => (
        <Link key={index} to={item.to}>
          <MenuItemCustom>
            <ListItemIcon>{item.icon}</ListItemIcon>
            {item.title}
          </MenuItemCustom>
          {item.separate ? <Divider /> : ''}
        </Link>
      ));
    }
  };

  return (
    <Menu
      anchorEl={anchorEl}
      id="account-menu"
      open={open}
      onClose={onClick}
      onClick={onClose}
      PaperProps={{
        elevation: 0,
        sx: {
          minWidth: 200,
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          mt: 1.5,
          '&::before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      {renderItems()}
    </Menu>
  );
}

export default MenuStyle;
