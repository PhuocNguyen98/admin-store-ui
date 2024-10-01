import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import AutorenewIcon from '@mui/icons-material/Autorenew';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import dayjs from 'dayjs';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';

import Loader from '~/components/Loader';
import SelectStyle from '~/components/SelectStyle';
import ButtonStyle from '~/components/ButtonStyle';
import CKEditorStyle from '~/components/CKEditorStyle';
import DropzoneStyle from '~/components/DropzoneStyle';
import BackdropStyle from '~/components/BackdropStyle';
import DatePickerStyle from '~/components/DatePickerStyle';
import BreadcrumbStyle from '~/components/BreadcrumbStyle';
import TextFieldStyle from '~/components/FormStyle/TextFieldStyle';
import TypographyStyle from '~/components/FormStyle/TypographyStyle';
import FormControlStyle from '~/components/FormStyle/FormControlStyle';
import OutlinedInputStyle from '~/components/FormStyle/OutlinedInputStyle';

import { convertSlug } from '~/utils/convertSlug';
import { getDiscountByIdApi, updateDiscountApi, addDiscountApi } from '~/api/discountApi';

const schemaDiscount = yup.object().shape({
  discountName: yup.string().required('Vui lòng nhập tên khuyến mãi'),
  discountSlug: yup.string().required('Nhấn nút Generate slug để tạo slug'),
  discountPercent: yup
    .number()
    .typeError('Giá trị phải là số nằm trong khoảng từ 0 đến 100')
    .min(0, 'Giá trị phải lớn hơn hoặc bằng 0')
    .max(100, 'Giá trị tối đa là 100')
    .integer('Giá trị phải là 1 số nguyên'),
  discountStartTime: yup.date().default(() => dayjs()),
  discountEndTime: yup
    .date()
    .when(
      'discountStartTime',
      (discountStartTime, schema) =>
        discountStartTime && schema.min(discountStartTime, 'Vui lòng kiểm tra lại ngày kết thúc'),
    )
    .required('Vui lòng chọn ngày kết thúc'),
  discountDescription: yup.string(),
  discountStatus: yup.string(),
  discountImage: yup.array(),
});

// Options data display of SelectStyle componnent
const optionsStatus = [
  {
    value: 0,
    title: 'Chưa áp dụng',
  },
  {
    value: 1,
    title: 'Đang áp dụng',
  },
];

function DiscountForm() {
  const { id } = useParams(); // Get id
  const [data, setData] = useState([]); // Save data after call API( by id)
  const [files, setFiles] = useState([]); // Save image
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [textValue, setTextValue] = useState(''); // Save text CKEditor

  const { handleSubmit, control, watch, setValue, clearErrors } = useForm({
    defaultValues: {
      discountName: '',
      discountSlug: '',
      discountPercent: 0,
      discountStartTime: dayjs(),
      discountEndTime: null,
      discountDescription: '',
      discountStatus: 0,
      discountImage: [],
    },
    resolver: yupResolver(schemaDiscount),
  });
  const watchDiscountName = watch('discountName', '');

  // Handle event generate slug
  const handleGenerateSlug = (name) => {
    let slug;
    if (name) {
      slug = convertSlug(name);
    }
    setValue('discountSlug', slug);
    clearErrors('discountSlug');
  };

  // Handle formdata
  const handleFormData = (data) => {
    const formData = new FormData();
    formData.append('discountName', data.discountName);
    formData.append('discountSlug', data.discountSlug);
    formData.append('discountPercent', data.discountPercent);
    formData.append('discountStartTime', data.discountStartTime);
    formData.append('discountEndTime', data.discountEndTime);
    formData.append('discountDescription', data.discountDescription);
    formData.append('discountStatus', data.discountStatus);
    if (!!data.discountImage[0]) {
      formData.append('discountImage', data.discountImage[0]);
    } else {
      formData.append('discountImage', []);
    }
    return formData;
  };

  // Handle click add submit
  const handleAdd = handleSubmit(async (data) => {
    setIsSuccess(true);
    const formData = handleFormData(data);
    try {
      const res = await addDiscountApi(formData);
      if (res?.status === 201) {
        toast.success(res?.message);
        setValue('discountName', '');
        setValue('discountSlug', '');
        setValue('discountPercent', 0);
        setValue('discountStartTime', dayjs());
        setValue('discountEndTime', null);
        setValue('discountDescription', '');
        setTextValue('');
        setFiles([]);
      } else {
        toast.error(res?.message);
      }
      setIsSuccess(false);
    } catch (error) {
      setIsSuccess(false);
      toast.error(error.message);
    }
  });

  // Handle click edit submit
  const handleEdit = handleSubmit(async (data) => {
    setIsSuccess(true);
    const formData = handleFormData(data);
    try {
      const res = await updateDiscountApi(id, formData);
      res?.status === 200 ? toast.success(res.message) : toast.error(res.message);
      setIsSuccess(false);
    } catch (error) {
      setIsSuccess(false);
      toast.error(error.message);
    }
  });

  // Get data by id category
  const getDataById = async (id) => {
    try {
      const res = await getDiscountByIdApi(id);
      if (res?.status === 200 && res?.data) {
        setData(res.data);
        setValue('discountName', res.data[0]?.name);
        setValue('discountSlug', res.data[0]?.slug);
        setValue('discountPercent', res.data[0]?.percent);
        setValue('discountStartTime', dayjs(res.data[0]?.start_time, 'DD-MM-YYYY'));
        setValue('discountEndTime', dayjs(res.data[0]?.end_time, 'DD-MM-YYYY'));
        setValue('discountStatus', res.data[0]?.is_status);
        setValue('discountDescription', res.data[0]?.description);
        setFiles([res.data[0]?.thumbnail ?? []]);
        setTextValue(res.data[0]?.description);
      } else {
        toast.error(res?.message);
      }
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getDataById(id);
    }
  }, [id]);

  return (
    <>
      {id && isLoading ? (
        <Loader />
      ) : (
        <Box>
          <BackdropStyle open={isSuccess} title={id ? ' Updating...' : 'Creating...'} />
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
              Discount
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
              {data.length > 0
                ? 'Edit discount for the system'
                : 'Create new discount for the system'}
            </Typography>
          </Box>
          <Divider />

          <Paper elevation={6} sx={{ p: '30px', mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} xl={6}>
                <TypographyStyle
                  component='label'
                  htmlFor='discountName'
                  variant='h5'
                  isRequired={true}
                >
                  Discount name
                </TypographyStyle>
                <TextFieldStyle control={control} name='discountName' placeholder='Discount name' />
              </Grid>

              <Grid item xs={12} xl={6}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box flex={1}>
                    <TypographyStyle
                      component='label'
                      variant='h5'
                      htmlFor='discountSlug'
                      isRequired={true}
                      comment='Nhấn nút Generate để tạo Slug'
                    >
                      Discount slug
                    </TypographyStyle>
                    <TextFieldStyle
                      control={control}
                      name='discountSlug'
                      disabled={true}
                      placeholder='Discount slug'
                    />
                  </Box>

                  <ButtonStyle
                    sx={{ ml: 1, mt: 2 }}
                    variant='contained'
                    color='primary'
                    startIcon={<AutorenewIcon />}
                    disabled={!!watchDiscountName ? false : true}
                    onClick={() => handleGenerateSlug(watchDiscountName)}
                  >
                    Generate slug
                  </ButtonStyle>
                </Box>
              </Grid>

              <Grid item xs={12} xl={data.length > 0 ? 3 : 4}>
                <TypographyStyle
                  component='label'
                  htmlFor='discountPercent'
                  variant='h5'
                  isRequired={true}
                  comment='Nhập % giảm giá'
                >
                  Discount percent
                </TypographyStyle>

                <FormControlStyle fullWidth>
                  <OutlinedInputStyle
                    control={control}
                    name='discountPercent'
                    endAdornment={<InputAdornment position='start'>%</InputAdornment>}
                    placeholder='Discount percent'
                  />
                </FormControlStyle>
              </Grid>

              <Grid item xs={12} xl={data.length > 0 ? 3 : 4}>
                <TypographyStyle
                  component='label'
                  htmlFor='discountStartTime'
                  variant='h5'
                  isRequired={true}
                  comment='Chọn thời gian bắt đầu áp dụng giảm giá'
                >
                  Start time
                </TypographyStyle>

                <DatePickerStyle control={control} name='discountStartTime' />
              </Grid>

              <Grid item xs={12} xl={data.length > 0 ? 3 : 4}>
                <TypographyStyle
                  component='label'
                  htmlFor='discountEndTime'
                  variant='h5'
                  isRequired={true}
                  comment='Chọn thời gian kết thúc áp dụng giảm giá'
                >
                  End time
                </TypographyStyle>

                <DatePickerStyle control={control} name='discountEndTime' />
              </Grid>

              {data.length > 0 ? (
                <Grid item xs={12} xl={3}>
                  <TypographyStyle component='label' htmlFor='discountStatus' variant='h5'>
                    Discount status
                  </TypographyStyle>
                  <SelectStyle
                    control={control}
                    name='discountStatus'
                    options={optionsStatus}
                  ></SelectStyle>
                </Grid>
              ) : null}

              <Grid item xs={12}>
                <TypographyStyle
                  component='label'
                  variant='h5'
                  htmlFor='discountImage'
                  comment='Không bắt buộc'
                >
                  Discount thumbnail
                </TypographyStyle>

                <DropzoneStyle
                  control={control}
                  name='discountImage'
                  multiple={false}
                  files={files}
                  setFiles={setFiles}
                />
              </Grid>

              <Grid item xs={12}>
                <TypographyStyle
                  component='label'
                  variant='h5'
                  htmlFor='discountImage'
                  comment='Không bắt buộc'
                >
                  Discriptions
                </TypographyStyle>

                <CKEditorStyle
                  control={control}
                  name='discountDescription'
                  textValue={textValue}
                  setTextValue={setTextValue}
                />
              </Grid>
            </Grid>

            {data.length > 0 ? (
              <ButtonStyle
                variant='contained'
                size='large'
                sx={{ mt: 4 }}
                disabled={isSuccess}
                onClick={() => handleEdit()}
              >
                {isSuccess ? (
                  <>
                    <CircularProgress size='14px' sx={{ mr: 1 }} />
                    Update discount...
                  </>
                ) : (
                  'Update discount'
                )}
              </ButtonStyle>
            ) : (
              <ButtonStyle
                variant='contained'
                size='large'
                sx={{ mt: 4 }}
                disabled={isSuccess}
                onClick={() => handleAdd()}
              >
                {isSuccess ? (
                  <>
                    <CircularProgress size='14px' sx={{ mr: 1 }} />
                    Create discount...
                  </>
                ) : (
                  'Create discount'
                )}
              </ButtonStyle>
            )}
          </Paper>
        </Box>
      )}
    </>
  );
}

export default DiscountForm;
