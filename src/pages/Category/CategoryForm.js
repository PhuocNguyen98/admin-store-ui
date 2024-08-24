import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import AutorenewIcon from '@mui/icons-material/Autorenew';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { convertSlug } from '~/utils/convertSlug';
import DropzoneStyle from '~/components/DropzoneStyle';

const schemaCategory = yup.object().shape({
  categoryName: yup.string().required('Vui lòng nhập tên danh mục'),
  categorySlug: yup.string().required('Nhấn nút Generate slug để tạo slug'),
  categoryImage: yup.array(),
});

function CategoryForm() {
  const { handleSubmit, control, watch, setValue, clearErrors } = useForm({
    defaultValues: {
      categoryName: '',
      categorySlug: '',
      categoryImage: [],
    },
    resolver: yupResolver(schemaCategory),
  });

  const watchCategoryName = watch('categoryName', '');
  const handleGenerateSlug = (name) => {
    let slug;
    if (name) {
      slug = convertSlug(name);
    }
    setValue('categorySlug', slug);
    clearErrors('categorySlug');
  };

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
  });

  return (
    <div className='wrapper'>
      <Box>
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
          Create new category for the system
        </Typography>
      </Box>
      <Divider />
      <Box width='50%' mt={3} component='form' action='POST'>
        <Controller
          control={control}
          name='categoryName'
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Box mb={3}>
              <Typography
                component='label'
                htmlFor='categoryName'
                variant='h5'
                sx={{ display: 'inline-block', mb: 1 }}
              >
                Category name <span className='asterisk'>*</span>
              </Typography>
              <TextField
                fullWidth
                id='categoryName'
                placeholder='Category name'
                value={value}
                onChange={onChange}
                error={error ? true : false}
                helperText={error?.message ? error.message : ''}
              />
            </Box>
          )}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Controller
            control={control}
            name='categorySlug'
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Box mb={3} flex={1}>
                <Typography
                  component='label'
                  variant='h5'
                  htmlFor='categorySlug'
                  sx={{ display: 'inline-block', mb: 1 }}
                >
                  Category slug <span className='asterisk'>*</span>
                </Typography>
                <TextField
                  fullWidth
                  id='categorySlug'
                  placeholder='Category slug'
                  readOnly={true}
                  disabled={true}
                  value={value}
                  onChange={onChange}
                  error={error ? true : false}
                  helperText={error?.message ? error.message : ''}
                />
              </Box>
            )}
          />
          <Button
            sx={{ ml: 1 }}
            variant='contained'
            color='primary'
            startIcon={<AutorenewIcon />}
            disabled={!!watchCategoryName ? false : true}
            onClick={() => handleGenerateSlug(watchCategoryName)}
          >
            Generate slug
          </Button>
        </Box>

        <Box>
          <Typography
            component='label'
            variant='h5'
            htmlFor='categorySlug'
            sx={{ display: 'inline-block', mb: 1 }}
          >
            Category image
          </Typography>
          <DropzoneStyle
            control={control}
            name='categoryImage'
            multiple={true}
          />
        </Box>
      </Box>
      <Button
        variant='contained'
        size='large'
        sx={{ mt: 3 }}
        onClick={() => onSubmit()}
      >
        Create category
      </Button>
    </div>
  );
}

export default CategoryForm;
