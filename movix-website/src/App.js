import React, { useEffect } from 'react';
import "./App.css";
import HomeScreen from './screens/HomeScreen';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginScreen from './screens/LoginScreen';
import { auth } from './firebase';
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, selectUser } from './features/userSlice';
import ProfileScreen from './screens/ProfileScreen';

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if(authUser){
         //Logged in
         dispatch(
           login({
           uid: authUser.uid,
           email: authUser.email,
         })
         );
      }else{
        //Logged out
        dispatch(logout());
      }
    });

    return unsubscribe;
  }, [dispatch]);
  
  return (
    <div className="app">
      {/* A <Routes> looks through its children <Route> and
            renders the first one that matches the current URL. */}
      <BrowserRouter>
       {!user ? (
         <LoginScreen />
       ) : (
        <Routes>
          <Route exact path="/profile" element={<ProfileScreen />} />
          <Route exact path="/" 
          element={<HomeScreen />} />
        </Routes>
       )}
      </BrowserRouter>
    </div>
  );
}

export default App;
