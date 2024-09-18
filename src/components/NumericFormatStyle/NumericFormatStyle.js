import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { ThemeProvider, createTheme } from '@mui/material';

import { Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

const theme = createTheme({
  components: {
    MuiFormControl: {
      styleOverrides: {
        root: {
          width: '100%',
        },
      },
    },
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

function NumericFormatStyle({ control, name, ...props }) {
  return (
    <ThemeProvider theme={theme}>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <FormControl>
            <NumericFormat
              error={!!error}
              value={value}
              suffix=' vnd'
              customInput={TextField}
              thousandSeparator
              onValueChange={(e) => onChange(e.value)}
              {...props}
            />
            <FormHelperText error={!!error}>{error?.message}</FormHelperText>
          </FormControl>
        )}
      />
    </ThemeProvider>
  );
}

export default NumericFormatStyle;
