import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
// import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
// import FormControlLabel from '@mui/material/FormControlLabel';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';

import config from '~/config';
// import images from '~/assets/img';

import classNames from 'classnames/bind';
import styles from './Login.module.scss';

import { loginStaff } from '~/api/authApi';
import { toast, ToastContainer } from 'react-toastify';

const cx = classNames.bind(styles);
const loginSchema = yup.object({
  username: yup.string().required('Vui lòng nhập Username'),
  password: yup.string().required('Vui lòng nhập Password'),
});

const themeLogin = createTheme({
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '1.6rem',
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: '1.6rem',
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: '1.4rem',
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: '1.1rem',
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: '2rem',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '1.6rem',
        },
      },
    },
  },
});

function Login({ setToken }) {
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: yupResolver(loginSchema),
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await loginStaff(data);
      if (res?.status === 200) {
        toast.success(res?.message);
        setToken(res?.access_token);
        navigate(config.routes.dashboard);
      } else {
        toast.error(res?.message ?? 'error');
      }
    } catch (error) {
      toast.error(error?.message ?? 'error');
    }
  });

  return (
    <ThemeProvider theme={themeLogin}>
      <ToastContainer style={{ fontSize: '1.4rem' }} />
      <div className={cx('wrapper')}>
        <Container
          component='main'
          maxWidth='xs'
          sx={{
            display: 'flex',
          }}
          className={cx('inner')}
        >
          <CssBaseline />
          {/* <img src={images.logo} alt='Logo' className={cx('logo')} /> */}
          <Box
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            className={cx('body')}
          >
            <Typography component='h1' variant='h2' className={cx('title')}>
              Login
            </Typography>

            <Box component='form' action='POST' sx={{ mt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    name='username'
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        name='username'
                        fullWidth
                        id='username'
                        label='Username'
                        placeholder='Username'
                        value={value}
                        onChange={onChange}
                        error={error ? true : false}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    name='password'
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <FormControl error={error ? true : false} fullWidth variant='outlined'>
                        <InputLabel htmlFor='outlined-adornment-password'>Password</InputLabel>
                        <OutlinedInput
                          id='password'
                          placeholder='Password'
                          type={showPassword ? 'text' : 'password'}
                          onChange={onChange}
                          value={value}
                          endAdornment={
                            <InputAdornment position='end'>
                              <IconButton
                                onClick={() => handleClickShowPassword()}
                                onMouseDown={(e) => handleMouseDownPassword(e)}
                                edge='end'
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          }
                          label='Password'
                        />
                        {error ? (
                          <FormHelperText id='component-helper-text'>
                            {error?.message}
                          </FormHelperText>
                        ) : (
                          ''
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                {/* <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Checkbox value='allowRememberMe' color='primary' />
                    }
                    label='Remember me'
                  />
                </Grid> */}
                {/* <Grid item xs={6} className={cx('forgot-password')}>
                  <Link
                    to=''
                    onClick={() => alert('Chức năng đang phát triển')}
                  >
                    Forgot password ?
                  </Link>
                </Grid> */}
              </Grid>
              <Button
                type='button'
                fullWidth
                variant='contained'
                sx={{ mt: 3, mb: 2 }}
                onClick={() => onSubmit()}
              >
                Login
              </Button>
              {/* <Grid container justifyContent='center'>
                <Grid item>
                  <p>
                    Already have an account?
                    <Link to={config.routes.signup}>&nbsp; Signup</Link>
                  </p>
                </Grid>
              </Grid> */}
              <Box justifyContent='flex-start'>
                <Typography component='h5' variant='h5' className={cx('title')}>
                  Thông tin tài khoản test
                </Typography>
                <Typography component='h6' variant='h6' className={cx('title')}>
                  Username: user
                </Typography>
                <Typography component='h6' variant='h6' className={cx('title')}>
                  Password: user@123
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
}

Login.propTypes = {
  setToken: PropTypes.func,
};

export default Login;
