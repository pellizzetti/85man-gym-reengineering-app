import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import menuItens from '~/utils/menu';

const Routes = () => (
  <Switch>
    {menuItens.map(
      route => !route.group && (
      <Route
        key={`${route.slug}-${route.paramRoute}`}
        path={`/${route.path}${route.paramRoute}`}
        exact={route.exact}
        component={route.component}
      />
      ),
    )}
    <Redirect from="*" to="/dashboard" />
  </Switch>
);

export default Routes;
