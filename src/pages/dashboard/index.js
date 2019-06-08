import React from 'react';
import { Box, Heading } from 'grommet';

import Logo from './styles';

import logoImage from '~/assets/images/logo.png';

const Dashboard = () => (
  <Box flex align="center" justify="center" direction="row">
    <Logo src={logoImage} alt="Logo da GMV" />
    <Heading level="2" color="brand">
      Dashboard
    </Heading>
  </Box>
);

export default Dashboard;
