import React, {useContext} from 'react'
import UserContext from '../UserContext'
import './ListSwitcher.css'

export default function ListSwitcher(props) {
  const {user, currentList, setCurrentList} = useContext(UserContext);

  if(!user.lists.length) return;

  return (
    <form className="ListSwitcher">
      {user.lists &&
        <select name="list" onChange={handleChange} value={currentList.id}>
          {user.lists.sort((a,b) => a.id > b.id).map(l =>
            <option key={l.id} value={l.id}>{l.name}</option>
          )}
        </select>
      }
    </form>
  )

  function handleChange({target}) {
    setCurrentList(user.lists.find(l => l.id === +target.value));
  }
}
