import React from 'react';
import {
  Home, UserAdd, UserWorker, UserNew, UserManager,
} from 'grommet-icons';

import Dashboard from '~/pages/dashboard';
import PersonsList from '~/pages/persons/list';

const withGetters = (obj) => {
  Object.defineProperty(obj, 'paramRoute', {
    get() {
      return this.paramKey ? `/:${this.paramKey}` : '';
    },
  });

  Object.defineProperty(obj, 'paramAnchor', {
    get() {
      return this.paramValue ? `/${this.paramValue}` : '';
    },
  });

  return obj;
};

const menuItens = [
  withGetters({
    icon: <Home />,
    exact: true,
    label: 'Dashboard',
    path: 'dashboard',
    group: false,
    component: () => <Dashboard />,
  }),
  withGetters({
    icon: <UserAdd />,
    label: 'Item 1',
    path: 'persons',
    paramKey: 'personType',
    paramValue: 'UserAdd',
    group: false,
    component: () => <PersonsList />,
  }),
  withGetters({
    icon: <UserWorker />,
    label: 'Item 2',
    path: 'persons',
    paramValue: 'UserWorker',
    group: true,
  }),
  withGetters({
    icon: <UserNew />,
    label: 'Item 3',
    path: 'persons',
    paramValue: 'UserNew',
    group: true,
  }),
  withGetters({
    icon: <UserManager />,
    label: 'Item 4',
    path: 'persons',
    paramValue: 'UserManager',
    group: true,
  }),
];

export default menuItens;
