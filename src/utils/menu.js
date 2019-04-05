import React from 'react';
import slugify from 'slugify';
import { Box } from 'grommet';
import {
  Home, UserAdd, UserWorker, UserNew, UserManager,
} from 'grommet-icons';

import Dashboard from '~/pages/dashboard';

const menuItens = [
  {
    icon: <Home />,
    exact: true,
    label: 'Dashboard',
    component: () => <Dashboard />,
    get slug() {
      return slugify(this.label, { lower: true });
    },
  },
  {
    icon: <UserAdd />,
    label: 'Item 1',

    component: () => (
      <Box flex align="center" justify="center">
        Item 1
      </Box>
    ),
    get slug() {
      return slugify(this.label, { lower: true });
    },
  },
  {
    icon: <UserWorker />,
    label: 'Item 2',
    component: () => (
      <Box flex align="center" justify="center">
        Item 2
      </Box>
    ),
    get slug() {
      return slugify(this.label, { lower: true });
    },
  },
  {
    icon: <UserNew />,
    label: 'Item 3',
    component: () => (
      <Box flex align="center" justify="center">
        Item 3
      </Box>
    ),
    get slug() {
      return slugify(this.label, { lower: true });
    },
  },
  {
    icon: <UserManager />,
    label: 'Item 4',
    component: () => (
      <Box flex align="center" justify="center">
        Item 4
      </Box>
    ),
    get slug() {
      return slugify(this.label, { lower: true });
    },
  },
];

export default menuItens;
