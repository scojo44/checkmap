import React, {useContext} from 'react'
import {Link, NavLink, useLocation} from 'react-router-dom'
import UserContext from '../UserContext'
import ListForm from '../lists/ListForm'
import './NavBar.css'

export default function NavBar({logout}) {
  const {user} = useContext(UserContext);
  const location = useLocation();
  const homeURL = user? '/map' : '/';

  return (
    <nav className="NavBar">
      <Link to={homeURL}>CheckMap</Link>
      {user
        ? <>
            {user.lists.length > 0 && <NavLink to="/map">Your Lists:</NavLink>}
            <ListForm />
            <NavLink to="/newlist" state={{previousLocation: location}}>New List</NavLink>
            <NavLink to="/profile" state={{previousLocation: location}}>Profile</NavLink>
            <Link to="/" onClick={logout}>Log Out</Link>
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
