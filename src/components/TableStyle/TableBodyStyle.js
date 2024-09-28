import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { Link } from 'react-router-dom';

import images from '~/assets/img';
import classnames from 'classnames/bind';
import styles from './TableStyle.module.scss';

import { NumericFormat } from 'react-number-format';
import { Controller } from 'react-hook-form';

const cx = classnames.bind(styles);

const theme = createTheme({
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '1.4rem',
          color: '#495057',
          textAlign: 'center',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: '1.4rem',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '1.2rem',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontSize: '1.4rem',
          minWidth: '100px',
        },
      },
    },
    MuiMenuItem: { styleOverrides: { root: { fontSize: '1.4rem' } } },
  },
});

function TableBodyStyle({ columns, tableData, actions, control, setValue }) {
  const onErrorImg = (e) => {
    e.target.src = images.imgPlacehoder;
  };

  const renderBasic = (column, data, id, value, onChange) => {
    switch (column?.component) {
      case 'image': {
        return (
          <TableCell key={column.accessor}>
            <img
              src={`${data}`}
              alt=''
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover',
              }}
              onError={(e) => onErrorImg(e)}
            />
          </TableCell>
        );
      }
      case 'chip': {
        return (
          <TableCell key={column.accessor}>
            {column.displayType.map((col) => {
              if (col.value === data) {
                return (
                  <Chip key={col.value} label={col.title} color={col.color} variant='outlined' />
                );
              }
              return '';
            })}
          </TableCell>
        );
      }
      case 'select': {
        return (
          <TableCell key={column.accessor}>
            <Select value={value} onChange={onChange}>
              {column.displayType.map((col) => (
                <MenuItem key={col.value} value={col.value}>
                  {col.title}
                </MenuItem>
              ))}
            </Select>
          </TableCell>
        );
      }
      case 'currency': {
        return (
          <TableCell key={column.accessor}>
            <NumericFormat displayType='text' value={data} suffix=' vnd' thousandSeparator />
          </TableCell>
        );
      }
      case 'actions': {
        return (
          <TableCell key={column.accessor}>
            {actions.map((action, index) => {
              if (action?.to) {
                return (
                  <Link
                    key={index}
                    to={action?.to ? `${action.to}/${id}` : null}
                    className={cx('action-link')}
                  >
                    <Button
                      data-edit={1}
                      component='div'
                      variant='contained'
                      startIcon={action?.icon}
                      // onClick={action?.onClick ? action.onClick : null}
                      {...action?.css}
                    >
                      {action?.title}
                    </Button>
                  </Link>
                );
              }
            })}
          </TableCell>
        );
      }
      default:
        const cellData = data ? data : ''; // render data text basic
        return <TableCell key={column.accessor}>{cellData}</TableCell>;
    }
  };

  const renderController = (column, data, name, id) => {
    let accessor = column.accessor;
    setValue(`formList.${name}.${accessor}`, data);
    return (
      <Controller
        key={column.accessor}
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => renderBasic(column, data, id, value, onChange)}
      />
    );
  };

  const renderTableBody = () =>
    tableData.map((data, index) => (
      <TableRow key={data.id}>
        {columns.map((col) => {
          if (col?.component && !col?.editTable) {
            return renderBasic(col, data[col.accessor], data.id);
          } else {
            let accessor = col.accessor;
            let name = `formList.${index}.${accessor}`;
            if (typeof setValue === 'function') {
              setValue(`formList.${index}.${accessor}`, data[col.accessor]);
              setValue(`formList.${index}.id`, data.id);
            }
            return renderController(col, data[col.accessor], name, data.id);
          }
        })}
      </TableRow>
    ));

  return (
    <ThemeProvider theme={theme}>
      <TableBody>
        {tableData.length > 0 ? (
          renderTableBody()
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} sx={{ fontSize: '1.6rem' }}>
              No data
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </ThemeProvider>
  );
}

export default TableBodyStyle;
