import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Box } from 'grommet';

const PersonsList = ({ match }) => (
  <Box flex align="center" justify="center">
    <h3>
      ID:
      {match.params.personType}
    </h3>
  </Box>
);

PersonsList.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape(),
  }).isRequired,
};

export default withRouter(PersonsList);
