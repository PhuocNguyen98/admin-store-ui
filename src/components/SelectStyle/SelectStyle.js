import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
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
  },
});

function SelectStyle({ control, name, options }) {
  return (
    <ThemeProvider theme={themeSelect}>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => (
          <FormControl fullWidth>
            <Select onChange={onChange} value={value}>
              {options.length > 0
                ? options.map((item, index) => {
                    return (
                      <MenuItem key={index} value={item.value}>
                        {item.title}
                      </MenuItem>
                    );
                  })
                : null}
            </Select>
          </FormControl>
        )}
      />
    </ThemeProvider>
  );
}

export default SelectStyle;
