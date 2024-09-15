import React from 'react'
import FormField from './FormField'

export default function PasswordField({name, label, inputAttributes = {}, register, validation, errors}) {
  return (
    <FormField inputType="password" inputAttributes={{...inputAttributes}}
      {...{name, label, register, errors, validation}}
    />
  );
}
