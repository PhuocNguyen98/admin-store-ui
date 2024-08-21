import styles from './BaseStyle.module.scss';

import { Fragment } from 'react';
import { GlobalStyles } from '@mui/material';

const GlobalStylesCss = <GlobalStyles styles={styles} />;

function GlobalStyle({ children }) {
  return (
    <Fragment>
      {GlobalStylesCss}
      {children}
    </Fragment>
  );
}

export default GlobalStyle;
