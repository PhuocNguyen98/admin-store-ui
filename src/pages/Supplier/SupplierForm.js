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
  getSupplierByIdApi,
  updateSupplierApi,
  addSupplierApi,
} from '~/api/supplierApi';
import images from '~/assets/img';

import classnames from 'classnames/bind';
import styles from './Supplier.module.scss';

const cx = classnames.bind(styles);

const schemaSupplier = yup.object().shape({
  supplierName: yup.string().required('Vui lòng nhập tên nhà cung cấp'),
  supplierSlug: yup.string().required('Nhấn nút Generate slug để tạo slug'),
  supplierImage: yup.array(),
});

function SupplierForm() {
  const { id } = useParams(); // Get id
  const [data, setData] = useState([]); // Save data after call API( by id)
  const [files, setFiles] = useState([]); // Save image new
  const [filesOld, setFilesOld] = useState([]); // Save image old
  const [isSuccess, setIsSuccess] = useState(false);

  const { handleSubmit, control, watch, setValue, clearErrors } = useForm({
    defaultValues: {
      supplierName: '',
      supplierSlug: '',
      supplierImage: [],
    },
    resolver: yupResolver(schemaSupplier),
  });
  const watchSupplierName = watch('supplierName', '');

  // Handle event generate slug
  const handleGenerateSlug = (name) => {
    let slug;
    if (name) {
      slug = convertSlug(name);
    }
    setValue('supplierSlug', slug);
    clearErrors('supplierSlug');
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
    setIsSuccess(true);
    const formData = handleFormData(data);
    try {
      const res = await addSupplierApi(formData);
      toast.success(res.message);
      setValue('supplierName', '');
      setValue('supplierSlug', '');
      setValue('supplierImage', files);
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
      const res = await updateSupplierApi(id, formData);
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
      const res = await getSupplierByIdApi(id);
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
          Suppliers
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
            ? 'Edit supplier for the system'
            : 'Create new supplier for the system'}
        </Typography>
      </Box>
      <Divider />

      <Paper elevation={6} sx={{ p: '30px', mt: 3 }}>
        <Box width='50%' component='form' action='POST'>
          <Box mb={3}>
            <TypographyStyle
              component='label'
              htmlFor='supplierName'
              variant='h5'
              isRequired={true}
            >
              Supplier name
            </TypographyStyle>
            <TextFieldStyle
              control={control}
              name='supplierName'
              placeholder='Supplier name'
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
                htmlFor='supplierSlug'
                isRequired={true}
                comment='Nhấn nút Generate để tạo Slug'
              >
                Supplier slug
              </TypographyStyle>

              <TextFieldStyle
                control={control}
                name='supplierSlug'
                disabled={true}
                placeholder='Supplier slug'
              />
            </Box>
            <ButtonStyle
              sx={{ ml: 1 }}
              variant='contained'
              color='primary'
              startIcon={<AutorenewIcon />}
              disabled={!!watchSupplierName ? false : true}
              onClick={() => handleGenerateSlug(watchSupplierName)}
            >
              Generate slug
            </ButtonStyle>
          </Box>

          <Box>
            <TypographyStyle
              component='label'
              variant='h5'
              htmlFor='supplierImage'
            >
              Supplier image
            </TypographyStyle>

            {data.length > 0 ? (
              <Box display='flex' alignItems='center' flexWrap='wrap' ml={3}>
                <span>Image Old: </span>
                {filesOld.length > 0 ? renderListImage() : null}
              </Box>
            ) : null}

            <DropzoneStyle
              control={control}
              name='supplierImage'
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
            Update supplier
          </ButtonStyle>
        ) : (
          <ButtonStyle
            variant='contained'
            size='large'
            sx={{ mt: 4 }}
            disabled={isSuccess}
            onClick={() => handleAdd()}
          >
            Create supplier
          </ButtonStyle>
        )}
      </Paper>
    </Box>
  );
}

export default SupplierForm;
