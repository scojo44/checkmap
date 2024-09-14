import React from 'react'

export default function FormField({name, label, inputType = "text", register, validation, errors}) {
  const type = inputType != "text"? {type: inputType} : {}; // Leaves out type="text"

  return (
    <p>
      <label htmlFor={name}>{label}: </label>
      <input {...type} {...register(name, validation)} />
      {errors[name] && <span className="input-error"> {errors[name].message}</span>}
    </p>
  );
}
