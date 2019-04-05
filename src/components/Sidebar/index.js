import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Anchor, Box, Button, Collapsible, Layer, ResponsiveContext,
} from 'grommet';
import { FormClose } from 'grommet-icons';

import menuItens from '~/utils/menu';

const List = props => <Box fill tag="ul" {...props} />;

const ListItem = props => (
  <Box tag="li" border="bottom" pad="small" direction="row" align="center" {...props} />
);

const Sidebar = ({ showSidebar, handleSidebarClose }) => (
  <ResponsiveContext.Consumer>
    {size => (!showSidebar || size !== 'small' ? (
      <Collapsible direction="horizontal" open={showSidebar}>
        <Box
          flex
          width="medium"
          background="light-2"
          elevation="small"
          align="center"
          justify="center"
        >
          <List>
            {menuItens.map(item => (
              <ListItem key={item.slug}>
                <Anchor as={Link} to={`/${item.slug}`} icon={item.icon} label={item.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Collapsible>
    ) : (
      <Layer>
        <Box background="light-2" tag="header" justify="end" align="center" direction="row">
          <Button icon={<FormClose />} onClick={handleSidebarClose} />
        </Box>
        <Box fill background="light-2" align="center" justify="center">
            app sidebar
        </Box>
      </Layer>
    ))
    }
  </ResponsiveContext.Consumer>
);

Sidebar.propTypes = {
  showSidebar: PropTypes.bool.isRequired,
  handleSidebarClose: PropTypes.func.isRequired,
};

export default Sidebar;
