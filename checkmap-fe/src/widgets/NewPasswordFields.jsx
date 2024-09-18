import React from 'react'
import PasswordField from './PasswordField'

export default function NewPasswordFields({register, errors, editingProfile = false}) {
  const newPasswordLabel = editingProfile? 'New Password (leave blank to not change)' : 'Password';

  return (
    <>
      <PasswordField name="password" label={newPasswordLabel}
        {...{register, errors}}
        inputAttributes={editingProfile && {autoComplete: 'new-password'}}
        validation={!editingProfile && {required: 'Please choose a secure password'}}
      />
      <PasswordField name="confirm" label="Confirm Password"
        {...{register, errors}}
        validation={{validate: (cp, values) => cp === values.password || 'Passwords do not match'}}
      />
    </>
  );
}
