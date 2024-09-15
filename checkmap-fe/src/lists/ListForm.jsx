import React, {useContext} from 'react'
import UserContext from '../UserContext'
import './ListForm.css'

export default function ListForm(props) {
  const {user, currentList, setCurrentList} = useContext(UserContext);

  if(!user.lists.length) return;

  return (
    <form className="ListForm">
      {user.lists &&
        <select name="list" onChange={handleChange} value={currentList.id}>
          {user.lists.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      }
    </form>
  )

  function handleChange({target}) {
    setCurrentList(user.lists.find(l => l.id === +target.value));
  }
}