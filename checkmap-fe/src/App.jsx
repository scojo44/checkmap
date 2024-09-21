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
        logout();
        setLoadingUser(false);
      }
    }

    userToken? getLoggedInUser() : logout();
  }, [userToken]);

  return (
    <UserContext.Provider value={{user, currentList, setCurrentList, showAlert}}>
      <NavBar logout={logout}/>
      <Alert alerts={alerts} dismiss={dismissAlert}/>
      <main id="App-main">
        <AppRoutes {...{login, signup, updateUser, addNewList, closeModal}}/>
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
    setAlerts([]);
    setUserToken(token);
    navigate('/');
  }

  /** logout: Log out the user */

  function logout() {
    setCurrentList(null);
    setUser(null);
    setUserToken(null);
    CheckMapAPI.userToken = undefined;
  }

  /** updateUser: Update user profile */

  async function updateUser(changes) {
    // Remove passwords if not changing
    if(!changes.password) delete changes.password;
    delete changes.confirm;

    try {
      const updatedUser = await CheckMapAPI.updateUser(changes);
      setAlerts([]);
      showAlert('success', 'Your profile was updated')
      setUser(user => ({...user, updated: updatedUser}));
    }
    catch(e) {
      showAlert('error', 'Update profile failed: ' + e);
    }
    closeModal();
  }

  /** addList: Adds a new list */

  async function addNewList(newList) {
    try {
      const list = await CheckMapAPI.createList(user.username, newList);

      user.lists.push(list);
      setCurrentList(list);
    }
    catch(e) {
      showAlert('error', 'Error creating list:' + e);
    }
    closeModal();
  }

  function closeModal() {
    navigate('/');
  }

  /** showAlert: Show a message at the top */

  function showAlert(category, message) {
    if(alerts.find(a => a.category === category && a.message === message)) return; // Ingore existing message
    setAlerts(alerts => [...alerts, {category, message}]);
  }

  /** dismissAlert: Dismiss the alert message */

  function dismissAlert(alert) {
    setAlerts(alerts => alerts.filter(a => a.category !== alert.category || a.message !== alert.message));
  }
}

export default App
