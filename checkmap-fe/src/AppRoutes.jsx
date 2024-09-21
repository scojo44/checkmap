import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Map from './Map'
import UserRoutes from './UserRoutes'
import Landing from './Landing'
import LoginForm from './user/LoginForm'
import SignupForm from './user/SignupForm'
import ProfileForm from './user/ProfileForm'
import ListManager from './lists/ListManager'
import CreateListForm from './lists/CreateListForm'

export default function AppRoutes({login, signup, updateUser, addNewList, closeModal}) {
  return (
    <Routes>
      <Route element={<Map/>}>
        <Route path="/" element={<Landing/>}/>
        <Route path="/login" element={<LoginForm login={login}/>}/>
        <Route path="/signup" element={<SignupForm signup={signup}/>}/>
        <Route element={<UserRoutes/>}>
          <Route path="/lists" element={<ListManager {...{closeModal}}/>}/>
          <Route path="/newlist" element={<CreateListForm {...{addNewList, closeModal}}/>}/>
          <Route path="/profile" element={<ProfileForm {...{updateUser, closeModal}}/>}/>
        </Route>
      </Route>
    </Routes>
  );
}
