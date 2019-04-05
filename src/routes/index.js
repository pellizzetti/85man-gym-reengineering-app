import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import menuItens from '~/utils/menu';

const Routes = () => (
  <Switch>
    {menuItens.map(route => (
      <Route
        key={route.slug}
        path={`/${route.slug}`}
        exact={route.exact}
        component={route.component}
      />
    ))}
    <Redirect from="*" to="/dashboard" />
  </Switch>
);

export default Routes;
