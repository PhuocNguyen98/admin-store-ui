import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { Controller } from 'react-hook-form';
import { ThemeProvider, createTheme } from '@mui/material';

const themeDatePicker = createTheme({
  components: {
    MuiStack: {
      styleOverrides: {
        root: {
          paddingTop: '0px !important',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          width: '100%',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: '1.5rem',
          color: '#495057',
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: '2rem',
        },
      },
    },
  },
});

function DatePickerStyle({ control, name }) {
  return (
    <ThemeProvider theme={themeDatePicker}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker']}>
          <Controller
            control={control}
            name={name}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <DatePicker
                autoFocus={false}
                inputFormat='DD-MM-YYYY'
                value={value ? value : null}
                onChange={onChange}
                format='DD-MM-YYYY'
                slotProps={{
                  textField: {
                    error: !!error,
                    helperText: error?.message,
                    sx: {
                      '& .MuiFormHelperText-root.Mui-error': {
                        fontSize: '1.1rem',
                      },
                    },
                  },
                  calendarHeader: {
                    sx: {
                      '& .MuiPickersCalendarHeader-labelContainer': {
                        fontSize: '1.5rem',
                      },
                      '& .MuiSvgIcon-root': {
                        fontSize: '2.4rem',
                      },
                    },
                  },
                  yearButton: {
                    sx: {
                      fontSize: '1.4rem',
                    },
                  },
                  day: {
                    sx: {
                      fontSize: '1.4rem',
                    },
                  },
                  popper: {
                    sx: {
                      '& .MuiTypography-root.MuiDayCalendar-weekDayLabel': {
                        fontSize: '1.2rem',
                      },
                    },
                  },
                }}
              />
            )}
          />
        </DemoContainer>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default DatePickerStyle;
