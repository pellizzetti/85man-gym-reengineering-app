import React from 'react';
import PropTypes from 'prop-types';
import {
  Box, Button, Clock, Heading,
} from 'grommet';
import { Close, Menu } from 'grommet-icons';

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
      <Heading level="3" margin="none">
        GMV - Academia
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
