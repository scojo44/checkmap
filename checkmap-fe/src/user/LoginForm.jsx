import React from 'react'
import {Link} from 'react-router-dom';
import {useForm} from 'react-hook-form'
import FormField from '../widgets/FormField';
import PasswordField from '../widgets/PasswordField';
// import './LoginForm.css'

export default function LoginForm({login}) {
  const {register, handleSubmit, formState: {errors}} = useForm();

  return (
    <form className="LoginForm" onSubmit={handleSubmit(async credentials => await login(credentials))}>
      <h2>Log In</h2>
      <FormField name="username" label="Username" {...{register, errors}} validation={{required: 'Please enter your username'}}/>
      <PasswordField name="password" label="Password" {...{register, errors}} validation={{required: 'Please enter your password'}}/>
      <button type="submit">Log in</button> or <Link to="/signup">Sign up</Link>
    </form>
  );
}
