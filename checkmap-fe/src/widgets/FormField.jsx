import React from 'react'

export default function FormField({name, label, inputType = "text", inputAttributes = {}, readOnly = false, register, validation, errors}) {
  const type = inputType != "text"? {type: inputType} : {}; // Leaves out type="text"

  return (
    <p>
      <label htmlFor={name}>{label}: </label>
      <input {...type} {...inputAttributes} readOnly={readOnly} {...register(name, validation)} />
      {errors[name] && <span className="input-error"> {errors[name].message}</span>}
    </p>
  );
}
