import React, { useState } from 'react';

import { UrlsForm } from '../UrlsForm';
import { Results } from '../Results';

import styles from './App.module.scss';

const App = () => {
  const [stateData, setStateData] = useState([{ url: '', title: '', description: '', isError: false }]);

  return (
    <div className={styles.main}>
      <h1>Запрос данных</h1>
      <UrlsForm setStateData={setStateData} />
      <Results stateData={stateData} />
    </div>
  );
};

export default App;
