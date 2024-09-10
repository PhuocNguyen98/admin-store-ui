import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import { ThemeProvider, createTheme } from '@mui/material';

import { Controller } from 'react-hook-form';

const themeOutlinedInput = createTheme({
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '1.5rem',
          color: '#495057',
        },
      },
    },
    MuiTypography: {
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

function OutlinedInputStyle({ control, name, ...props }) {
  return (
    <ThemeProvider theme={themeOutlinedInput}>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <>
            <OutlinedInput
              value={value}
              onChange={onChange}
              error={!!error}
              {...props}
            />
            <FormHelperText error={!!error}>{error?.message}</FormHelperText>
          </>
        )}
      />
    </ThemeProvider>
  );
}

export default OutlinedInputStyle;
