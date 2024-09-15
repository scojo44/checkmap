import React, {useContext, useState} from 'react'
import {useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form'
import CheckMapAPI from '../api';
import UserContext from '../UserContext'
import FormField from '../widgets/FormField';
import NewPasswordFields from '../widgets/NewPasswordFields';
import './ProfileForm.css'
import EditListForm from '../lists/EditListForm';

export default function ProfileForm({update}) {
  const [editingListID, setEditingListID] = useState();
  const [lastDeletedListID, setLastDeletedListID] = useState();
  const navigate = useNavigate();
  const {user, currentList, setCurrentList, showAlert} = useContext(UserContext);
  const {register, handleSubmit, formState: {errors}} = useForm({
    defaultValues: {
      username: user.username,
      imageURL: user.imageURL
    }
  });

  return (
    <section className="ProfileForm">
      <form onSubmit={handleSubmit(saveProfile)}>
        <h2>Edit Profile</h2>
        <FormField name="username" label="Username" readOnly={true} {...{register, errors}}/>
        <NewPasswordFields editingProfile={true} {...{register, errors}} />
        <FormField name="imageURL" label="Image URL (optional)" {...{register, errors}}/>
        <button type="submit">Save</button>
        <button type="button" onClick={hideForm}>Cancel</button>
      </form>
      <div>
        <h2>Manage Lists</h2>
        <ul className="user-lists">
          {user.lists.map(list => (
            <li>
              <div className="list-row">
                <span className="list-name">{list.name}</span>
                <span className="list-button"><button onClick={() => editList(list)}>Edit</button></span>
                <span className="list-button"><button onClick={() => switchList(list)} disabled={list === currentList}>Switch</button></span>
                <span className="list-button"><button onClick={() => deleteList(list)} disabled={list === currentList}>Delete</button></span>
              </div>
              {editingListID === list.id && <EditListForm list={list} update={updateList} cancel={hideEdit}/>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );

  async function saveProfile(credentials) {
    await update(credentials);
    hideForm();
  }

  async function editList(list) { setEditingListID(list.id); }
  async function hideEdit(list) { setEditingListID(0); }

  async function updateList(updatedList) {
    try {
      const list = await CheckMapAPI.updateList(editingListID, updatedList);
      const userList = user.lists.find(l => l.id === list.id);
      userList.name = updatedList.name;
      userList.description = updatedList.description;
      if(list === currentList) setCurrentList({...list});
      hideEdit();
    }
    catch(e) {
      showAlert('error', 'Error creating list:' + e);
    }
  }
  async function switchList(list) {
    setCurrentList(list);
  }

  async function deleteList(list) {
    try {
      const deletedListID = await CheckMapAPI.deleteList(list.id);
      const removeIndex = user.lists.findIndex(l => l.id === deletedListID);
      user.lists.splice(removeIndex, 1);
      setLastDeletedListID(deletedListID);
  }
    catch(e) {
      showAlert('error', 'Error creating list:' + e);
    }
  }

  function hideForm() {
    navigate('/map');
  }
}
