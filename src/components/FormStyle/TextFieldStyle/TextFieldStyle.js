import TextField from '@mui/material/TextField';
import { Controller } from 'react-hook-form';
import { ThemeProvider, createTheme } from '@mui/material';

const themeTextField = createTheme({
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '1.5rem',
          color: '#495057',
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: '1.1rem',
        },
      },
    },
  },
});

function TextFieldStyle({
  control,
  name,
  id = name,
  placeholder,
  disabled,
  variant = 'outlined',
  defaultValue,
  label,
  type = 'text',
  required = false,
  rows = 1,
  multiline = false,
  autofocus = false,
  ...props
}) {
  return (
    <ThemeProvider theme={themeTextField}>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue ? defaultValue : ''}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => (
          <TextField
            fullWidth
            type={type}
            id={id}
            placeholder={placeholder}
            disabled={disabled}
            variant={variant}
            label={label}
            required={required}
            rows={rows}
            multiline={multiline}
            autoFocus={autofocus}
            value={value}
            onChange={onChange}
            error={!!error}
            helperText={error ? error.message : ''}
            {...props}
            sx={{
              '& .MuiInputBase-root.Mui-disabled.Mui-error': {
                '& > fieldset': {
                  borderColor: '#d32f2f',
                },
              },
            }}
          />
        )}
      />
    </ThemeProvider>
  );
}

export default TextFieldStyle;
