import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Box, Grommet } from 'grommet';

import Header from '~/components/Header';
import Sidebar from '~/components/Sidebar';

import theme from '~/theme';

class Layout extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]).isRequired,
  };

  state = {
    showSidebar: true,
  };

  handleSidebarToggle = () => {
    this.setState(prevState => ({ showSidebar: !prevState.showSidebar }));
  };

  handleSidebarClose = () => {
    this.setState({ showSidebar: false });
  };

  render() {
    const { showSidebar } = this.state;
    const { children } = this.props;

    return (
      <Grommet theme={theme} full>
        <Box fill>
          <Header showSidebar={showSidebar} handleSidebarToggle={this.handleSidebarToggle} />
          <Box direction="row" flex overflow={{ horizontal: 'hidden' }}>
            <Sidebar showSidebar={showSidebar} handleSidebarClose={this.handleSidebarClose} />
            {children}
          </Box>
        </Box>
      </Grommet>
    );
  }
}

export default Layout;
