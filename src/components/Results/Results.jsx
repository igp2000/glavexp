import React, { useEffect, useState } from 'react';

import styles from './Results.module.scss';

const Results = ({ stateData }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow('id' in stateData[0]);
  }, [stateData]);

  return (
    <>
      {show && (
        <div className={styles.results}>
          <fieldset>
            <legend>Результат</legend>
            {stateData.map((item, index) => (
              <div key={item.id}>
                <span className={styles.number}>{index + 1}.</span>
                <span>{item.url}</span>
                <textarea
                  value={`${item.title}\n${item.description}`}
                  readOnly
                  style={item.isError ? { border: '1px solid #f00' } : null}
                />
              </div>
            ))}
          </fieldset>
        </div>
      )}
    </>
  );
};

export default Results;
