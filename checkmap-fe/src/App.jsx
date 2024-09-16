import React, {useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {jwtDecode} from 'jwt-decode'
import CheckMapAPI from './api'
import useLocalStorageState from './hooks/useLocalStorageState'
import UserContext from './UserContext'
import NavBar from './widgets/NavBar'
import Alert from './widgets/Alert'
import AppRoutes from './AppRoutes'
import './App.css'

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loadingUser, setLoadingUser] = useState(false);
  const [user, setUser] = useState(null);
  const [currentList, setCurrentList] = useState();
  const [userToken, setUserToken] = useLocalStorageState('CheckMap-UserToken');
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    async function getLoggedInUser() {
      const {username} = jwtDecode(userToken);
      CheckMapAPI.userToken = userToken;
      try {
        const user = await CheckMapAPI.getUser(username);
        setUser(user);

        // Prompt the use to create their first list
        if(!user.lists.length)
          navigate('/newlist', {state: {previousLocation: location}});
        else // Set the first list as the current
          setCurrentList(user.lists[0]);
      }
      catch(e) {
        showAlert('error', 'Error loading user info: ' + e);
        setUser(null);
      }
      setLoadingUser(false);
    }

    setLoadingUser(true);
    userToken? getLoggedInUser() : setUser(null);
  }, [userToken]);

  return (
    <UserContext.Provider value={{user, currentList, setCurrentList, showAlert}}>
      <NavBar logout={logout}/>
      <Alert alerts={alerts} dismiss={dismissAlert}/>
      <main>
        <AppRoutes {...{login, signup, updateUser}}/>
      </main>
    </UserContext.Provider>
  );

  /** signup: Register a new user */

  async function signup(newUser) {
    try {
      delete newUser.confirm;
      processUserToken(await CheckMapAPI.signup(newUser));
    }
    catch(e) {
      showAlert('error', 'Registration failed: ' + e);
    }
  }

  /** login: Log in the user */

  async function login(credentials) {
    try {
      processUserToken(await CheckMapAPI.login(credentials));
    }
    catch(e) {
      showAlert('error', 'Login failed: ' + e);
    }
  }

  async function processUserToken(token) {
    setAlerts([]);
    setUserToken(() => token);
    navigate('/map');
  }

  /** updateUser: Update user profile */

  async function updateUser(user) {
    // Remove passwords if not changing
    if(!user.password) delete user.password;
    delete user.confirm;

    try {
      const updated = await CheckMapAPI.updateUser(user);
      setAlerts([]);
      showAlert('success', 'Your profile was updated')
      setUser(updated);
    }
    catch(e) {
      showAlert('error', 'Update profile failed: ' + e);
    }
  }

  /** logout: Log out the user */

  async function logout() {
    setUserToken(null);
    setCurrentList(null);
  }

  /** showAlert: Show a message at the top */

  async function showAlert(category, message) {
    if(alerts.find(a => a.category === category && a.message === message)) return; // Ingore existing message
    setAlerts(alerts => [...alerts, {category, message}]);
  }

  /** dismissAlert: Dismiss the alert message */

  async function dismissAlert(alert) {
    setAlerts(alerts => alerts.filter(a => a.category !== alert.category || a.message !== alert.message));
  }
}

export default App
