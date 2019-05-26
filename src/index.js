import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ToastContainer } from 'react-toastify';

import Routes from '~/routes';

import * as serviceWorker from '~/serviceWorker';

import 'react-toastify/dist/ReactToastify.css';

const history = createBrowserHistory();

const Index = () => (
  <Router history={history}>
    <Routes />
    <ToastContainer position="top-left" />
  </Router>
);

ReactDOM.render(<Index />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
