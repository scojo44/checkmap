import React from 'react'
import {Link} from 'react-router-dom';
import './Landing.css'

export default function Landing() {
  return (
    <section className="Landing">
      <h1>CheckMap</h1>
      <h2>Welcome!</h2>
      <p>CheckMap is a simple site to track states and counties you've visited.</p>
      <p>Sign up, create a list, then just click on the regions you have visited!</p>
      <p>You can create more lists to track where you have done something special like
        caught a fish, played golf, rode your motorcycle, found a geocache...</p>
      <form>
        <button><Link to="/signup">Sign Up</Link></button>
        <button><Link to="/login">Log In</Link></button>
      </form>
    </section>
  );
}
