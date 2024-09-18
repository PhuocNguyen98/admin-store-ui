import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { ThemeProvider, createTheme } from '@mui/material';

import { Controller } from 'react-hook-form';

const themeSelect = createTheme({
  components: {
    MuiSelect: {
      styleOverrides: {
        root: {
          fontSize: '1.4rem',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '1.4rem',
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

function SelectStyle({ control, name, options, title, ...props }) {
  return (
    <ThemeProvider theme={themeSelect}>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <FormControl fullWidth>
            <Select
              onChange={onChange}
              value={
                value === undefined || value === null || options.length === 0
                  ? ''
                  : value
              }
              error={!!error}
              {...props}
            >
              <MenuItem disabled>{title}</MenuItem>
              {options.length > 0 ? (
                options.map((item) => {
                  return (
                    <MenuItem key={item.value} value={item.value}>
                      {item.title}
                    </MenuItem>
                  );
                })
              ) : (
                <span
                  style={{ display: 'block', textAlign: 'center', padding: 10 }}
                >
                  No data available
                </span>
              )}
            </Select>
            <FormHelperText error={!!error}>{error?.message}</FormHelperText>
          </FormControl>
        )}
      />
    </ThemeProvider>
  );
}

export default SelectStyle;
