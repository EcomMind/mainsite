import React, { useState } from 'react'
import ecommind from '../assets/ecommind.png'
import styles from '../styles/Login.module.css'
import { Link } from 'react-router-dom';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      email: email,
      password: password,
    }

    // sign in with firebase auth
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log('User credentials:', userCredential);
      console.log('User:', user);
    }).catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log('Error:', error);
      console.log('Error code:', errorCode);
      console.log('Error message:', errorMessage);
    })
    .then(() => {
      // go to Home page
      window.location.href = '/home';
    });
  };

  return (
    <div>
    <img src={ecommind} alt="ecommind" className={styles.logo2}/>
    <div className={styles.container}>
      <div>
      <h1>Log In!</h1>
      <form onSubmit={handleSubmit}>
        <br />
        <label>
          <input
            type="email"
            value={email}
            className={styles.inputfield}
            placeholder='Email'
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <br />
        <label>
          <input
            type="text"
            value={password}
            className={styles.inputfield}
            placeholder='Password'
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <br />
        <button className={styles.button} type="submit" onClick={handleSubmit}>Login</button>
    </form>
    <hr />
    <button className={styles.button} type="submit" onClick={handleSubmit}>Signin with Google</button>
    <h3 className={styles.footer}>Dont Have an Account? <Link to='/Signup' className={styles.link}>Sign Up!</Link></h3>
    <h3 className={styles.footer}>Forgot Your Password? <Link to='/Forgotpassword' className={styles.link}>Reset it here</Link></h3>
    </div>
    </div>
    </div>
  );
}

export default Login