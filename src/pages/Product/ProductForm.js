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
import { getSupplierApi } from '~/api/supplierApi';
import { getCategoryApi } from '~/api/categoryApi';
import { getDiscountApi } from '~/api/discountApi';
import images from '~/assets/img';

import classnames from 'classnames/bind';
import styles from './Product.module.scss';
import { Grid } from '@mui/material';
import SelectStyle from '~/components/SelectStyle';
import CKEditorStyle from '~/components/CKEditorStyle';

import NumericFormatStyle from '~/components/NumericFormatStyle';

const cx = classnames.bind(styles);

const schemaProduct = yup.object().shape({
  productName: yup.string().required('Vui lòng nhập tên sản phẩm'),
  productSlug: yup.string().required('Nhấn nút Generate slug để tạo slug'),
  productSku: yup.string().required('Vui lòng nhập SKU của sản phẩm'),
  productPrice: yup
    .number()
    .typeError('Vui lòng kiểm tra lại giá của sản phẩm')
    .min(0, 'Giá trị phải lớn hơn hoặc bằng 0')
    .integer('Giá trị phải là 1 số nguyên'),
  productSupplier: yup.number().typeError('Vui lòng chọn nhà cung cấp'),
  productCategory: yup
    .number()
    .typeError('Vui lòng chọn danh mục cho sản phẩm'),
  productDiscount: yup
    .number()
    .nullable()
    .transform((value, original) => (original === '' ? null : value)),
  productImage: yup.array(),
  productDescription: yup.string(),
});

function ProductForm() {
  const { id } = useParams(); // Get id
  const [data, setData] = useState([]); // Save data after call API( by id)
  const [files, setFiles] = useState([]); // Save image new
  const [filesOld, setFilesOld] = useState([]); // Save image old
  const [isSuccess, setIsSuccess] = useState(false);
  const [textValue, setTextValue] = useState(''); // Save text CKEditor

  //
  const [supplier, setSupplier] = useState([]);
  const [category, setCategory] = useState([]);
  const [discount, setDiscount] = useState([]);
  //

  const { handleSubmit, control, watch, setValue, clearErrors } = useForm({
    defaultValues: {
      productName: '',
      productSlug: '',
      productSku: '',
      productPrice: '',
      productSupplier: '',
      productCategory: '',
      productDiscount: '',
      productImage: [],
      productDescription: '',
    },
    resolver: yupResolver(schemaProduct),
  });
  const watchProductName = watch('productName', '');

  // Handle event generate slug
  const handleGenerateSlug = (name) => {
    let slug;
    if (name) {
      slug = convertSlug(name);
    }
    setValue('productSlug', slug);
    clearErrors('productSlug');
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
    //   const res = await addSupplierApi(formData);
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
    // setIsSuccess(true);
    // const formData = handleFormData(data);
    // try {
    //   const res = await updateSupplierApi(id, formData);
    //   toast.success(res.message);
    //   setIsSuccess(false);
    // } catch (error) {
    //   setIsSuccess(false);
    //   toast.error(error.message);
    // }
  });

  // Get data by id category
  const getDataById = async (id) => {
    // try {
    //   const res = await getSupplierByIdApi(id);
    //   if (res) {
    //     setData(res.data);
    //     setValue('supplierName', res.data[0].name);
    //     setValue('supplierSlug', res.data[0].slug);
    //     setFilesOld([res.data[0].thumbnail ?? []]);
    //   }
    // } catch (error) {
    //   toast.error(error.message);
    // }
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

  // Get data select
  const getSupplierData = async () => {
    try {
      const result = await getSupplierApi();
      setSupplier(result.data);
    } catch (error) {}
  };

  const getCategoryData = async () => {
    try {
      const result = await getCategoryApi();
      setCategory(result.data);
    } catch (error) {}
  };

  const getDiscountData = async () => {
    try {
      const result = await getDiscountApi();
      setDiscount(result.data);
    } catch (error) {}
  };

  useEffect(() => {
    if (id) {
      getDataById(id);
    }
    getSupplierData();
    getCategoryData();
    getDiscountData();
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
          Product
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
            ? 'Edit product for the system'
            : 'Create new product for the system'}
        </Typography>
      </Box>
      <Divider />

      <Paper elevation={6} sx={{ p: '30px', mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} xl={6}>
            <TypographyStyle
              component='label'
              htmlFor='productName'
              variant='h5'
              isRequired={true}
            >
              Product name
            </TypographyStyle>
            <TextFieldStyle
              control={control}
              name='productName'
              placeholder='Product name'
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
                  htmlFor='productSlug'
                  isRequired={true}
                  comment='Nhấn nút Generate để tạo Slug'
                >
                  Product slug
                </TypographyStyle>

                <TextFieldStyle
                  control={control}
                  name='productSlug'
                  disabled={true}
                  placeholder='Product slug'
                />
              </Box>
              <ButtonStyle
                sx={{ ml: 1, mt: 2 }}
                variant='contained'
                color='primary'
                startIcon={<AutorenewIcon />}
                disabled={!!watchProductName ? false : true}
                onClick={() => handleGenerateSlug(watchProductName)}
              >
                Generate slug
              </ButtonStyle>
            </Box>
          </Grid>

          <Grid item xs={12} xl={6}>
            <TypographyStyle
              component='label'
              htmlFor='productSku'
              variant='h5'
              isRequired={true}
            >
              Product SKU
            </TypographyStyle>
            <TextFieldStyle
              control={control}
              name='productSku'
              placeholder='Product SKU'
            />
          </Grid>

          <Grid item xs={12} xl={6}>
            <TypographyStyle
              component='label'
              htmlFor='productPrice'
              variant='h5'
              isRequired={true}
            >
              Product price
            </TypographyStyle>

            <NumericFormatStyle control={control} name='productPrice' />
          </Grid>

          <Grid item xs={12} xl={4}>
            <TypographyStyle
              component='label'
              htmlFor='productSupplier'
              variant='h5'
            >
              Product supplier
            </TypographyStyle>

            <SelectStyle
              control={control}
              name='productSupplier'
              options={supplier}
              title='Chọn nhà cung cấp'
            />
          </Grid>

          <Grid item xs={12} xl={4}>
            <TypographyStyle
              component='label'
              variant='h5'
              htmlFor='productCategory'
            >
              Product category
            </TypographyStyle>

            <SelectStyle
              control={control}
              name='productCategory'
              options={category}
              title='Chọn danh mục'
            />
          </Grid>

          <Grid item xs={12} xl={4}>
            <TypographyStyle
              component='label'
              variant='h5'
              htmlFor='productDiscount'
            >
              Product discount
            </TypographyStyle>

            <SelectStyle
              control={control}
              name='productDiscount'
              options={discount}
              title='Chọn chương trình khuyến mãi'
            />
          </Grid>

          <Grid item xs={12}>
            <TypographyStyle
              component='label'
              variant='h5'
              htmlFor='productImage'
            >
              Product image
            </TypographyStyle>
            <DropzoneStyle
              control={control}
              name='productImage'
              multiple={true}
              files={files}
              setFiles={setFiles}
            />
          </Grid>

          <Grid item xs={12}>
            <TypographyStyle
              component='label'
              variant='h5'
              htmlFor='productDescription'
            >
              Product descriptions
            </TypographyStyle>
            <CKEditorStyle
              control={control}
              name='productDescription'
              textValue={textValue}
              setTextValue={setTextValue}
            />
          </Grid>
        </Grid>

        {/* <Box width='50%' component='form' action='POST'>
          <Box>
            {data.length > 0 ? (
              <Box display='flex' alignItems='center' flexWrap='wrap' ml={3}>
                <span>Image Old: </span>
                {filesOld.length > 0 ? renderListImage() : null}
              </Box>
            ) : null}
          </Box>
        </Box> */}

        {data.length > 0 ? (
          <ButtonStyle
            variant='contained'
            size='large'
            sx={{ mt: 4 }}
            disabled={isSuccess}
            onClick={() => handleEdit()}
          >
            Update product
          </ButtonStyle>
        ) : (
          <ButtonStyle
            variant='contained'
            size='large'
            sx={{ mt: 4 }}
            disabled={isSuccess}
            onClick={() => handleAdd()}
          >
            Create product
          </ButtonStyle>
        )}
      </Paper>
    </Box>
  );
}

export default ProductForm;
