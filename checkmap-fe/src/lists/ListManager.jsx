import React, {useContext, useState} from 'react'
import {useNavigate} from 'react-router-dom';
import CheckMapAPI from '../api';
import UserContext from '../UserContext'
import EditListForm from '../lists/EditListForm';
import './ListManager.css'

export default function ListManager(props) {
  const [editingListID, setEditingListID] = useState();
  const [lastDeletedListID, setLastDeletedListID] = useState();
  const navigate = useNavigate();
  const {user, currentList, setCurrentList, showAlert} = useContext(UserContext);

  return (
    <section className='ListManager'>
    <h2>Your Lists</h2>
    <ul className="user-lists">
      {user.lists.sort((a,b) => a.id > b.id).map(list => (
        <li key={list.id}>
          <div className="list-row">
            <span className="list-name" style={{fontWeight: editingListID === list.id? 'bold':''}}>{list.name}</span>
            <span className="list-button"><button onClick={() => showEditUI(list)}>Edit</button></span>
            <span className="list-button"><button onClick={() => switchList(list)} disabled={list === currentList}>Switch</button></span>
            <span className="list-button"><button onClick={() => deleteList(list)} disabled={list === currentList}>Delete</button></span>
          </div>
          {editingListID === list.id && <EditListForm list={list} update={updateList} cancel={hideEditUI}/>}
        </li>
      ))}
    </ul>
    <form>
      <button type="button" onClick={hideForm}>Close</button>
    </form>
    </section>
  );

  function switchList(list) { setCurrentList(list); }
  function showEditUI(list) { setEditingListID(list.id); }
  function hideEditUI() { setEditingListID(0); }
  function hideForm() { navigate('/map'); }

  async function updateList(updatedList) {
    try {
      const list = await CheckMapAPI.updateList(editingListID, updatedList);
      const userList = user.lists.find(l => l.id === list.id);
      userList.name = updatedList.name;
      userList.description = updatedList.description;
      userList.color = updatedList.color;
      if(list.id === currentList.id) setCurrentList({...userList});
      hideEditUI();
    }
    catch(e) {
      showAlert('error', 'Error creating list:' + e);
    }
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
}
