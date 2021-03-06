import React, { useState, useContext } from 'react';

import useSchema from '../../hooks/use-schema';
import useSchemaLoader from '../../hooks/use-schema-loader';
import { checkIncludesPath, hasSetEntry, toggleSetEntry } from '../../utils';
import { LocationContext } from '../../contexts/location';
import { textDisabled } from '../../lib/messages';
import ParamSelect from './param-select';
import { Add, Done } from '../icon';

const Attribute = ({ attribute, type, includeEnabled }) => {
  const { fields, toggleField } = useContext(LocationContext);
  const name = `${type}-${attribute.name}`;
  return (
    <div className="attribute">
      <input
        id={name}
        name={name}
        type="checkbox"
        checked={
          fields.hasOwnProperty(type) &&
          hasSetEntry(fields[type], attribute.name)
        }
        disabled={!includeEnabled}
        title={includeEnabled ? name : textDisabled}
        onChange={() => toggleField(type, attribute.name)}
      />
      <label htmlFor={name}>{attribute.name}</label>
    </div>
  );
};
const AttributeLoaderList = ({ path, load }) => {
  const { forPath } = path;
  const { include } = useContext(LocationContext);
  const includesEnabled = checkIncludesPath(include, forPath);
  const schema = useSchema(forPath);

  const handleChange = e => {
    load({ forPath: [...forPath, e.target.value] });
  };

  if (schema) {
    const { attributes, relationships } = schema;

    return (
      <div className="param_ui__loader_list">
        <div className="param_ui__attribute_list">
          {attributes.map(attribute => (
            <Attribute
              key={`${schema.type}-${attribute.name}`}
              attribute={attribute}
              type={schema.type}
              includeEnabled={includesEnabled}
            />
          ))}
        </div>
        <ParamSelect handleChange={handleChange}>
          <option value="">Select a relationship</option>
          {relationships.map(relationship => (
            <option
              key={[...forPath, relationship.name].join('-')}
              value={relationship.name}
            >
              {relationship.name}
            </option>
          ))}
        </ParamSelect>
      </div>
    );
  }

  return <></>;
};

const FieldsetForm = ({ onSubmit, hide }) => {
  const [values, setValues] = useState(new Set([]));
  const { paths, load } = useSchemaLoader([]);

  const addAttribute = attribute => {
    const current = new Set([...values]);
    setValues(toggleSetEntry(current, attribute));
  };

  const handleSubmit = e => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="param_ui__fieldset_form">
      <div className="param_ui__loader">
        {paths.map((path, index) => (
          <AttributeLoaderList
            key={[...path.forPath, index].join('-')}
            index={index}
            path={path}
            load={load}
            values={values}
            addAttribute={addAttribute}
          />
        ))}
      </div>
      <div className="param_ui__item">
        <button
          className="param_ui__button--icon"
          onClick={hide}
          type="submit"
        >
          <Done />
        </button>
      </div>
    </form>
  );
};

const FieldsetLoader = () => {
  const [visible, setVisible] = useState(false);

  const showForm = () => {
    setVisible(true);
  };

  const hideForm = () => {
    setVisible(false);
  };

  return visible ? (
    <FieldsetForm visible={visible} hide={hideForm} />
  ) : (
    <div className="param_ui__item">
      <button
        className="param_ui__button--icon"
        onClick={showForm}
        type="submit"
      >
        <Add />
      </button>
    </div>
  );
};

export default FieldsetLoader;
