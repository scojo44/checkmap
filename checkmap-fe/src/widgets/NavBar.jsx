import React, {useContext} from 'react'
import {Link, NavLink} from 'react-router-dom'
import UserContext from '../UserContext'
import './NavBar.css'

export default function NavBar({logout}) {
  const {user} = useContext(UserContext);

  return (
    <>
    <nav className="NavBar">
      <Link to="/">CheckMap</Link>
      {user
        ? <>
            <NavLink to="/testmap">Test Map</NavLink>
            <NavLink to="/profile">Profile</NavLink>
            <Link onClick={logout}>Log Out</Link>
            <span>{user.username}</span>
          </>
        : <>
            <NavLink to="/signup">Sign Up</NavLink>
            <NavLink to="/login">Log In</NavLink>
          </>
      }
    </nav>
    </>
  );
}
