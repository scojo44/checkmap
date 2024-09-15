import React from 'react'
import PasswordField from './PasswordField'

export default function NewPasswordFields({register, errors, editingProfile = false}) {
  return (
    <>
      <PasswordField name="password" label="New Password (leave blank to not change)"
        {...{register, errors}}
        inputAttributes={editingProfile && {autoComplete: 'new-password'}}
        validation={!editingProfile && {required: 'Please choose a secure password'}}
      />
      <PasswordField name="confirm" label="Confirm New Password"
        {...{register, errors}}
        validation={{validate: (cp, values) => cp === values.password || 'Passwords do not match'}}
      />
    </>
  );
}
