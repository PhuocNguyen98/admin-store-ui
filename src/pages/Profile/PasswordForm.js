import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';

import TypographyStyle from '~/components/FormStyle/TypographyStyle';
import OutlinedInputStyle from '~/components/FormStyle/OutlinedInputStyle';

import config from '~/config';
import useToken from '~/hooks/useToken';
import { changeUserPasswordApi } from '~/api/userApi';

const schemaUserPassword = yup.object().shape({
  userPasswordOld: yup.string().required('Please enter password old'),
  userPasswordNew: yup.string().required('Please enter password new'),
  userPasswordNewConfirm: yup
    .string()
    .required('Please confirm password new')
    .oneOf([yup.ref('userPasswordNew'), null], 'Password new does not match'),
});

function PasswordForm() {
  const navigate = useNavigate();
  const { clearToken } = useToken();
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      userPasswordOld: '',
      userPasswordNew: '',
      userPasswordNewConfirm: '',
    },
    resolver: yupResolver(schemaUserPassword),
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleSavePassword = handleSubmit(async (data) => {
    try {
      setIsSuccess(true);
      const res = await changeUserPasswordApi(data);
      if (res?.status === 200) {
        toast.success(res?.message);
        clearToken();
        setTimeout(() => {
          navigate(config.routes.logout);
        }, 1000);
      } else {
        toast.error(res?.message);
      }
      setIsSuccess(false);
    } catch (error) {
      toast.error(error?.message);
    }
  });

  return (
    <>
   
      <Paper elevation={1} sx={{ p: '30px' }}>
        <Grid container spacing={3}>
          <Grid item container xs={12} xl={6} spacing={2}>
            <Grid item xs={12}>
              <TypographyStyle
                component='label'
                htmlFor='userPasswordOld'
                variant='h5'
                isRequired={true}
              >
                Password old
              </TypographyStyle>

              <FormControl fullWidth>
                <OutlinedInputStyle
                  control={control}
                  name='userPasswordOld'
                  placeholder='Password old'
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={() => handleClickShowPassword()}
                        onMouseDown={(e) => handleMouseDownPassword(e)}
                        onMouseUp={(e) => handleMouseUpPassword(e)}
                        edge='end'
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TypographyStyle
                component='label'
                htmlFor='userPasswordNew'
                variant='h5'
                isRequired={true}
              >
                Password new
              </TypographyStyle>

              <FormControl fullWidth>
                <OutlinedInputStyle
                  control={control}
                  name='userPasswordNew'
                  placeholder='Password new'
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={() => handleClickShowPassword()}
                        onMouseDown={(e) => handleMouseDownPassword(e)}
                        onMouseUp={(e) => handleMouseUpPassword(e)}
                        edge='end'
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TypographyStyle
                component='label'
                htmlFor='userPasswordNewConfirm'
                variant='h5'
                isRequired={true}
              >
                Confirm password new
              </TypographyStyle>

              <FormControl fullWidth>
                <OutlinedInputStyle
                  control={control}
                  name='userPasswordNewConfirm'
                  placeholder='Password new confirm'
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={() => handleClickShowPassword()}
                        onMouseDown={(e) => handleMouseDownPassword(e)}
                        onMouseUp={(e) => handleMouseUpPassword(e)}
                        edge='end'
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Button
          variant='contained'
          sx={{ fontSize: '1.3rem', mt: 3 }}
          disabled={isSuccess}
          onClick={() => handleSavePassword()}
        >
          {isSuccess ? (
            <>
              <CircularProgress size='14px' sx={{ mr: 1 }} />
              Save change...
            </>
          ) : (
            'Save change'
          )}
        </Button>
      </Paper>
    </>
  );
}

export default PasswordForm;
