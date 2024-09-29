import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CircularProgress from '@mui/material/CircularProgress';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';

import SelectStyle from '~/components/SelectStyle';
import ButtonStyle from '~/components/ButtonStyle';
import CKEditorStyle from '~/components/CKEditorStyle';
import DropzoneStyle from '~/components/DropzoneStyle';
import BackdropStyle from '~/components/BackdropStyle';
import BreadcrumbStyle from '~/components/BreadcrumbStyle';
import NumericFormatStyle from '~/components/NumericFormatStyle';
import TextFieldStyle from '~/components/FormStyle/TextFieldStyle';
import TypographyStyle from '~/components/FormStyle/TypographyStyle';

import { convertSlug } from '~/utils/convertSlug';
import { getAllSupplierApi } from '~/api/supplierApi';
import { getAllCategoryApi } from '~/api/categoryApi';
import { getAllDiscountApi } from '~/api/discountApi';
import { getProductByIdApi, addProductApi, updateProductApi } from '~/api/productApi';

const schemaProduct = yup.object().shape({
  productName: yup.string().required('Vui lòng nhập tên sản phẩm'),
  productSlug: yup.string().required('Nhấn nút Generate slug để tạo slug'),
  productSku: yup.string(),
  productPrice: yup
    .number()
    .typeError('Vui lòng kiểm tra lại giá của sản phẩm')
    .min(0, 'Giá trị phải lớn hơn hoặc bằng 0')
    .integer('Giá trị phải là 1 số nguyên'),
  productInventory: yup
    .number()
    .typeError('Vui lòng kiểm tra lại số lượng')
    .integer('Giá trị phải là số nguyên')
    .positive('Giá trị phải là số dương')
    .min(0),
  productSupplier: yup.number().typeError('Vui lòng chọn nhà cung cấp'),
  productCategory: yup.number().typeError('Vui lòng chọn danh mục cho sản phẩm'),
  productDiscount: yup
    .number()
    .nullable()
    .transform((value, original) => (original === '' ? 0 : value)),
  productStatus: yup.string(),
  productDisplay: yup.string(),
  productThumbnail: yup.array(),
  productImages: yup.array(),
  productSpecifications: yup.string(),
  productDescription: yup.string(),
});

const optionStatus = [
  { title: 'Ngừng kinh doanh', value: 0 },
  { title: 'Đang kinh doanh', value: 1 },
];

const optionDisplay = [
  { title: 'Không hiển thị', value: 0 },
  { title: 'Đang hiển thị', value: 1 },
];

function ProductForm() {
  const { id } = useParams(); // Get id
  const [data, setData] = useState([]); // Save data after call API( by id)
  const [supplier, setSupplier] = useState([]); // Save data after call API
  const [category, setCategory] = useState([]); // Save data after call API
  const [discount, setDiscount] = useState([]); // Save data after call API

  const [productImages, setProductImages] = useState([]);
  const [productThumbnail, setProductThumbnail] = useState([]);
  const [productDescription, setProductDescription] = useState('');
  const [productSpecifications, setProductSpecifications] = useState('');

  const [isSuccess, setIsSuccess] = useState(false);

  const { handleSubmit, control, watch, setValue, clearErrors } = useForm({
    defaultValues: {
      productName: '',
      productSlug: '',
      productSku: '',
      productPrice: 0,
      productInventory: 0,
      productSupplier: '',
      productCategory: '',
      productDiscount: '',
      productStatus: '',
      productDisplay: '',
      productThumbnail: [],
      productImages: [],
      productSpecifications: '',
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
    formData.append('productName', data.productName);
    formData.append('productSlug', data.productSlug);
    formData.append('productSku', data.productSku);
    formData.append('productPrice', data.productPrice);
    formData.append('productSupplier', data.productSupplier);
    formData.append('productCategory', data.productCategory);
    formData.append('productDiscount', data.productDiscount);
    formData.append('productSpecifications', data.productSpecifications);
    formData.append('productDescription', data.productDescription);
    data.productInventory
      ? formData.append('productInventory', data.productInventory)
      : formData.append('productInventory', 0);

    data.productThumbnail[0]
      ? formData.append('productThumbnail', data.productThumbnail[0])
      : formData.append('productThumbnail', []);

    if (data.productImages.length > 0) {
      for (let i = 0; i < data.productImages.length; i++) {
        formData.append('productImages', data.productImages[i]);
      }
    } else {
      formData.append('productImages', []);
    }

    // console.log([...formData]);
    return formData;
  };

  // Handle click add submit
  const handleAdd = handleSubmit(async (data) => {
    setIsSuccess(true);
    const formData = handleFormData(data);
    try {
      const res = await addProductApi(formData);
      if (res?.status === 201) {
        toast.success(res?.message);
        setValue('productName', '');
        setValue('productSlug', '');
        setValue('productSku', '');
        setValue('productPrice', 0);
        setValue('productInventory', 0);
        setValue('productSupplier', '');
        setValue('productCategory', '');
        setValue('productDiscount', '');
        setValue('productSpecifications', '');
        setValue('productDescription', '');

        setProductDescription('');
        setProductSpecifications('');
        setProductThumbnail([]);
        setProductImages([]);
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
    console.log(1);
    setIsSuccess(true);
    let formData = handleFormData(data);
    formData.append('productStatus', data.productStatus);
    formData.append('productDisplay', data.productDisplay);
    try {
      const res = await updateProductApi(id, formData);
      if (res?.status === 200) {
        toast.success(res?.message);
        getDataById(id);
      } else {
        toast.error(res?.message);
      }
      setIsSuccess(false);
    } catch (error) {
      setIsSuccess(false);
      toast.error(error.message);
    }
  });

  // Get data by id category
  const getDataById = async (id) => {
    try {
      const res = await getProductByIdApi(id);
      if (res?.status === 200 && res?.data) {
        setData(res.data);
        setProductSpecifications(res.data[0]?.specifications);
        setProductDescription(res.data[0]?.description);
        setProductThumbnail([res.data[0]?.thumbnail] ?? []);
        setProductImages(res.data[0]?.images ?? []);
        setValue('productName', res.data[0]?.name);
        setValue('productSlug', res.data[0]?.slug);
        setValue('productSku', res.data[0]?.sku);
        setValue('productPrice', res.data[0]?.price);
        setValue('productInventory', res.data[0]?.inventory);
        setValue('productSupplier', res.data[0]?.supplier);
        setValue('productCategory', res.data[0]?.category);
        setValue('productDiscount', res.data[0]?.discount);
        setValue('productStatus', res.data[0]?.is_status);
        setValue('productDisplay', res.data[0]?.is_display);
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  // Get data select
  const getSupplierData = async () => {
    try {
      const result = await getAllSupplierApi();
      setSupplier(result.data);
    } catch (error) {}
  };

  const getCategoryData = async () => {
    try {
      const result = await getAllCategoryApi();
      setCategory(result.data);
    } catch (error) {}
  };

  const getDiscountData = async () => {
    try {
      const result = await getAllDiscountApi();
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
          {data.length > 0 ? 'Edit product for the system' : 'Create new product for the system'}
        </Typography>
      </Box>
      <Divider />

      <Paper elevation={6} sx={{ p: '30px', mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} xl={6}>
            <TypographyStyle component='label' htmlFor='productName' variant='h5' isRequired={true}>
              Product name
            </TypographyStyle>
            <TextFieldStyle control={control} name='productName' placeholder='Product name' />
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

          <Grid item xs={12} xl={4}>
            <TypographyStyle
              component='label'
              variant='h5'
              htmlFor='productSupplier'
              isRequired={true}
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
              isRequired={true}
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
            <TypographyStyle component='label' variant='h5' htmlFor='productDiscount'>
              Product discount
            </TypographyStyle>

            <SelectStyle
              control={control}
              name='productDiscount'
              options={discount}
              title='Chọn chương trình khuyến mãi'
            />
          </Grid>

          <Grid item xs={12} xl={4}>
            <TypographyStyle component='label' htmlFor='productSku' variant='h5' isRequired={true}>
              Product SKU
            </TypographyStyle>
            <TextFieldStyle control={control} name='productSku' placeholder='Product SKU' />
          </Grid>

          <Grid item xs={12} xl={4}>
            <TypographyStyle
              component='label'
              htmlFor='productPrice'
              variant='h5'
              isRequired={true}
            >
              Product price
            </TypographyStyle>
            <NumericFormatStyle control={control} name='productPrice' placeholder='Product Price' />
          </Grid>

          <Grid item xs={12} xl={4}>
            <TypographyStyle
              component='label'
              htmlFor='productInventory'
              variant='h5'
              isRequired={true}
            >
              Product inventory
            </TypographyStyle>

            <TextFieldStyle control={control} name='productInventory' />
          </Grid>

          {id ? (
            <>
              <Grid item xs={12} xl={4}>
                <TypographyStyle
                  component='label'
                  variant='h5'
                  htmlFor='productStatus'
                  isRequired={true}
                >
                  Product status
                </TypographyStyle>

                <SelectStyle
                  control={control}
                  name='productStatus'
                  options={optionStatus}
                  title='Chọn trạng thái'
                />
              </Grid>

              <Grid item xs={12} xl={4}>
                <TypographyStyle
                  component='label'
                  variant='h5'
                  htmlFor='productDisplay'
                  isRequired={true}
                >
                  Product display
                </TypographyStyle>

                <SelectStyle
                  control={control}
                  name='productDisplay'
                  options={optionDisplay}
                  title='Chọn để hiển thị hoặc ẩn sản phẩm'
                />
              </Grid>
            </>
          ) : null}

          <Grid item xs={12}>
            <TypographyStyle
              component='label'
              variant='h5'
              htmlFor='productThumbnail'
              isRequired={true}
              comment='Hình ảnh để làm ảnh đại diện cho sản phẩm'
            >
              Product thumbnail
            </TypographyStyle>

            <DropzoneStyle
              control={control}
              name='productThumbnail'
              multiple={false}
              files={productThumbnail}
              setFiles={setProductThumbnail}
            />
          </Grid>

          <Grid item xs={12}>
            <TypographyStyle
              component='label'
              variant='h5'
              htmlFor='productImages'
              comment='Hình ảnh hiển thị trong trang chi tiết sản phẩm'
            >
              Product images
            </TypographyStyle>

            <DropzoneStyle
              control={control}
              name='productImages'
              multiple={true}
              files={productImages}
              setFiles={setProductImages}
            />
          </Grid>

          <Grid item xs={12}>
            <TypographyStyle
              component='label'
              variant='h5'
              htmlFor='productSpecifications'
              comment='Thông số sản phẩm'
            >
              Product specifications
            </TypographyStyle>
            <CKEditorStyle
              control={control}
              name='productSpecifications'
              textValue={productSpecifications}
              setTextValue={setProductSpecifications}
            />
          </Grid>

          <Grid item xs={12}>
            <TypographyStyle
              component='label'
              variant='h5'
              htmlFor='productDescription'
              comment='Mô tả sản phẩm'
            >
              Product descriptions
            </TypographyStyle>
            <CKEditorStyle
              control={control}
              name='productDescription'
              textValue={productDescription}
              setTextValue={setProductDescription}
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
                Update product...
              </>
            ) : (
              'Update product'
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
                Create product...
              </>
            ) : (
              'Create product'
            )}
          </ButtonStyle>
        )}
      </Paper>
    </Box>
  );
}

export default ProductForm;
