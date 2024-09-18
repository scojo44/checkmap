import React, {useContext} from 'react'
import {Link, NavLink} from 'react-router-dom'
import UserContext from '../UserContext'
import ListSwitcher from '../lists/ListSwitcher'
import './NavBar.css'

export default function NavBar({logout}) {
  const {user} = useContext(UserContext);

  return (
    <nav className="NavBar">
      <Link to="/" className="logo">CheckMap</Link>
      {user &&
        <>
          {user.lists.length > 0 && <NavLink to="/lists">Your Lists</NavLink>}
          <ListSwitcher />
          <NavLink to="/newlist">New List</NavLink>
          <NavLink to="/profile">Profile</NavLink>
          <Link to="/" onClick={logout}>Log Out</Link>
          <span>{user.username}</span>
        </>
      }
    </nav>
  );
}
