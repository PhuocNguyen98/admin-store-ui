import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';

import MenuItem from './MenuItem';

function Menu({ items = {} }) {
  return (
    <>
      {items ? (
        <List
          sx={{ width: '100%', maxWidth: 240 }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader
              component="div"
              sx={{
                backgroundColor: '#404e67',
                fontSize: '1.4rem',
                color: '#999',
              }}
            >
              {items?.subCategoty}
            </ListSubheader>
          }
        >
          {items?.children ? <MenuItem items={items.children}></MenuItem> : ''}
        </List>
      ) : (
        ''
      )}
    </>
  );
}

export default Menu;
