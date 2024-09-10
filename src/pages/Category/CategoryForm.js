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

import SelectStyle from '~/components/SelectStyle';
import ButtonStyle from '~/components/ButtonStyle';
import DropzoneStyle from '~/components/DropzoneStyle';
import BreadcrumbStyle from '~/components/BreadcrumbStyle';
import TextFieldStyle from '~/components/FormStyle/TextFieldStyle';
import TypographyStyle from '~/components/FormStyle/TypographyStyle';

import { convertSlug } from '~/utils/convertSlug';
import {
  getCategoryByIdApi,
  updateCategoryApi,
  addCategoryApi,
} from '~/api/categoryApi';
import images from '~/assets/img';

import classnames from 'classnames/bind';
import styles from './Category.module.scss';

const cx = classnames.bind(styles);

const schemaCategory = yup.object().shape({
  categoryName: yup.string().required('Vui lòng nhập tên danh mục'),
  categorySlug: yup.string().required('Nhấn nút Generate slug để tạo slug'),
  categoryStatus: yup.string(),
  categoryImage: yup.array(),
});

// Options data display of SelectStyle componnent
const options = [
  {
    value: 0,
    title: 'Ngừng kinh doanh',
  },
  {
    value: 1,
    title: 'Đang kinh doanh',
  },
];

function CategoryForm() {
  const { id } = useParams(); // Get id
  const [data, setData] = useState([]); // Save data after call API( by id)
  const [files, setFiles] = useState([]); // Save image new
  const [filesOld, setFilesOld] = useState([]); // Save image old
  const [isSuccess, setIsSuccess] = useState(false);

  const { handleSubmit, control, watch, setValue, clearErrors } = useForm({
    defaultValues: {
      categoryName: '',
      categorySlug: '',
      categoryStatus: 0,
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
      toast.success(res.message);
      setValue('categoryName', '');
      setValue('categorySlug', '');
      setValue('categoryImage', files);
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
      const res = await updateCategoryApi(id, formData);
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
      const res = await getCategoryByIdApi(id);
      if (res) {
        setData(res.data);
        setValue('categoryName', res.data[0].name);
        setValue('categorySlug', res.data[0].slug);
        setValue('categoryStatus', res.data[0].is_status);
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
          {data.length > 0
            ? 'Edit category for the system'
            : 'Create new category for the system'}
          {/* Create new category for the system */}
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
            <TextFieldStyle
              control={control}
              name='categoryName'
              placeholder='Category name'
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
                htmlFor='categorySlug'
                isRequired={true}
                comment='Nhấn nút Generate để tạo Slug'
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
            <Box mb={3}>
              <TypographyStyle
                component='label'
                htmlFor='categoryStatus'
                variant='h5'
              >
                Category status
              </TypographyStyle>
              <SelectStyle
                control={control}
                name='categoryStatus'
                options={options}
              ></SelectStyle>
            </Box>
          ) : null}

          <Box>
            <TypographyStyle
              component='label'
              variant='h5'
              htmlFor='categoryImage'
            >
              Category image
            </TypographyStyle>

            {data.length > 0 ? (
              <Box display='flex' alignItems='center' flexWrap='wrap' ml={3}>
                <span>Image Old: </span>
                {filesOld.length > 0 ? renderListImage() : null}
              </Box>
            ) : null}

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
            Update category
          </ButtonStyle>
        ) : (
          <ButtonStyle
            variant='contained'
            size='large'
            sx={{ mt: 4 }}
            disabled={isSuccess}
            onClick={() => handleAdd()}
          >
            Create category
          </ButtonStyle>
        )}
      </Paper>
    </Box>
  );
}

export default CategoryForm;
