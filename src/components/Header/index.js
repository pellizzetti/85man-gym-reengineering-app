import React from 'react';
import PropTypes from 'prop-types';
import {
  Box, Button, Clock, Heading,
} from 'grommet';
import { Close, Menu } from 'grommet-icons';

import Logo from './styles';

import logoImage from '~/assets/images/logo.png';

const Header = ({ showSidebar, handleSidebarToggle }) => (
  <Box
    tag="header"
    direction="row"
    align="center"
    background="brand"
    justify="between"
    pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    elevation="medium"
    style={{ zIndex: '1' }}
  >
    <Box direction="row" align="center">
      <Button icon={showSidebar ? <Close /> : <Menu />} onClick={handleSidebarToggle} />
      <Logo src={logoImage} alt="Logo da GMV" />
      <Heading level="3" margin={{ left: 'xsmall', top: 'none', bottom: 'none' }}>
        GMV
      </Heading>
    </Box>
    <Clock type="digital" />
  </Box>
);

Header.propTypes = {
  showSidebar: PropTypes.bool.isRequired,
  handleSidebarToggle: PropTypes.func.isRequired,
};

export default Header;
