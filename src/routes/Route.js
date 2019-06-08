import PropTypes from 'prop-types';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import Layout from '~/layouts';

function RouteWrapper({ component: Component, isPrivate = false, ...rest }) {
  const authenticated = false;

  if (!authenticated && isPrivate) {
    return <Redirect to="/" />;
  }

  if (authenticated && !isPrivate) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Route
      {...rest}
      render={props => (
        <Layout>
          <Component {...props} />
        </Layout>
      )}
    />
  );
}

RouteWrapper.propTypes = {
  isPrivate: PropTypes.bool,
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired
};

RouteWrapper.defaultProps = {
  isPrivate: false
};

export default RouteWrapper;
