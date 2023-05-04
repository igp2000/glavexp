import React from 'react';

import styles from './InputUrl.module.scss';

const InputUrl = ({ index, register, remove, setStateData, errors = [] }) => {

  const deleteClick = (event) => {
    setStateData((st) => [...st.slice(0, index), ...st.slice(index + 1)]);
    remove(index);
    event.preventDefault();
  };

  return (
    <div className={styles.input}>
      <div className={styles.number}>{index + 1}</div>
      <input
        className={`${styles['input-text']} ${errors[index] ? styles['input--red'] : null}`}
        type="url"
        name={`inputs[${index}]url`}
        placeholder="http(s)://"
        autoFocus
        {...register(`inputs.${index}.url`, { required: true })}
      />
      {index > 0 && <button className={styles['button-delete']} onClick={deleteClick} title="Удалить" />}
      {errors[index] && <span className={styles['error-message']}>{errors[index].url.message}</span>}
    </div>
  );
};
//InputUrl.displayName = 'InputUrl';

export default InputUrl;
