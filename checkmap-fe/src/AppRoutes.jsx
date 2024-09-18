import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Map from './Map'
import ModalBox from './ModalBox'
import UserRoutes from './UserRoutes'
import Landing from './Landing'
import LoginForm from './user/LoginForm'
import SignupForm from './user/SignupForm'
import ProfileForm from './user/ProfileForm'
import ListManager from './lists/ListManager'
import CreateListForm from './lists/CreateListForm'

// Building a React modal module with React Router
// https://blog.logrocket.com/building-react-modal-module-with-react-router/
// I updated to use react-modal as a layout <Route>

export default function AppRoutes({login, signup, updateUser}) {
  return (
    <Routes>
      <Route element={<Map/>}>
        <Route path="/" element={<Landing/>}/>
        <Route path="/login" element={<LoginForm login={login}/>}/>
        <Route path="/signup" element={<SignupForm signup={signup}/>}/>
        <Route element={<UserRoutes/>}>
          <Route path="/lists" element={<ListManager/>}/>
          <Route path="/newlist" element={<CreateListForm/>}/>
          <Route path="/profile" element={<ProfileForm update={updateUser}/>}/>
        </Route>
      </Route>
    </Routes>
  );
}
