import React, {useContext} from 'react'
import {useForm} from 'react-hook-form'
import UserContext from '../UserContext'
// import './ProfileForm.css'

export default function ProfileForm({update}) {
  const {user} = useContext(UserContext);
  const {register, handleSubmit, formState: {errors}} = useForm({
    defaultValues: {
      username: user.username,
      imageURL: user.imageURL
    }
  });

  return (
    <form className="ProfileForm" onSubmit={handleSubmit(async credentials => await update(credentials))}>
      <h2>Edit Profile</h2>
      <p>
        <label htmlFor="username">Username: </label>
        <input readOnly {...register("username")} />
      </p>
      <p>
        <label htmlFor="password">New Password (leave blank to not change): </label>
        <input type="password" autoComplete="new-password" {...register("password")} />
        {errors.password && <span className="input-error"> {errors.password.message}</span>}
      </p>
      <p>
        <label htmlFor="confirm">Confirm New Password: </label>
        <input type="password" autoComplete="new-password"
          {...register("confirm", {validate: (cp, values) => cp === values.password || 'Passwords do not match'})}
        />
        {errors.confirm && <span className="input-error"> {errors.confirm.message}</span>}
      </p>
      <p>
        <label htmlFor="imageURL">Image URL (optional): </label>
        <input {...register("imageURL", {required: 'Please enter your first name'})} />
        {errors.imageURL && <span className="input-error"> {errors.imageURL.message}</span>}
      </p>
      <button type="submit">Save</button>
    </form>
  );
}
