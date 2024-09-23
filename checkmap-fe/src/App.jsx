import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {jwtDecode} from 'jwt-decode'
import CheckMapAPI from './api'
import useLocalStorageState from './hooks/useLocalStorageState'
import UserContext from './UserContext'
import NavBar from './widgets/NavBar'
import Alert from './widgets/Alert'
import AppRoutes from './AppRoutes'
import './App.css'

const SITE_NAME = 'CheckMap';

function App() {
  const navigate = useNavigate();
  const [loadingUser, setLoadingUser] = useState(false);
  const [user, setUser] = useState(null);
  const [currentList, setCurrentList] = useState();
  const [userToken, setUserToken] = useLocalStorageState('CheckMap-UserToken');
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    async function getLoggedInUser() {
      const {username} = jwtDecode(userToken);
      CheckMapAPI.userToken = userToken;
      setLoadingUser(true);

      try {
        const user = await CheckMapAPI.getUser(username);
        setUser(user);
        setLoadingUser(false);

        // Prompt the user to create their first list
        if(!user.lists.length)
          navigate('/newlist');
        else // Set the first list as the current
          setCurrentList(user.lists[0]);
      }
      catch(e) {
        showAlert('error', 'Error loading user info: ' + e);
        resetUserState();
        setLoadingUser(false);
      }
    }

    userToken? getLoggedInUser() : resetUserState();
  }, [userToken]);

  return (
    <UserContext.Provider value={{SITE_NAME, user, currentList, setCurrentList, showAlert}}>
      <NavBar logout={logout}/>
      <main id="App-main">
        <AppRoutes {...{login, signup, updateUser, addNewList, closeModal, alerts, dismissAlert, clearAlerts}}/>
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

  function processUserToken(token) {
    setUserToken(token);
    closeModal();
  }

  /** logout: Log out the user */

  function logout() {
    resetUserState();
    showAlert('success', 'You are now logged out');
  }

  /** resetUserState: Clear user states */

  function resetUserState() {
    setCurrentList(null);
    setUser(null);
    setUserToken(null);
    CheckMapAPI.userToken = undefined;
    clearAlerts();
  }

  /** updateUser: Update user profile */

  async function updateUser(changes) {
    // Remove passwords if not changing
    if(!changes.password) delete changes.password;
    delete changes.confirm;

    try {
      const updatedUser = await CheckMapAPI.updateUser(changes);
      closeModal();
      setUser(user => ({...user, updated: updatedUser}));
      showAlert('success', 'Your profile was updated');
    }
    catch(e) {
      showAlert('error', 'Update profile failed: ' + e);
    }
  }

  /** addList: Adds a new list */

  async function addNewList(newList) {
    try {
      const list = await CheckMapAPI.createList(user.username, newList);
      closeModal();
      user.lists.push(list);
      setCurrentList(list);
      showAlert('success', `New list created: ${list.name}`);
    }
    catch(e) {
      showAlert('error', 'Error creating list:' + e);
    }
  }

  function closeModal() {
    clearAlerts();
    navigate('/');
  }

  /** showAlert: Show a message at the top */

  function showAlert(category, message) {
    if(!alerts.find(a => a.category === category && a.message === message)) // Ignore if already showing this message
      setAlerts(alerts => [...alerts, {id: alerts.length+1, category, message}]);
  }

  /** dismissAlert: Dismiss the alert message */

  function dismissAlert(alert) {
    setAlerts(alerts => alerts.filter(a => a.id !== alert.id));
  }

  /** clearAlerts: Dismiss all alerts */

  function clearAlerts() {
    setAlerts([]);
  }
}

export default App
