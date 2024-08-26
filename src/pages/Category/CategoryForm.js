import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { convertSlug } from '~/utils/convertSlug';
import DropzoneStyle from '~/components/DropzoneStyle';
import TextFieldStyle from '~/components/FormStye/TextFieldStyle';
import TypographyStyle from '~/components/FormStye/TypographyStyle';
import ButtonStyle from '~/components/ButtonStyle';
import BreadcrumbStyle from '~/components/BreadcrumbStyle';
import { addCategory } from '~/api/categoryApi';

const schemaCategory = yup.object().shape({
  categoryName: yup.string().required('Vui lòng nhập tên danh mục'),
  categorySlug: yup.string().required('Nhấn nút Generate slug để tạo slug'),
  categoryImage: yup.array(),
});

function CategoryForm() {
  const [files, setFiles] = useState([]);
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
    const formData = new FormData();
    formData.append('categoryName', data.categoryName);
    formData.append('categorySlug', data.categorySlug);
    formData.append('categoryImage', data.categoryImage[0]);
    try {
      const res = await addCategory(formData);
      if (res) {
        alert(res);
        setFiles([]);
        setValue('categoryName', '');
        setValue('categorySlug', '');
        setValue('categoryImage', files);
      }
    } catch (error) {
      alert(error);
    }
  });

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

          <Box>
            <TypographyStyle
              component='label'
              variant='h5'
              htmlFor='categorySlug'
            >
              Category image
            </TypographyStyle>

            <DropzoneStyle
              control={control}
              name='categoryImage'
              multiple={true}
              files={files}
              setFiles={setFiles}
            />
          </Box>
        </Box>

        <ButtonStyle
          variant='contained'
          size='large'
          sx={{ mt: 4 }}
          onClick={() => onSubmit()}
        >
          Create category
        </ButtonStyle>
      </Paper>
    </Box>
  );
}

export default CategoryForm;
