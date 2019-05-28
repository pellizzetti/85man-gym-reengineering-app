import React from 'react';
import { Redirect, Switch } from 'react-router-dom';

import Dashboard from '~/pages/dashboard';

import StudentsList from '~/pages/students/list';
import StudentsForm from '~/pages/students/form';

import ProductsList from '~/pages/products/list';
import ProductsForm from '~/pages/products/form';

import Route from './Route';

const Routes = () => (
  <Switch>
    <Route path="/dashboard" component={Dashboard} />

    <Route exact path="/students" component={StudentsList} />
    <Route path="/students/new" component={StudentsForm} />
    <Route path="/students/edit/:id" component={StudentsForm} />

    <Route exact path="/products" component={ProductsList} />
    <Route path="/products/new" component={ProductsForm} />
    <Route path="/products/edit/:id" component={ProductsForm} />

    <Redirect from="*" to="/dashboard" />
  </Switch>
);

export default Routes;
