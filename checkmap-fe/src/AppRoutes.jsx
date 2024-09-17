import React from 'react'
import {Routes, Route, useLocation} from 'react-router-dom'
import UserRoutes from './UserRoutes'
import Home from './Home'
import Map from './Map'
import LoginForm from './user/LoginForm'
import SignupForm from './user/SignupForm'
import ProfileForm from './user/ProfileForm'
import ListManager from './lists/ListManager'
import CreateListForm from './lists/CreateListForm'
import ModalBox from './ModalBox'

// Building a React modal module with React Router
// https://blog.logrocket.com/building-react-modal-module-with-react-router/
// I updated to use react-modal as a layout <Route>

export default function AppRoutes({login, signup, updateUser}) {
  const location = useLocation();
  const previousLocation = location.state?.previousLocation;
  
  return (
    <>
    <Routes location={previousLocation || location}>
      <Route path="/map" element={<Map/>}/>
    </Routes>
    {previousLocation &&
      <Routes>
        <Route element={<ModalBox/>}>
          <Route path="/login" element={<LoginForm login={login}/>}/>
          <Route path="/signup" element={<SignupForm signup={signup}/>}/>
          <Route element={<UserRoutes/>}>
            <Route path="/profile" element={<ProfileForm update={updateUser}/>}/>
            <Route path="/lists" element={<ListManager/>}/>
            <Route path="/newlist" element={<CreateListForm/>}/>
          </Route>
        </Route>
      </Routes>
    }
    </>
  );
}
