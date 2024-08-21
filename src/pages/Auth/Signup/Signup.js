import classNames from 'classnames/bind';
import styles from './Signup.module.scss';
import {
  Container,
  CssBaseline,
  Box,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  TextField,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Button,
} from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import images from '~/assets/img';
import config from '~/config';

const cx = classNames.bind(styles);
const signupSchema = yup.object({
  username: yup.string().required('Vui lòng nhập tên đăng nhập'),
  email: yup
    .string()
    .required('Vui lòng nhập email')
    .email('Vui lòng kiểm tra lại email'),
  password: yup
    .string()
    .min(3, 'Mật khẩu phải có ít nhất 8 ký tự')
    .required('Vui lòng nhập mật khẩu'),
  confirmPassword: yup
    .string()
    .label('confirm password')
    .required('Vui lòng xác nhận lại mật khẩu')
    .oneOf([yup.ref('password'), null], 'Mật khẩu chưa trùng khớp'),
  acceptTermsConditions: yup
    .bool()
    .oneOf([true], 'Bạn phải chấp nhận các điều khoản và điều kiện'),
});

function Signup() {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTermsConditions: false,
    },
    resolver: yupResolver(signupSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((showPassword) => !showPassword);
  };
  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <div className={cx('wrapper')}>
      <div className={cx('inner')}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box>
            <img src={images.logo} alt="Logo" className={cx('logo')} />
            <Box>
              <Typography component="h1" variant="h2" textAlign="center">
                Signup
              </Typography>
              <Typography
                component="p"
                variant="string"
                textAlign="center"
                sx={{ mt: 1 }}
              >
                Please fill in this form to create an account.
              </Typography>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    name="username"
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextField
                        id="username"
                        label="UserName"
                        fullWidth
                        variant="outlined"
                        onChange={onChange}
                        value={value}
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    name="email"
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextField
                        id="email"
                        label="Email"
                        fullWidth
                        variant="outlined"
                        onChange={onChange}
                        value={value}
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    name="password"
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <FormControl error={!!error} fullWidth variant="outlined">
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <OutlinedInput
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          onChange={onChange}
                          value={value}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => handleClickShowPassword()}
                                onMouseDown={(e) => handleMouseDownPassword(e)}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                          label="Password"
                        />
                        {error ? (
                          <FormHelperText id="component-helper-text">
                            {error?.message}
                          </FormHelperText>
                        ) : (
                          ''
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    name="confirmPassword"
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <FormControl error={!!error} fullWidth variant="outlined">
                        <InputLabel htmlFor="confirmPassword">
                          Confirm Password
                        </InputLabel>
                        <OutlinedInput
                          id="confirmPassword"
                          type={showPassword ? 'text' : 'password'}
                          onChange={onChange}
                          value={value}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => handleClickShowPassword()}
                                onMouseDown={(e) => handleMouseDownPassword(e)}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                          label="Confirm Password"
                        />
                        {error ? (
                          <FormHelperText id="component-helper-text">
                            {error?.message}
                          </FormHelperText>
                        ) : (
                          ''
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    name="acceptTermsConditions"
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <>
                        <FormControlLabel
                          control={
                            <Checkbox
                              value={value}
                              onChange={onChange}
                              color="primary"
                            />
                          }
                          label={
                            <p>
                              I read and accept
                              <Link to="./">&nbsp; Terms & Conditions.</Link>
                            </p>
                          }
                        />
                        {error ? (
                          <FormHelperText error={!!error}>
                            {error?.message}
                          </FormHelperText>
                        ) : (
                          ''
                        )}
                      </>
                    )}
                  />
                </Grid>
              </Grid>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => onSubmit()}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="center">
                <Grid item>
                  <p>
                    Already have an account?
                    <Link to={config.routes.login}>&nbsp; Sign in</Link>
                  </p>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </div>
    </div>
  );
}

export default Signup;
