import React from 'react'
import {Link} from 'react-router-dom';
import {useForm} from 'react-hook-form'
import FormField from '../widgets/FormField';
import NewPasswordFields from '../widgets/NewPasswordFields';
// import './SignupForm.css'

export default function SignupForm({signup}) {
  const {register, handleSubmit, formState: {errors}} = useForm();

  return (
    <form className="SignupForm" onSubmit={handleSubmit(async newUser => signup(newUser))}>
      <h2>Sign Up</h2>
      <FormField name="username" label="Username" {...{register, errors}} validation={{required: 'Please choose a username'}}/>
      <NewPasswordFields {...{register, errors}}/>
      <FormField name="imageURL" label="Image URL (optional)" {...{register, errors}}/>
      <button type="submit">Sign up</button> or <Link to="/login">Log in</Link>
    </form>
  );
}
