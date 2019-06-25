import React, { useState, useContext } from 'react';

import useSchema from '../../hooks/use-schema';
import useSchemaLoader from '../../hooks/use-schema-loader';
import { checkIncludesPath, hasSetEntry, toggleSetEntry } from '../../utils';
import { LocationContext } from '../../contexts/location';

const Attribute = ({ attribute, type, includeEnabled }) => {
  const { fields, toggleField } = useContext(LocationContext);
  return (
    <div className="attribute">
      <input
        type="checkbox"
        checked={
          fields.hasOwnProperty(type) &&
          hasSetEntry(fields[type], attribute.name)
        }
        disabled={!includeEnabled}
        onChange={() => toggleField(type, attribute.name)}
      />
      {attribute.name}
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
      <div>
        {attributes.map(attribute => (
          <Attribute
            key={`${schema.type}-${attribute.name}`}
            attribute={attribute}
            type={schema.type}
            includeEnabled={includesEnabled}
          />
        ))}
        <select onChange={handleChange}>
          <option value="">Select a relationship</option>
          {relationships.map(relationship => (
            <option
              key={[...forPath, relationship.name].join('-')}
              value={relationship.name}
            >
              {relationship.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return <></>;
};

const AttributeLoader = () => {
  const [values, setValues] = useState(new Set([]));
  const { paths, load } = useSchemaLoader([]);

  const addAttribute = attribute => {
    const current = new Set([...values]);
    setValues(toggleSetEntry(current, attribute));
  };

  return (
    <form className="param_ui__fieldset_form">
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
    </form>
  );
};

export default AttributeLoader;