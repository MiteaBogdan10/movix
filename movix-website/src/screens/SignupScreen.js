import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@firebase/auth';
import React, { useRef } from 'react';
import { auth } from '../firebase';
import "./SignupScreen.css";

function SignupScreen() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const register = (e) =>{
    e.preventDefault();

    createUserWithEmailAndPassword(auth,
        emailRef.current.value,
        passwordRef.current.value
    )
    .then((authUser) =>{ 
      console.log(authUser);  
    })
    .catch((error) => {
       alert("The email is invalid! Type in your real email address or check if it is correctly formated and try again.");
    });
  };

  const signIn = (e) =>{
    e.preventDefault();

    signInWithEmailAndPassword(auth,
      emailRef.current.value,
      passwordRef.current.value
    )
    .then((authUser) =>{ 
      // Signed in
      console.log(authUser);  
    })
    .catch((error) => {
      alert("There is no user with corresponding credentials. Please try again.");
   });
  };

  return (
    <div className="signupScreen">
        <form>
          <h1>Sign In</h1>
          <input ref={emailRef} placeholder="Email" type="email"/>
          <input ref={passwordRef} placeholder="Password" type="password"/>
          <button type="submit" onClick={signIn}>Sign In</button>

          <h4>
            <span className="signupScreen_gray">New to Movix?</span>
            <span className="signupScreen_link" onClick={register}>Sign Up now.</span>
          </h4>
        </form>
    </div>
  )
}

export default SignupScreen;
