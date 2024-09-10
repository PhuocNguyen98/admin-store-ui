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
import TextFieldStyle from '~/components/FormStye/TextFieldStyle';
import TypographyStyle from '~/components/FormStye/TypographyStyle';

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

const cx = classnames.bind(styles);

const schemaDiscount = yup.object().shape({
  discountName: yup.string().required('Vui lòng nhập tên nhà cung cấp'),
  discountSlug: yup.string().required('Nhấn nút Generate slug để tạo slug'),
  discountPercent: yup.string(),
  discountStartTime: yup.string(),
  discountEndTime: yup.string(),
  discountDescription: yup.string(),
  discountImage: yup.array(),
});

function DiscountForm() {
  const { id } = useParams(); // Get id
  const [data, setData] = useState([]); // Save data after call API( by id)
  const [files, setFiles] = useState([]); // Save image new
  const [filesOld, setFilesOld] = useState([]); // Save image old
  const [isSuccess, setIsSuccess] = useState(false);
  const [textValue, setTextValue] = useState('');

  const { handleSubmit, control, watch, setValue, clearErrors } = useForm({
    defaultValues: {
      discountName: '',
      discountSlug: '',
      discountPercent: '',
      discountStartTime: '',
      discountEndTime: '',
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
    formData.append('supplierName', data.supplierName);
    formData.append('supplierSlug', data.supplierSlug);
    if (!!data.supplierImage[0]) {
      formData.append('supplierImage', data.supplierImage[0]);
    } else {
      formData.append('supplierImage', []);
    }
    return formData;
  };

  // Handle click add submit
  const handleAdd = handleSubmit(async (data) => {
    console.log(data);
    // setIsSuccess(true);
    // const formData = handleFormData(data);
    // try {
    //   const res = await addDiscountApi(formData);
    //   toast.success(res.message);
    //   setValue('supplierName', '');
    //   setValue('supplierSlug', '');
    //   setValue('supplierImage', files);
    //   setFiles([]);
    //   setIsSuccess(false);
    // } catch (error) {
    //   setIsSuccess(false);
    //   toast.error(error.message);
    // }
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
        setValue('supplierName', res.data[0].name);
        setValue('supplierSlug', res.data[0].slug);
        setFilesOld([res.data[0].thumbnail ?? []]);
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
          <Grid item xs={12} md={6}>
            <Box mb={3}>
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
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box mb={3} flex={1}>
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
                sx={{ ml: 1 }}
                variant='contained'
                color='primary'
                startIcon={<AutorenewIcon />}
                disabled={!!watchDiscountName ? false : true}
                onClick={() => handleGenerateSlug(watchDiscountName)}
              >
                Generate slug
              </ButtonStyle>
            </Box>

            <Box mb={3}>
              <TypographyStyle
                component='label'
                htmlFor='discountPercent'
                variant='h5'
                isRequired={true}
                comment='Nhập % giảm giá'
              >
                Discount percent
              </TypographyStyle>
              <TextFieldStyle
                control={control}
                name='discountPercent'
                placeholder='Discount percent'
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box mb={3}>
              <TypographyStyle
                component='label'
                htmlFor='discountStartTime'
                variant='h5'
                isRequired={true}
                comment='Chọn thời gian bắt đầu áp dụng giảm giá'
              >
                Start time
              </TypographyStyle>
              <TextFieldStyle
                control={control}
                name='discountStartTime'
                placeholder='Discount start time'
              />
            </Box>

            <Box mb={3}>
              <TypographyStyle
                component='label'
                htmlFor='discountEndTime'
                variant='h5'
                isRequired={true}
                comment='Chọn thời gian kết thúc áp dụng giảm giá'
              >
                End time
              </TypographyStyle>
              <TextFieldStyle
                control={control}
                name='discountEndTime'
                placeholder='Discount end time'
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box>
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
            </Box>
          </Grid>

          <Grid item xs={12}>
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
