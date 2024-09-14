import React from 'react'
import {useForm} from 'react-hook-form'
// import './SignupForm.css'

export default function SignupForm({signup}) {
  const {register, handleSubmit, formState: {errors}} = useForm();

  return (
    <form className="SignupForm" onSubmit={handleSubmit(async newUser => signup(newUser))}>
      <h2>Sign Up</h2>
      <p>
        <label htmlFor="username">Username: </label>
        <input {...register("username", {required: 'Please enter your username'})} />
        {errors.username && <span className="input-error"> {errors.username.message}</span>}
      </p>
      <p>
        <label htmlFor="password">Password: </label>
        <input type="password" {...register("password", {required: 'Please choose a secure password'})} />
        {errors.password && <span className="input-error"> {errors.password.message}</span>}
      </p>
      <p>
        <label htmlFor="confirm">Confirm Password: </label>
        <input type="password" {...register("confirm", {required: true, validate: (cp, values) => cp === values.password || 'Your passwords do not match'})} />
        {errors.confirm && <span className="input-error"> {errors.confirm.message}</span>}
      </p>
      <p>
        <label htmlFor="imageURL">Image URL (optional): </label>
        <input {...register("imageURL")} />
        {errors.imageURL && <span className="input-error"> {errors.imageURL.message}</span>}
      </p>
      <button type="submit">Sign Up</button>
    </form>
  );
}
