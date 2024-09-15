import React, {useContext} from 'react'
import {useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form'
import CheckMapAPI from '../api'
import UserContext from '../UserContext'
import FormField from '../widgets/FormField';
import './CreateListForm.css'

export default function CreateListForm({}) {
  const navigate = useNavigate();
  const {user, setCurrentList, showAlert} = useContext(UserContext);
  const {register, handleSubmit, formState: {errors}} = useForm();

  return (
    <form className="CreateListForm" onSubmit={handleSubmit(async data => await addList(data))}>
      <h2>Create a New List</h2>
      <FormField name="name" label="Name" {...{register, errors}} validation={{required: 'Please enter a name for your list'}}/>
      <FormField name="description" label="Description (optional)" {...{register, errors}}/>
      <FormField inputType="color" name="color" label="Fill Color" {...{register, errors}}/>
      <p>
        <label htmlFor="regionType">Region Type: </label>
        <select {...register("regionType")}>
          <option value="State">States</option>
          <option value="County">Counties</option>
        </select>
        {errors.regionType && <span className="input-error"> {errors.regionType.message}</span>}
      </p>
      <button type="submit">Submit</button>
      <button type="button" onClick={hideForm}>Cancel</button>
    </form>
  );

  async function addList(newList) {
    try {
      const list = await CheckMapAPI.createList(user.username, newList);
      user.lists.push(list);
      setCurrentList(list);
      hideForm();
    }
    catch(e) {
      showAlert('error', 'Error creating list:' + e);
    }
  }

  function hideForm() {
    navigate('/map');
  }
}
