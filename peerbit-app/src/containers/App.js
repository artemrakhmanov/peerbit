import { app } from '../viewmodels/Firebase';

import ContentView from './ContentView';
import {LoginView} from '../login/LoginView';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';

import { getAuth, onAuthStateChanged } from "firebase/auth";

import { useSelector, useDispatch } from 'react-redux'
import { addUID, addUsername, logIn, logOut, removeUID, removeUsername } from '../reducers/loginReducer';
import store from '../reducers/store';
import { getUserToken } from '../viewmodels/Auth';
import { getUserData } from '../viewmodels/UserDBQueries';

const auth = getAuth(app)

onAuthStateChanged(auth, (user) => {

  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    console.log(uid + " user is logged in")

    store.dispatch(logIn())
    store.dispatch(addUID(uid))

    getUserData()
    .then(data=> {
      console.log("adding username", data)
      const username = data.username
      store.dispatch(addUsername(username))
    })

  } else {
    console.log("not logged in")
    store.dispatch(removeUID())
    store.dispatch(logOut())
    store.dispatch(removeUsername())
  }
})

function App() {

  const loggedIn = useSelector(state => state.login.value.logged)

  return (
    <div>

      <BrowserRouter>

        {loggedIn 
          ?
        <div><ContentView /></div>
        :
        <div> <LoginView /> </div> 
        }
      </BrowserRouter>
    </div>
  )
}
{/* <BrowserRouter></BrowserRouter> */}



export default App;
