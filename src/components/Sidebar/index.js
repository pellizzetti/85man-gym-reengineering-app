import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
  Anchor, Box, Button, Collapsible, Layer, ResponsiveContext,
} from 'grommet';
import { FormClose } from 'grommet-icons';

import menuItens from '~/utils/menu';

const List = props => <Box fill tag="ul" {...props} />;

const ListItem = props => (
  <Box
    border={{
      color: 'border',
      size: 'xsmall',
      style: 'outset',
      side: 'bottom',
    }}
    margin="small"
    direction="row"
    align="center"
    {...props}
  />
);

const renderList = history => (
  <List>
    {menuItens.map(item => (
      <ListItem key={item.slug}>
        <Anchor
          onClick={() => {
            history.push(`/${item.slug}${item.paramAnchor}`);
          }}
          icon={item.icon}
          label={item.label}
          margin={{ top: 'xsmall', bottom: 'small' }}
        />
      </ListItem>
    ))}
  </List>
);

const Sidebar = ({ showSidebar, handleSidebarClose, history }) => (
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
          {renderList(history)}
        </Box>
      </Collapsible>
    ) : (
      <Layer>
        <Box background="light-2" tag="header" justify="end" align="center" direction="row">
          <Button icon={<FormClose />} onClick={handleSidebarClose} />
        </Box>
        <Box fill background="light-2" align="center" justify="center">
          {renderList()}
        </Box>
      </Layer>
    ))
    }
  </ResponsiveContext.Consumer>
);

Sidebar.propTypes = {
  showSidebar: PropTypes.bool.isRequired,
  handleSidebarClose: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default withRouter(Sidebar);
