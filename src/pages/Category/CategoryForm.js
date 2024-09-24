import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import AutorenewIcon from '@mui/icons-material/Autorenew';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast, ToastContainer } from 'react-toastify';

import SelectStyle from '~/components/SelectStyle';
import ButtonStyle from '~/components/ButtonStyle';
import DropzoneStyle from '~/components/DropzoneStyle';
import BreadcrumbStyle from '~/components/BreadcrumbStyle';
import TextFieldStyle from '~/components/FormStyle/TextFieldStyle';
import TypographyStyle from '~/components/FormStyle/TypographyStyle';

import { convertSlug } from '~/utils/convertSlug';
import { getCategoryByIdApi, updateCategoryApi, addCategoryApi } from '~/api/categoryApi';

const schemaCategory = yup.object().shape({
  categoryName: yup.string().required('Please enter a category name'),
  categorySlug: yup.string().required('Click the generate slug button to create the slug'),
  categoryStatus: yup.string(),
  categoryDisplay: yup.string(),
  categoryImage: yup.array(),
});

// Options data display of SelectStyle componnent
const optionsStatus = [
  {
    value: 0,
    title: 'Ngừng kinh doanh',
  },
  {
    value: 1,
    title: 'Đang kinh doanh',
  },
];

const optionsDisplay = [
  {
    value: 0,
    title: 'Ẩn',
  },
  {
    value: 1,
    title: 'Hiển thị',
  },
];

function CategoryForm() {
  const { id } = useParams(); // Get id
  const [data, setData] = useState([]); // Save data after call API( by id)
  const [files, setFiles] = useState([]); // Save image
  const [isSuccess, setIsSuccess] = useState(false);

  const { handleSubmit, control, watch, setValue, reset, clearErrors } = useForm({
    defaultValues: {
      categoryName: '',
      categorySlug: '',
      categoryStatus: 1,
      categoryDisplay: 0,
      categoryImage: [],
    },
    resolver: yupResolver(schemaCategory),
  });
  const watchCategoryName = watch('categoryName', '');

  // Handle event generate slug
  const handleGenerateSlug = (name) => {
    let slug;
    if (name) {
      slug = convertSlug(name);
    }
    setValue('categorySlug', slug);
    clearErrors('categorySlug');
  };

  // Handle formdata
  const handleFormData = (data) => {
    const formData = new FormData();
    formData.append('categoryName', data.categoryName);
    formData.append('categorySlug', data.categorySlug);
    if (data?.categoryStatus) {
      formData.append('categoryStatus', data.categoryStatus);
    }
    if (data?.categoryDisplay) {
      formData.append('categoryDisplay', data.categoryDisplay);
    }
    if (!!data.categoryImage[0]) {
      formData.append('categoryImage', data.categoryImage[0]);
    } else {
      formData.append('categoryImage', []);
    }
    return formData;
  };

  // Handle click add submit
  const handleAdd = handleSubmit(async (data) => {
    setIsSuccess(true);
    const formData = handleFormData(data);
    try {
      const res = await addCategoryApi(formData);
      if (res?.status === 201) {
        toast.success(res?.message);
        reset({
          categoryName: '',
          categorySlug: '',
        });
        setFiles([]);
        setIsSuccess(false);
      } else {
        toast.error(res?.message);
      }
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
      const res = await updateCategoryApi(id, formData);
      if (res?.status === 200) {
        toast.success(res.message);
        setIsSuccess(false);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      setIsSuccess(false);
      toast.error(error.message);
    }
  });

  // Get data by id category
  const getDataById = async (id) => {
    try {
      const res = await getCategoryByIdApi(id);
      if (res?.status === 200 && res?.data) {
        setData(res.data);
        setValue('categoryName', res.data[0].name);
        setValue('categorySlug', res.data[0].slug);
        setValue('categoryStatus', res.data[0].is_status);
        setFiles([res.data[0].thumbnail ?? []]);
      } else {
        toast.error(res.message);
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
          Categories
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
          {data.length > 0 ? 'Edit category for the system' : 'Create new category for the system'}
        </Typography>
      </Box>
      <Divider />

      <Paper elevation={6} sx={{ p: '30px', mt: 3 }}>
        <Box width='50%' component='form' action='POST'>
          <Box mb={3}>
            <TypographyStyle
              component='label'
              htmlFor='categoryName'
              variant='h5'
              isRequired={true}
            >
              Category name
            </TypographyStyle>
            <TextFieldStyle control={control} name='categoryName' placeholder='Category name' />
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
                htmlFor='categorySlug'
                isRequired={true}
                comment='Click the generate slug button to create the slug'
              >
                Category slug
              </TypographyStyle>

              <TextFieldStyle
                control={control}
                name='categorySlug'
                disabled={true}
                placeholder='Category slug'
              />
            </Box>
            <ButtonStyle
              sx={{ ml: 1 }}
              variant='contained'
              color='primary'
              startIcon={<AutorenewIcon />}
              disabled={!!watchCategoryName ? false : true}
              onClick={() => handleGenerateSlug(watchCategoryName)}
            >
              Generate slug
            </ButtonStyle>
          </Box>

          {data.length > 0 ? (
            <>
              <Box mb={3}>
                <TypographyStyle component='label' htmlFor='categoryStatus' variant='h5'>
                  Category status
                </TypographyStyle>
                <SelectStyle
                  control={control}
                  name='categoryStatus'
                  options={optionsStatus}
                ></SelectStyle>
              </Box>

              <Box mb={3}>
                <TypographyStyle component='label' htmlFor='categoryDisplay' variant='h5'>
                  Category display
                </TypographyStyle>
                <SelectStyle
                  control={control}
                  name='categoryDisplay'
                  options={optionsDisplay}
                ></SelectStyle>
              </Box>
            </>
          ) : null}

          <Box>
            <TypographyStyle component='label' variant='h5' htmlFor='categoryImage'>
              Category thumbnail
            </TypographyStyle>

            <DropzoneStyle
              control={control}
              name='categoryImage'
              multiple={false}
              files={files}
              setFiles={setFiles}
            />
          </Box>
        </Box>

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
                Update category...
              </>
            ) : (
              'Update category'
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
                Create category...
              </>
            ) : (
              'Create category'
            )}
          </ButtonStyle>
        )}
      </Paper>
    </Box>
  );
}

export default CategoryForm;
