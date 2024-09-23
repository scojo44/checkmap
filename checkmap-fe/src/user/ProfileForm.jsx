import React, {useContext} from 'react'
import {useForm} from 'react-hook-form'
import useTitle from '../hooks/useTitle';
import UserContext from '../UserContext'
import FormField from '../widgets/FormField';
import NewPasswordFields from '../widgets/NewPasswordFields';
import './ProfileForm.css'

export default function ProfileForm({updateUser, closeModal}) {
  useTitle('User Profile');
  const {user} = useContext(UserContext);
  const {register, handleSubmit, formState: {errors}} = useForm({
    defaultValues: {
      username: user.username,
      imageURL: user.imageURL
    }
  });

  return (
    <form className="ProfileForm" onSubmit={handleSubmit(async data => await updateUser(data))}>
      <h2>Edit Profile</h2>
      <FormField name="username" label="Username" readOnly={true} {...{register, errors}}/>
      <NewPasswordFields editingProfile={true} {...{register, errors}} />
      <FormField name="imageURL" label="Image URL (optional)" {...{register, errors}}/>
      <button type="submit">Save</button>
      <button type="button" onClick={closeModal}>Cancel</button>
      <img src={user.imageURL} alt="" />
    </form>
  );
}
