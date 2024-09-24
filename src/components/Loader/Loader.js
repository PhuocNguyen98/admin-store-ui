import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import classname from 'classnames/bind';
import styles from './Loader.module.scss';

const cx = classname.bind(styles);

function Loader() {
  return (
    <>
      <Box className={cx('wrapper')}>
        <Box className={cx('inner')}>
          <CircularProgress size={50} />
          <Typography variant='h5' component='h3' mt={2}>
            Loading...
          </Typography>
        </Box>
      </Box>
    </>
  );
}

export default Loader;
