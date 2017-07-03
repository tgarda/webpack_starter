import { render } from 'react-dom';
import React from 'react';
import Users from './containers/users';
import { Provider } from 'react-redux';
import UsersStore from './store';
import { Switch, Router, Route } from 'react-router';
import HashHistory from 'history/createHashHistory';
import App from './components/app';
import Home from './components/home';
import UserProfile from './containers/userProfile';

import test_image from './test-image';
import styles from '../style/index.css';

import $ from 'jquery';

//this applies CSS globally
require('../style/globalStyle.css');

const Main2 = () => {
  return (
    <div>
      <h1>Hello2</h1>
    </div>
  )
}

render (
  <div>
    <Provider store={UsersStore}>
      <Router history={new HashHistory()} >
        <App>
          <Switch>
            <Route path='/users' component={Users} />
            <Route path='/user:userName' component={UserProfile} />
            <Route exact path='/' component={Home} />
          </Switch>
        </App>
      </Router>
    </Provider>
    <p>
      {` DEV: ${DEVELOPMENT.toString()} `} <br />
      {` PROD: ${PRODUCTION.toString()} `} <br />
    </p>
    <p>
      <div id="menu">
        <button id="loadPage1">Load test page 1</button>
        <button id="loadPage2">Load Page 2</button>
      </div>
      <div id="content">
        <h1>Test Home</h1>
      </div>
    </p>
    <p className='globalp'>
      {/* test image: ${test_image} */}
      test image:
      <img src={require('./img/alphatest.png')} />
      <img src={require('./img/test-warning.png')} />
      <img src={require('./img/alphatest.png')} />
      <img src={require('./img/test-warning.png')} />
    </p>
  </div>,

  document.getElementById('app')
);

document.getElementById('loadPage1').addEventListener('click', () => {
  System.import('./test-page1')
    .then(pageModule => {
      document.getElementById('content').innerHTML = pageModule.default;
    })
});

document.getElementById('loadPage2').addEventListener('click', () => {
  System.import('./test-page2')
    .then(pageModule => {
      document.getElementById('content').innerHTML = pageModule.default;
    })
});

$('#app').css('background-color', 'yellow');

if(DEVELOPMENT) {
  //Hot Module Replacement
  if (module.hot) {
    module.hot.accept();
  }
}
