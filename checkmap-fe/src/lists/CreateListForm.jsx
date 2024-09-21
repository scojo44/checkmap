import React from 'react'
import {useForm} from 'react-hook-form'
import FormField from '../widgets/FormField';
import './CreateListForm.css'

export default function CreateListForm({addNewList, closeModal}) {
  const {register, handleSubmit, formState: {errors}} = useForm();

  return (
    <form className="CreateListForm" onSubmit={handleSubmit(async data => await addNewList(data))}>
      <h2>Create a New List</h2>
      <FormField name="name" label="Name" {...{register, errors}} validation={{required: 'Please enter a name for your list'}}/>
      <FormField name="description" label="Description (optional)" {...{register, errors}}/>
      <FormField inputType="color" name="color" label="Fill Color" {...{register, errors}}/>
      <p>
        <label htmlFor="regionType">Region Type: </label>
        <select id="regionType" {...register("regionType")}>
          <option value="State">States</option>
          <option value="County">Counties</option>
        </select>
        {errors.regionType && <span className="input-error"> {errors.regionType.message}</span>}
      </p>
      <button type="submit">Submit</button>
      <button type="button" onClick={closeModal}>Cancel</button>
    </form>
  );
}
