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
import { toast } from 'react-toastify';

import SelectStyle from '~/components/SelectStyle';
import ButtonStyle from '~/components/ButtonStyle';
import DropzoneStyle from '~/components/DropzoneStyle';
import BreadcrumbStyle from '~/components/BreadcrumbStyle';
import TextFieldStyle from '~/components/FormStyle/TextFieldStyle';
import TypographyStyle from '~/components/FormStyle/TypographyStyle';

import { convertSlug } from '~/utils/convertSlug';
import { getSupplierByIdApi, updateSupplierApi, addSupplierApi } from '~/api/supplierApi';

const schemaSupplier = yup.object().shape({
  supplierName: yup.string().required('Please enter a supplier name'),
  supplierSlug: yup.string().required('Click the generate slug button to create the slug'),
  supplierStatus: yup.string(),
  supplierDisplay: yup.string(),
  supplierImage: yup.array(),
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

function SupplierForm() {
  const { id } = useParams(); // Get id
  const [data, setData] = useState([]); // Save data after call API( by id)
  const [files, setFiles] = useState([]); // Save image new
  const [isSuccess, setIsSuccess] = useState(false);

  const { handleSubmit, control, watch, setValue, clearErrors, reset } = useForm({
    defaultValues: {
      supplierName: '',
      supplierSlug: '',
      supplierStatus: 1,
      supplierDisplay: 0,
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
    if (data?.supplierStatus) {
      formData.append('supplierStatus', data.supplierStatus);
    }
    if (data?.supplierDisplay) {
      formData.append('supplierDisplay', data.supplierDisplay);
    }
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
      if (res?.status === 201) {
        toast.success(res.message);
        reset({
          supplierName: '',
          supplierSlug: '',
        });
        setFiles([]);
        setIsSuccess(false);
      } else {
        toast.error(res.message);
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
      console.log([...formData]);
      const res = await updateSupplierApi(id, formData);
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

  // Get data by id supplier
  const getDataById = async (id) => {
    try {
      const res = await getSupplierByIdApi(id);
      if (res?.status === 200 && res?.data) {
        setData(res.data);
        setValue('supplierName', res.data[0].name);
        setValue('supplierSlug', res.data[0].slug);
        setValue('supplierStatus', res.data[0].is_status);
        setValue('supplierDisplay', res.data[0].is_display);
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
          {data.length > 0 ? 'Edit supplier for the system' : 'Create new supplier for the system'}
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
            <TextFieldStyle control={control} name='supplierName' placeholder='Supplier name' />
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
                comment='Click the generate slug button to create the slug'
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

          {data.length > 0 ? (
            <>
              <Box mb={3}>
                <TypographyStyle component='label' htmlFor='supplierStatus' variant='h5'>
                  Supplier status
                </TypographyStyle>
                <SelectStyle
                  control={control}
                  name='supplierStatus'
                  options={optionsStatus}
                ></SelectStyle>
              </Box>

              <Box mb={3}>
                <TypographyStyle component='label' htmlFor='supplierDisplay' variant='h5'>
                  Supplier display
                </TypographyStyle>
                <SelectStyle
                  control={control}
                  name='supplierDisplay'
                  options={optionsDisplay}
                ></SelectStyle>
              </Box>
            </>
          ) : null}

          <Box>
            <TypographyStyle component='label' variant='h5' htmlFor='supplierImage'>
              Supplier thumbnail
            </TypographyStyle>

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
            {isSuccess ? (
              <>
                <CircularProgress size='14px' sx={{ mr: 1 }} />
                Update supplier...
              </>
            ) : (
              'Update supplier'
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
                Create supplier...
              </>
            ) : (
              'Create supplier'
            )}
          </ButtonStyle>
        )}
      </Paper>
    </Box>
  );
}

export default SupplierForm;
