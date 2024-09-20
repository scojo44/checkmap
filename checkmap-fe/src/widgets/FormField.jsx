import React from 'react'

export default function FormField({name, label, inputType = "text", inputAttributes = {}, readOnly = false, register, validation, errors}) {
  const type = inputType !== "text"? {type: inputType} : {}; // Leaves out type="text"
  if(inputType && inputType !== 'text')
    inputAttributes.type = inputType;
  if(readOnly)
    inputAttributes.readOnly = true;

  return (
    <p className="FormField">
      <label htmlFor={name}>{label}: </label>
      <input {...inputAttributes} {...register(name, validation)} />
      {errors[name] && <span className="input-error"> {errors[name].message}</span>}
    </p>
  );
}
