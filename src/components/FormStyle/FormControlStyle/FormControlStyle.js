import FormControl from '@mui/material/FormControl';

function FormControlStyle({ children, ...props }) {
  return <FormControl {...props}>{children}</FormControl>;
}

export default FormControlStyle;
