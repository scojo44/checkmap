import React, {useContext} from 'react'
import UserContext from './UserContext'
import './Home.css'

export default function Home() {
  const {user} = useContext(UserContext);

  return (
    <section className="Home">
      <h2>Welcome, {user? user.username : 'guest'}!</h2>
    </section>
  );
}
