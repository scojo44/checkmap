import React from 'react'
import {Routes, Route} from 'react-router-dom'
import UserRoutes from './UserRoutes'
import Home from './Home'
import Map from './Map'
// import CompanyList from './company/CompanyList'
// import CompanyDetail from './company/CompanyDetail'
// import JobList from './job/JobList'
import LoginForm from './user/LoginForm'
import SignupForm from './user/SignupForm'
import ProfileForm from './user/ProfileForm'
import CreateListForm from './lists/CreateListForm'

export default function AppRoutes({login, signup, updateUser, setList}) {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm login={login} />} />
      <Route path="/signup" element={<SignupForm signup={signup} />} />
      <Route element={<UserRoutes />}>
        {/* <Route path="/companies" element={<CompanyList />} />
        <Route path="/companies/:handle" element={<CompanyDetail />} />
        <Route path="/jobs" element={<JobList />} /> */}
        <Route path="/testmap" element={<Map />} />
        <Route path="/profile" element={<ProfileForm update={updateUser} />} />
      </Route>
    </Routes>
  );
}
