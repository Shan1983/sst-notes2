import React from "react";

export const useFormFields = (initialState) => {
  const [fields, setValues] = React.useState(initialState);

  return [
    fields,
    function (event) {
      setValues({
        ...fields,
        [event.target.id]: event.target.value,
      });
    },
  ];
};
