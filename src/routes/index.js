import React from 'react';
import { Redirect, Switch } from 'react-router-dom';

import Dashboard from '~/pages/dashboard';

import StudentsList from '~/pages/students/list';
import StudentsForm from '~/pages/students/form';

import ProductsList from '~/pages/products/list';
import ProductsForm from '~/pages/products/form';

import InstructorsList from '~/pages/instructors/list';
import InstructorsForm from '~/pages/instructors/form';

import ActivitiesList from '~/pages/activities/list';
import ActivitiesForm from '~/pages/activities/form';

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

    <Route exact path="/instructors" component={InstructorsList} />
    <Route path="/instructors/new" component={InstructorsForm} />
    <Route path="/instructors/edit/:id" component={InstructorsForm} />

    <Route exact path="/activities" component={ActivitiesList} />
    <Route path="/activities/new" component={ActivitiesForm} />
    <Route path="/activities/edit/:id" component={ActivitiesForm} />

    <Redirect from="*" to="/dashboard" />
  </Switch>
);

export default Routes;
