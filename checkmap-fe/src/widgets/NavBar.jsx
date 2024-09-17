import React, {useContext} from 'react'
import {Link, NavLink, useLocation} from 'react-router-dom'
import UserContext from '../UserContext'
import ListSwitcher from '../lists/ListSwitcher'
import './NavBar.css'

export default function NavBar({logout}) {
  const {user} = useContext(UserContext);
  const location = useLocation();
  const homeURL = user? '/map' : '/';

  return (
    <nav className="NavBar">
      <Link to={homeURL} className="logo">CheckMap</Link>
      {user
        ? <>
            {user.lists.length > 0 && <NavLink to="/lists" state={{previousLocation: location}}>Your Lists</NavLink>}
            <ListSwitcher />
            <NavLink to="/newlist" state={{previousLocation: location}}>New List</NavLink>
            <NavLink to="/profile" state={{previousLocation: location}}>Profile</NavLink>
            <Link to="/map" onClick={logout}>Log Out</Link>
            <span>{user.username}</span>
          </>
        : <>
            <NavLink to="/signup" state={{previousLocation: location}}>Sign Up</NavLink>
            <NavLink to="/login" state={{previousLocation: location}}>Log In</NavLink>
          </>
      }
    </nav>
  );
}
