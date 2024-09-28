import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import dayjs from 'dayjs';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';

import SelectStyle from '~/components/SelectStyle';
import CKEditorStyle from '~/components/CKEditorStyle';
import DatePickerStyle from '~/components/DatePickerStyle';
import BreadcrumbStyle from '~/components/BreadcrumbStyle';
import TextFieldStyle from '~/components/FormStyle/TextFieldStyle';
import TypographyStyle from '~/components/FormStyle/TypographyStyle';

import images from '~/assets/img';

import { getStaffByIdApi } from '~/api/staffApi';

const optionsGender = [
  { title: 'Male', value: 1 },
  { title: 'Female', value: 2 },
  { title: 'Orther', value: 0 },
];

const schemaStaff = yup.object().shape({
  staffAvatar: yup.array(),
  staffFirstName: yup.string().required('Vui lòng nhập First name'),
  staffLastName: yup.string().required('Vui lòng nhập Last name'),
  staffGender: yup.string(),
  staffBirthday: yup.string(),
  staffEmail: yup.string(),
  staffPhone: yup.string(),
  staffAddress: yup.string(),
  staffEducation: yup.string(),
  staffInformation: yup.string(),
});

function StaffForm() {
  const { id } = useParams(); // Get id

  const [avatar, setAvatar] = useState();
  const [textValue, setTextValue] = useState(''); // Save text CKEditor

  const { control, setValue } = useForm({
    defaultValues: {
      staffAvatar: [],
      staffFirstName: '',
      staffLastName: '',
      staffGender: '',
      staffBirthday: dayjs(),
      staffEmail: '',
      staffPhone: '',
      staffAddress: '',
      staffEducation: '',
      staffInformation: '',
    },
    resolver: yupResolver(schemaStaff),
  });

  // Get data by id category
  const getDataById = async (id) => {
    try {
      const result = await getStaffByIdApi(id);
      if (result.status === 200) {
        setValue(
          'staffFirstName',
          result.data[0].first_name ? result.data[0].first_name : '',
        );
        setValue(
          'staffLastName',
          result.data[0].last_name ? result.data[0].last_name : '',
        );
        setValue(
          'staffGender',
          result.data[0].gender ? result.data[0].gender : '',
        );
        setValue(
          'staffEmail',
          result.data[0].email ? result.data[0].email : '',
        );
        setValue(
          'staffPhone',
          result.data[0].phone ? result.data[0].phone : '',
        );
        setValue(
          'staffAddress',
          result.data[0].address ? result.data[0].address : '',
        );
        setValue(
          'staffEducation',
          result.data[0].education ? result.data[0].education : '',
        );
        setValue(
          'staffInformation',
          result.data[0].information ? result.data[0].information : '',
        );
        setValue(
          'staffBirthday',
          dayjs(result.data[0].staffBirthday, 'DD-MM-YYYY'),
        );

        setAvatar(result.data[0].avatar);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (id) {
      getDataById(id);
    }
  }, [id]);

  return (
    <Box>

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
          Staff
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
          View information staff of the system
        </Typography>
      </Box>
      <Divider />

      <Paper elevation={6} sx={{ p: '30px', mt: 3 }}>
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
                <Avatar
                  alt=''
                  src={avatar ? avatar : images.imgPlacehoder}
                  sx={{ width: 280, height: 280 }}
                />
              </Box>
            </Grid>
          </Grid>

          <Grid item container xs={12} xl={8} spacing={2}>
            <Grid item xs={12} xl={6}>
              <TypographyStyle
                component='label'
                variant='h5'
                htmlFor='staffFirstName'
              >
                First Name
              </TypographyStyle>
              <TextFieldStyle
                control={control}
                name='staffFirstName'
                placeholder='First name'
              />
            </Grid>

            <Grid item xs={12} xl={6}>
              <TypographyStyle
                component='label'
                variant='h5'
                htmlFor='staffLastName'
              >
                Last name
              </TypographyStyle>
              <TextFieldStyle
                control={control}
                name='staffLastName'
                placeholder='Last name'
              />
            </Grid>

            <Grid item xs={12} xl={6}>
              <TypographyStyle
                component='label'
                variant='h5'
                htmlFor='staffGender'
              >
                Gender
              </TypographyStyle>
              <SelectStyle
                control={control}
                name='staffGender'
                options={optionsGender}
                title='Chọn giới tính'
              />
            </Grid>

            <Grid item xs={12} xl={6}>
              <TypographyStyle
                component='label'
                variant='h5'
                htmlFor='staffBirthday'
              >
                Birthday
              </TypographyStyle>
              <DatePickerStyle control={control} name='staffBirthday' />
            </Grid>

            <Grid item xs={12} xl={6}>
              <TypographyStyle
                component='label'
                variant='h5'
                htmlFor='staffEmail'
              >
                Email
              </TypographyStyle>
              <TextFieldStyle
                control={control}
                name='staffEmail'
                placeholder='Email'
              />
            </Grid>

            <Grid item xs={12} xl={6}>
              <TypographyStyle
                component='label'
                variant='h5'
                htmlFor='staffPhone'
              >
                Phone
              </TypographyStyle>
              <TextFieldStyle
                control={control}
                name='staffPhone'
                placeholder='Phone'
              />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <TypographyStyle
              component='label'
              variant='h5'
              htmlFor='staffAddress'
            >
              Address
            </TypographyStyle>
            <TextFieldStyle
              control={control}
              name='staffAddress'
              placeholder='Address'
            />
          </Grid>

          <Grid item xs={12}>
            <TypographyStyle
              component='label'
              variant='h5'
              htmlFor='staffEducation'
            >
              Education
            </TypographyStyle>
            <TextFieldStyle
              control={control}
              name='staffEducation'
              placeholder='Discount slug'
              multiline
              rows={5}
            />
          </Grid>

          <Grid item xs={12}>
            <TypographyStyle
              component='label'
              variant='h5'
              htmlFor='staffInformation'
            >
              Additional information
            </TypographyStyle>

            <CKEditorStyle
              control={control}
              name='staffInformation'
              textValue={textValue}
              setTextValue={setTextValue}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default StaffForm;
