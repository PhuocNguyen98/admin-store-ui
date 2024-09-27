import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';

import { useForm } from 'react-hook-form';
import { useState, useEffect, useRef } from 'react';

import dayjs from 'dayjs';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast, ToastContainer } from 'react-toastify';

import SelectStyle from '~/components/SelectStyle';
import CKEditorStyle from '~/components/CKEditorStyle';
import DatePickerStyle from '~/components/DatePickerStyle';
import TextFieldStyle from '~/components/FormStyle/TextFieldStyle';
import TypographyStyle from '~/components/FormStyle/TypographyStyle';

import images from '~/assets/img';

import { getUserProfileApi, updateUserProfileApi } from '~/api/userApi';

import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import CreateIcon from '@mui/icons-material/Create';

import classnames from 'classnames/bind';
import styles from './Profile.module.scss';

const cx = classnames.bind(styles);

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

function InformationForm() {
  const inputFileRef = useRef(null);
  const [avatar, setAvatar] = useState();
  const [open, setOpen] = useState(false);
  const [textValue, setTextValue] = useState(''); // Save text CKEditor
  const [isSuccess, setIsSuccess] = useState(false);
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

  // Handle open actions edit avatar
  const handleOpenEditPhoto = () => {
    setOpen(!open);
  };

  // Css
  const listActionsAvatar = cx('list-actions', {
    'open-edit': open,
  });

  // Handle open upload file
  const handleUploadAvatar = () => {
    inputFileRef.current.click();
  };

  // Handle change avatar
  const handleChangeAvatar = (e) => {
    Object.assign(e.target.files[0], {
      preview: URL.createObjectURL(e.target.files[0]),
    });
    setAvatar(e.target.files[0]);
  };

  // Handle remove avatar
  const handleRemoveAvatar = () => {
    setAvatar([]);
  };

  // Handle submit data
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

    // console.log([...formData]);
    try {
      setIsSuccess(true);
      const res = await updateUserProfileApi(formData);
      res?.status === 200 ? toast.success(res?.message) : toast.error(res?.message);
      setIsSuccess(false);
    } catch (error) {
      setIsSuccess(false);
      toast.error(error?.message);
    }
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

  useEffect(() => {
    getDataById();

    return () => {
      if (avatar) URL.revokeObjectURL(avatar);
    };
  }, []);

  return (
    <>
      <ToastContainer />
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
                    <div className={cx('edit-photo')} onClick={() => handleOpenEditPhoto()}>
                      <CreateIcon sx={{ fontSize: '1.4rem', color: '#fff' }} />
                      <span className={cx('edit-title')}>Edit</span>
                      <div className={listActionsAvatar}>
                        <button className={cx('btn-action')} onClick={() => handleUploadAvatar()}>
                          <CreateIcon sx={{ fontSize: '1.4rem', color: '#fff' }} />
                          <span>Upload a photo</span>
                        </button>
                        <button className={cx('btn-action')} onClick={() => handleRemoveAvatar()}>
                          <DeleteIcon sx={{ fontSize: '1.4rem', color: '#fff' }} />
                          <span>Remove photo</span>
                        </button>
                      </div>
                    </div>
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

export default InformationForm;
