import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import { useState } from 'react';

import { ToastContainer } from 'react-toastify';

import BreadcrumbStyle from '~/components/BreadcrumbStyle';

import InformationForm from './InformationForm';
import PasswordForm from './PasswordForm';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function Profile() {
  const [tabValue, setTabValue] = useState(0);
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <ToastContainer />
      <Box>
        <BreadcrumbStyle />
        <Typography
          variant='h3'
          component='h4'
          sx={{
            fontWeight: 600,
            color: 'text.primary',
          }}
        >
          Profile
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleChange}>
          <Tab
            label='Information'
            {...a11yProps(0)}
            sx={{ fontSize: '1.4rem', textTransform: 'capitalize' }}
          />
          <Tab
            label='Password'
            {...a11yProps(1)}
            sx={{ fontSize: '1.4rem', textTransform: 'capitalize' }}
          />
        </Tabs>
      </Box>

      <CustomTabPanel value={tabValue} index={0}>
        <InformationForm />
      </CustomTabPanel>

      <CustomTabPanel value={tabValue} index={1}>
        <PasswordForm />
      </CustomTabPanel>
    </Box>
  );
}

export default Profile;
