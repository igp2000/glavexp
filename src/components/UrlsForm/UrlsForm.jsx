import React, { useEffect, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import cloneDeep from 'lodash.clonedeep';

import { InputUrl } from '../InputUrl';

import styles from './UrlsForm.module.scss';

const UrlsForm = ({ setStateData }) => {
  const validationForm = Yup.object().shape({
    inputs: Yup.array().of(
      Yup.object().shape({
        url: Yup.string().required('Требуется адрес сайта').url('Неправильный формат URL'),
      })
    ),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({ resolver: yupResolver(validationForm), mode: 'onChange' });

  const { fields, append, remove } = useFieldArray({ control, name: 'inputs' });

  // в режиме разработки хук вызывается два раза
  const strict = useRef(true);
  useEffect(() => {
    if (strict.current) {
      append({});
      strict.current = false;
    }
  }, []);

  const onSubmit = (data) => {
    function getData(url) {
      return fetch(url)
        .then((res) => {
          if (res.status === 200) {
            return res.text();
          } else {
            throw JSON.stringify({
              title: `Код ответа: ${res.status}`,
              description: '',
            });
          }
        })
        .then((text) => {
          let regexp = new RegExp(/<title>(.*)<\/title>/, 'i');
          let title = regexp.exec(text);

          regexp = new RegExp(/<meta\s+name="description"\s+content="(.*)"\s*\/?>/, 'i');
          let desc = regexp.exec(text);

          title = Array.isArray(title) && title.length > 0 ? title[1] : 'Заголовок не найден';
          desc = Array.isArray(desc) && desc.length > 0 ? desc[1] : 'Описание не найдено';

          return JSON.stringify({ title: title, description: desc });
        })
        .catch((err) => {
          if (err instanceof Error) {
            throw JSON.stringify({ title: err.message, description: '' });
          } else {
            throw JSON.stringify({ title: err, description: '' });
          }
        });
    }

    async function getResults(dataInputs) {
      //const arr = structuredClone(dataInputs);
      const arr = cloneDeep(dataInputs);
      const promises = [];

      arr.forEach((item) => {
        promises.push(getData(item.url));
      });

      const results = await Promise.allSettled(promises);

      arr.forEach((item, index) => {
        item.id = fields[index].id;
        let mess = { title: '', description: '' };

        if (results[index].status === 'fulfilled') {
          item.isError = false;
          mess = JSON.parse(results[index].value);
        } else {
          item.isError = true;
          mess = JSON.parse(results[index].reason);
        }
        item.title = mess.title;
        item.description = mess.description;
      });
      setStateData(arr);
    }

    getResults(data.inputs);
  };

  const addClick = (event) => {
    append({});
    event.preventDefault();
  };

  const resetClick = (event) => {
    setStateData([{ url: '', title: '', description: '', isError: false }]);
    remove();
    append({});
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <fieldset>
        <legend>URL-адрес</legend>
        {fields.map((field, index) => (
          <InputUrl
            key={field.id}
            index={index}
            register={register}
            errors={errors.inputs}
            remove={remove}
            setStateData={setStateData}
          />
        ))}
        <div style={{ textAlign: 'right' }}>
          {fields.length < 10 && (
            <button className={styles.button} onClick={addClick}>
              Добавить
            </button>
          )}
          <button className={styles.button} onClick={resetClick}>
            Сбросить
          </button>
        </div>
      </fieldset>
      <div className={styles.send}>
        <button className={styles.button} value="Отправить">
          Отправить
        </button>
      </div>
    </form>
  );
};
//UrlsForm.displayName = 'UrlsForm';

export default UrlsForm;
