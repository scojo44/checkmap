import React from 'react'
import {useForm} from 'react-hook-form'
import FormField from '../widgets/FormField';
import './EditListForm.css'

export default function EditListForm({list, update, cancel}) {
  const {register, handleSubmit, formState: {errors}} = useForm({
    defaultValues: {
      name: list.name,
      description: list.description
    }
  });

  return (
    <form className="EditListForm" onSubmit={handleSubmit(async data => await update(data))}>
      <FormField name="name" label="Name" {...{register, errors}} validation={{required: 'Name cannot be blank'}}/>
      <FormField name="description" label="Description (optional)" {...{register, errors}}/>
      <button type="submit">Save</button>
      <button type="button" onClick={cancel}>Cancel</button>
    </form>
  );
}
