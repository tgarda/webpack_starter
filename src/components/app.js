import React from 'react';
import NavBar from './navBar';

import test_image from '../test-image';
import styles from '../../style/app.css';

const App = (props) => (
  <div className='appComp' >
    <NavBar />
    <div>
      <h1 className={styles.header}>This is our app component gg</h1>
      <p>test image: {test_image}</p>
      {props.children}
    </div>
  </div>
)

export default App;
