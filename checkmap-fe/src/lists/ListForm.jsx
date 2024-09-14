import React, {useContext, useState} from 'react'
import CheckMapAPI from '../api'
import {useNavigate} from 'react-router-dom'
import UserContext from '../UserContext'
import CreateListForm from './CreateListForm'

export default function ListForm({setList}) {
  const {user} = useContext(UserContext);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigate = useNavigate();

  return (
    <>
    <form>
      {user.lists &&
        <select name="list" onChange={handleChange}>
          {user.lists.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      }
      <button type="button" onClick={handleClick}>Create New List</button>
    </form>
    {showCreateForm && <CreateListForm addList={addList} />}
    </>
  )

  async function addList(newList) {
    const list = await CheckMapAPI.createList(user.username, newList);
    user.lists.push(list);
    setShowCreateForm(false);
  }

  function handleChange({target}) {
    setList(() => ({...user.lists.find(l => l.id === +target.value)}))
  }

  function handleClick({target}) {
    setShowCreateForm(true);
  }
}