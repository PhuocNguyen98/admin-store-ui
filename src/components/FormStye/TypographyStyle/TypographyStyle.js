import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material';
import classname from 'classnames/bind';
import styles from './TypographyStyle.module.scss';

const cx = classname.bind(styles);

const themeTypography = createTheme({
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#303548',
          fontSize: '1.6rem',
          fontWeight: 600,
          display: 'inline-block',
          marginBottom: '6px',
          position: 'relative',
        },
      },
    },
  },
});

function TypographyStyle({
  component = 'label',
  variant,
  htmlFor,
  isRequired = false, // Hiển thị dấu * => trường bắt buộc phải điền
  comment, // Tạo ra đoạn giải thích về chức năng( nếu cần)
  children,
  ...props
}) {
  return (
    <ThemeProvider theme={themeTypography}>
      <Typography
        component={component}
        htmlFor={htmlFor}
        variant={variant}
        {...props}
      >
        {children}
        {isRequired ? <span className={cx('asterisk')}>*</span> : ''}
        {comment ? (
          <span className={cx('comment')}>(&nbsp;{comment}&nbsp;)</span>
        ) : (
          ''
        )}
      </Typography>
    </ThemeProvider>
  );
}

export default TypographyStyle;
