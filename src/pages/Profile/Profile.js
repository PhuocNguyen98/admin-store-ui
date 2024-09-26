import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
// import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useForm } from 'react-hook-form';
import { useState, useEffect, useRef } from 'react';

import dayjs from 'dayjs';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast, ToastContainer } from 'react-toastify';

import SelectStyle from '~/components/SelectStyle';
import CKEditorStyle from '~/components/CKEditorStyle';
import DatePickerStyle from '~/components/DatePickerStyle';
import BreadcrumbStyle from '~/components/BreadcrumbStyle';
import TextFieldStyle from '~/components/FormStyle/TextFieldStyle';
import TypographyStyle from '~/components/FormStyle/TypographyStyle';

import images from '~/assets/img';

import { getUserProfileApi, updateUserProfileApi } from '~/api/userApi';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import CreateIcon from '@mui/icons-material/Create';

import classnames from 'classnames/bind';
import styles from './Profile.module.scss';

const cx = classnames.bind(styles);

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const optionsGender = [
  { title: 'Male', value: 1 },
  { title: 'Female', value: 2 },
  { title: 'Orther', value: 0 },
];

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const schemaUser = yup.object().shape({
  userFirstName: yup.string(),
  userLastName: yup.string(),
  userGender: yup.string(),
  userBirthday: yup.string(),
  userEmail: yup.string().email('Email must be a valid email').nullable(),
  userPhone: yup
    .string()
    .matches(phoneRegExp, { message: 'Phone number is not valid', excludeEmptyString: true })
    .max(10, 'Phone must be at most 10 characters')
    .nullable(),
  userAddress: yup.string(),
  userEducation: yup.string(),
  userInformation: yup.string(),
  userAvatar: yup.array(),
});

function Profile() {
  const [avatar, setAvatar] = useState();
  const [textValue, setTextValue] = useState(''); // Save text CKEditor
  const { control, setValue, handleSubmit } = useForm({
    defaultValues: {
      userFirstName: '',
      userLastName: '',
      userGender: '',
      userEmail: '',
      userPhone: '',
      userAddress: '',
      userEducation: '',
      userInformation: '',
      userBirthday: dayjs(),
      userAvatar: [],
    },
    resolver: yupResolver(schemaUser),
  });

  // Get data by id category
  const getDataById = async () => {
    try {
      const res = await getUserProfileApi();
      if (res?.status === 200 && res?.data) {
        setValue('userFirstName', res.data[0].first_name ? res.data[0].first_name : '');
        setValue('userLastName', res.data[0].last_name ? res.data[0].last_name : '');
        setValue('userGender', res.data[0].gender ? res.data[0].gender : '');
        setValue('userEmail', res.data[0].email ? res.data[0].email : '');
        setValue('userPhone', res.data[0].phone ? res.data[0].phone : '');
        setValue('userAddress', res.data[0].address ? res.data[0].address : '');
        setValue('userEducation', res.data[0].education ? res.data[0].education : '');
        setValue(
          'userBirthday',
          res.data[0].birthday ? dayjs(res.data[0].birthday, 'DD-MM-YYYY') : '',
        );
        setTextValue(res.data[0].information ? res.data[0].information : '');
        setAvatar(res.data[0].avatar);
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  /////////////////////////
  const inputFileRef = useRef(null);
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClickFile = () => {
    inputFileRef.current.click();
  };

  const handleChangeAvatar = (e) => {
    Object.assign(e.target.files[0], {
      preview: URL.createObjectURL(e.target.files[0]),
    });
    setAvatar(e.target.files[0]);
  };

  const handleSaveInformation = handleSubmit(async (data) => {
    let formData = new FormData();
    formData.append('userFirstName', data.userFirstName);
    formData.append('userLastName', data.userLastName);
    formData.append('userGender', data.userGender);
    formData.append('userEmail', data.userEmail);
    formData.append('userPhone', data.userPhone);
    formData.append('userAddress', data.userAddress);
    formData.append('userEducation', data.userEducation);
    formData.append('userInformation', data.userInformation);
    formData.append('userBirthday', data.userBirthday);
    formData.append('userAvatar', avatar ?? []);

    console.log([...formData]);
    try {
      const res = await updateUserProfileApi(formData);
      res?.status === 200 ? toast.success(res?.message) : toast.error(res?.message);
    } catch (error) {
      toast.error(error?.message);
    }
  });

  //////////////////////
  useEffect(() => {
    getDataById();

    return () => {
      if (avatar) URL.revokeObjectURL(avatar);
    };
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <ToastContainer />
      <Box>
        <BreadcrumbStyle />
        <Typography
          variant='h3'
          component='h4'
          sx={{
            fontWeight: 600,
            color: 'text.primary',
          }}
        >
          Profile
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleChange}>
          <Tab label='Information' {...a11yProps(0)} />
          <Tab label='Password' {...a11yProps(1)} />
        </Tabs>
      </Box>

      <CustomTabPanel value={tabValue} index={0}>
        <Paper elevation={1} sx={{ p: '30px' }}>
          <Grid container spacing={3}>
            <Grid item container xs={12} xl={4}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Badge
                    overlap='circular'
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    sx={{ position: 'relative' }}
                    badgeContent={
                      <button className={cx('btn-img')} onClick={() => handleClickFile()}>
                        <CreateIcon sx={{ fontSize: '2rem', color: '#fff' }} />
                      </button>
                    }
                  >
                    <Avatar
                      alt=''
                      src={
                        avatar ? (avatar?.preview ? avatar.preview : avatar) : images.imgPlacehoder
                      }
                      sx={{ width: 280, height: 280, border: '1px solid #ccc' }}
                    />
                  </Badge>
                  <input
                    type='file'
                    ref={inputFileRef}
                    style={{ display: 'none' }}
                    onChange={(e) => handleChangeAvatar(e)}
                  ></input>
                </Box>
              </Grid>
            </Grid>

            <Grid item container xs={12} xl={8} spacing={2}>
              <Grid item xs={12} xl={6}>
                <TypographyStyle component='label' variant='h5' htmlFor='userFirstName'>
                  First Name
                </TypographyStyle>
                <TextFieldStyle control={control} name='userFirstName' placeholder='First name' />
              </Grid>

              <Grid item xs={12} xl={6}>
                <TypographyStyle component='label' variant='h5' htmlFor='userLastName'>
                  Last name
                </TypographyStyle>
                <TextFieldStyle control={control} name='userLastName' placeholder='Last name' />
              </Grid>

              <Grid item xs={12} xl={6}>
                <TypographyStyle component='label' variant='h5' htmlFor='userGender'>
                  Gender
                </TypographyStyle>
                <SelectStyle
                  control={control}
                  name='userGender'
                  options={optionsGender}
                  title='Chọn giới tính'
                />
              </Grid>

              <Grid item xs={12} xl={6}>
                <TypographyStyle component='label' variant='h5' htmlFor='userBirthday'>
                  Birthday
                </TypographyStyle>
                <DatePickerStyle control={control} name='userBirthday' />
              </Grid>

              <Grid item xs={12} xl={6}>
                <TypographyStyle component='label' variant='h5' htmlFor='userEmail'>
                  Email
                </TypographyStyle>
                <TextFieldStyle control={control} name='userEmail' placeholder='Email' />
              </Grid>

              <Grid item xs={12} xl={6}>
                <TypographyStyle component='label' variant='h5' htmlFor='userPhone'>
                  Phone
                </TypographyStyle>
                <TextFieldStyle control={control} name='userPhone' placeholder='Phone' />
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <TypographyStyle component='label' variant='h5' htmlFor='userAddress'>
                Address
              </TypographyStyle>
              <TextFieldStyle control={control} name='userAddress' placeholder='Address' />
            </Grid>

            <Grid item xs={12}>
              <TypographyStyle component='label' variant='h5' htmlFor='userEducation'>
                Education
              </TypographyStyle>
              <TextFieldStyle
                control={control}
                name='userEducation'
                placeholder='Education'
                multiline
                rows={5}
              />
            </Grid>

            <Grid item xs={12}>
              <TypographyStyle component='label' variant='h5' htmlFor='userInformation'>
                Additional information
              </TypographyStyle>

              <CKEditorStyle
                control={control}
                name='userInformation'
                textValue={textValue}
                setTextValue={setTextValue}
              />
            </Grid>
          </Grid>
          <Button
            variant='contained'
            sx={{ fontSize: '1.3rem', mt: 3 }}
            disabled={isSuccess}
            onClick={() => handleSaveInformation()}
          >
            {isSuccess ? (
              <>
                <CircularProgress size='14px' sx={{ mr: 1 }} />
                Save...
              </>
            ) : (
              'Save'
            )}
          </Button>
        </Paper>
      </CustomTabPanel>

      <CustomTabPanel value={tabValue} index={1}>
        Password
      </CustomTabPanel>
    </Box>
  );
}

export default Profile;
