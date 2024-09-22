import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';

import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useForm } from 'react-hook-form';
import { useState } from 'react';

import * as yup from 'yup';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';

import SelectStyle from '~/components/SelectStyle';
import TextFieldStyle from '~/components/FormStyle/TextFieldStyle';
import TypographyStyle from '~/components/FormStyle/TypographyStyle';
import OutlinedInputStyle from '~/components/FormStyle/OutlinedInputStyle';

import classname from 'classnames/bind';
import styles from './Staff.module.scss';

import { addStaffAccountApi } from '~/api/staffApi';

const cx = classname.bind(styles);

const optionRoles = [
  { title: 'Admin', value: 1 },
  { title: 'Trưởng phòng', value: 2 },
  { title: 'Nhân viên', value: 3 },
];

const schemaStaff = yup.object().shape({
  staffUsername: yup.string().required('Vui lòng nhập username'),
  staffPassword: yup
    .string()
    .min(8, 'Mật khẩu phải có tối thiểu 8 ký tự')
    .required('Vui lòng nhập password'),
  staffConfirmPassword: yup
    .string()
    .required('Vui lòng xác nhận lại mật khẩu')
    .oneOf([yup.ref('staffPassword'), null], 'Mật khẩu chưa trùng khớp'),
  staffRole: yup.string().required('Vui lòng chọn quyền hạn cho tài khoản'),
});

function StaffModal({ open, setOpen, setIsLoading }) {
  const [showPassword, setShowPassword] = useState(false);
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      staffUsername: '',
      staffPassword: '',
      staffConfirmPassword: '',
      staffRole: '',
    },
    resolver: yupResolver(schemaStaff),
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleClose = () => {
    setOpen(false);
    reset({
      staffUsername: '',
      staffPassword: '',
      staffConfirmPassword: '',
      staffRole: '',
    });
  };

  const handleAdd = handleSubmit(async (data) => {
    try {
      const result = await addStaffAccountApi(data);
      if (result.status === 201) {
        reset({
          staffUsername: '',
          staffPassword: '',
          staffConfirmPassword: '',
          staffRole: '',
        });
        setOpen(false);
        toast.success(result.message);
        setIsLoading(true);
      }
    } catch (error) {
      toast.error(error.message);
    }
  });

  return (
    <div className='wrapper'>
      <Modal open={open} onClose={() => handleClose()}>
        <Box
          sx={{ bgcolor: 'background.paper', boxShadow: 24 }}
          className={cx('modal')}
        >
          <Box>
            <Box>
              <Typography
                variant='h3'
                component='h4'
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                }}
              >
                Staffs
              </Typography>
              <Typography
                variant='subtitle1'
                component='span'
                gutterBottom
                sx={{
                  fontSize: '1.4rem',
                  color: '#919aa3',
                  display: 'inline-flex',
                  paddingBottom: 1,
                }}
              >
                Create account staff for the system
              </Typography>
            </Box>
            <IconButton
              aria-label='close'
              onClick={() => handleClose()}
              sx={(theme) => ({
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
              })}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TypographyStyle
                component='label'
                htmlFor='staffUsername'
                variant='h5'
                isRequired={true}
              >
                Username
              </TypographyStyle>
              <TextFieldStyle
                control={control}
                name='staffUsername'
                placeholder='Username'
              />
            </Grid>

            <Grid item xs={12}>
              <TypographyStyle
                component='label'
                htmlFor='staffPassword'
                variant='h5'
                isRequired={true}
              >
                Password
              </TypographyStyle>

              <FormControl fullWidth>
                <OutlinedInputStyle
                  control={control}
                  name='staffPassword'
                  placeholder='Password'
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
                htmlFor='staffConfirmPassword'
                variant='h5'
                isRequired={true}
              >
                Confirm Password
              </TypographyStyle>

              <FormControl fullWidth>
                <OutlinedInputStyle
                  control={control}
                  name='staffConfirmPassword'
                  placeholder='Confirm password'
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
                htmlFor='staffRole'
                variant='h5'
                isRequired={true}
              >
                Role
              </TypographyStyle>

              <SelectStyle
                control={control}
                name='staffRole'
                options={optionRoles}
                title='Chọn quyền hạn cho tài khoản'
              />
            </Grid>
          </Grid>

          <Button
            variant='contained'
            sx={{ fontSize: '1.3rem', mt: 3 }}
            onClick={() => handleAdd()}
          >
            Create account
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default StaffModal;
