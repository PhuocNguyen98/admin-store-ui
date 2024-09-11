import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import AutorenewIcon from '@mui/icons-material/Autorenew';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast, ToastContainer } from 'react-toastify';

import ButtonStyle from '~/components/ButtonStyle';
import DropzoneStyle from '~/components/DropzoneStyle';
import BreadcrumbStyle from '~/components/BreadcrumbStyle';
import TextFieldStyle from '~/components/FormStyle/TextFieldStyle';
import TypographyStyle from '~/components/FormStyle/TypographyStyle';

import { convertSlug } from '~/utils/convertSlug';
import {
  getDiscountByIdApi,
  updateDiscountApi,
  addDiscountApi,
} from '~/api/discountApi';
import images from '~/assets/img';

import classnames from 'classnames/bind';
import styles from './Discount.module.scss';

import { Grid } from '@mui/material';
import CKEditorStyle from '~/components/CKEditorStyle';
import { InputAdornment } from '@mui/material';
import FormControlStyle from '~/components/FormStyle/FormControlStyle';
import OutlinedInputStyle from '~/components/FormStyle/OutlinedInputStyle';
import DatePickerStyle from '~/components/DatePickerStyle';
import dayjs from 'dayjs';

const cx = classnames.bind(styles);

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
        discountStartTime &&
        schema.min(discountStartTime, 'Vui lòng kiểm tra lại ngày kết thúc'),
    )
    .required('Vui lòng chọn ngày kết thúc'),
  discountDescription: yup.string(),
  discountImage: yup.array(),
});

function DiscountForm() {
  const { id } = useParams(); // Get id
  const [data, setData] = useState([]); // Save data after call API( by id)
  const [files, setFiles] = useState([]); // Save image new
  const [filesOld, setFilesOld] = useState([]); // Save image old
  const [isSuccess, setIsSuccess] = useState(false);
  const [textValue, setTextValue] = useState(''); // Save text CKEditor

  const { handleSubmit, control, watch, setValue, clearErrors } = useForm({
    defaultValues: {
      discountName: '',
      discountSlug: '',
      discountPercent: 0,
      discountStartTime: dayjs(),
      discountEndTime: null,
      discountDescription: '',
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
    if (!!data.discountImage[0]) {
      formData.append('discountImage', data.discountImage[0]);
    } else {
      formData.append('discountImage', []);
    }
    return formData;
  };

  // Handle click add submit
  const handleAdd = handleSubmit(async (data) => {
    handleFormData(data);
    setIsSuccess(true);
    const formData = handleFormData(data);
    try {
      const res = await addDiscountApi(formData);
      toast.success(res.message);
      setValue('discountName', '');
      setValue('discountSlug', '');
      setValue('discountPercent', 0);
      setValue('discountStartTime', dayjs());
      setValue('discountEndTime', null);
      setValue('supplierImage', files);
      setValue('discountDescription', '');
      setTextValue('');
      setFiles([]);
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
      toast.success(res.message);
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
      if (res) {
        setData(res.data);
        setValue('discountName', res.data[0].name);
        setValue('discountSlug', res.data[0].slug);
        setValue('discountPercent', res.data[0].percent);
        setValue(
          'discountStartTime',
          dayjs(res.data[0].start_time, 'DD-MM-YYYY'),
        );
        setValue('discountEndTime', dayjs(res.data[0].end_time, 'DD-MM-YYYY'));
        setValue('discountDescription', res.data[0].description);
        setFilesOld([res.data[0].thumbnail ?? []]);
        setTextValue(res.data[0].description);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onErrorImg = (e) => {
    e.target.src = images.imgPlacehoder;
  };

  // Render image after get data
  const renderListImage = () => {
    return (
      <ul className={cx('list-image')}>
        {filesOld.map((file, index) => (
          <li key={index} className={cx('item-img')}>
            <img alt='' src={file} onError={(e) => onErrorImg(e)} />
          </li>
        ))}
      </ul>
    );
  };

  useEffect(() => {
    if (id) {
      getDataById(id);
    }
  }, [id]);

  return (
    <Box>
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
            <TextFieldStyle
              control={control}
              name='discountName'
              placeholder='Discount name'
            />
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

          <Grid item xs={12} xl={4}>
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
                endAdornment={
                  <InputAdornment position='start'>%</InputAdornment>
                }
                placeholder='Discount percent'
              />
            </FormControlStyle>
          </Grid>

          <Grid item xs={12} xl={4}>
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

          <Grid item xs={12} xl={4}>
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

          <Grid item xs={12}>
            <TypographyStyle
              component='label'
              variant='h5'
              htmlFor='discountImage'
              comment='Không bắt buộc'
            >
              Discount thumbnail
            </TypographyStyle>

            {data.length > 0 ? (
              <Box display='flex' alignItems='center' flexWrap='wrap' ml={3}>
                <span>Thumbnail Old: </span>
                {filesOld.length > 0 ? renderListImage() : null}
              </Box>
            ) : null}

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
            Update discount
          </ButtonStyle>
        ) : (
          <ButtonStyle
            variant='contained'
            size='large'
            sx={{ mt: 4 }}
            disabled={isSuccess}
            onClick={() => handleAdd()}
          >
            Create discount
          </ButtonStyle>
        )}
      </Paper>
    </Box>
  );
}

export default DiscountForm;
