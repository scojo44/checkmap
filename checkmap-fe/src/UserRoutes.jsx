import React, {useContext} from "react"
import {Navigate, Outlet} from "react-router-dom"
import UserContext from "./UserContext"

/** Wrapper for routes that require a login */

export default function UserRoutes() {
  const {user} = useContext(UserContext);

  return user? <Outlet /> : <Navigate to="/login" />;
}
