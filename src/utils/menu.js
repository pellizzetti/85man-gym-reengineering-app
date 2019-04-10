import React from 'react';
import slugify from 'slugify';
import {
  Home, UserAdd, UserWorker, UserNew, UserManager,
} from 'grommet-icons';

import Dashboard from '~/pages/dashboard';
import PersonsList from '~/pages/persons/list';

const withGetters = (obj) => {
  Object.defineProperty(obj, 'slug', {
    get() {
      return slugify(this.label, { lower: true });
    },
  });

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
    component: () => <Dashboard />,
  }),
  withGetters({
    icon: <UserAdd />,
    label: 'Item 1',
    component: () => <PersonsList />,
    paramKey: 'personType',
    paramValue: 'UserAdd',
  }),

  withGetters({
    icon: <UserWorker />,
    label: 'Item 2',
    component: () => <PersonsList />,
    paramKey: 'personType',
    paramValue: 'UserWorker',
  }),
  withGetters({
    icon: <UserNew />,
    label: 'Item 3',
    component: () => <PersonsList />,
    paramKey: 'personType',
    paramValue: 'UserNew',
  }),
  withGetters({
    icon: <UserManager />,
    label: 'Item 4',
    component: () => <PersonsList />,
    paramKey: 'personType',
    paramValue: 'UserManager',
  }),
];

export default menuItens;
