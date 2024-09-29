import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

function BackdropStyle({ open = true, title = 'Loading...' }) {
  return (
    <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={open}>
      <Box>
        <CircularProgress size={50} color='inherit' />
        <Typography variant='h5' component='h3' mt={2}>
          {title}
        </Typography>
      </Box>
    </Backdrop>
  );
}

export default BackdropStyle;
