import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import ecommind from '../assets/ecommind.png'
import styles from '../styles/Signup.module.css'
import { Link } from 'react-router-dom';
import { auth } from '../../firebase';
 
const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setPasswordsMatch(password === confirmPassword);
    if (passwordsMatch) {
      handleSubmit2(event);
    }else{
      alert("Passwords do not match");
    }
  };

  const handleSubmit2 = (event) => {
    event.preventDefault();
    const data = {
      email: email,
      name: name,
      password: password,
      confirmPassword: confirmPassword
    }
    // sign in with firebase auth
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      // ...
    }).catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(error)
    });

    setName('');
    setEmail('');
    setPassword('');
    setconfirmPassword('');
    setButtonClicked(true);

    // go to Home page
    window.location.href = '/VerifyEmail';
  };

  return (
    <div>
    <img src={ecommind} alt="ecommind" className={styles.logo2}/>
    <div className={styles.container}>
      <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            value={name}
            className={styles.inputfield}
            placeholder='Name'
            onChange={(event) => setName(event.target.value)}
          />
        </label>
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
        <label>
          <input
            type="text"
            value={confirmPassword}
            className={styles.inputfield}
            placeholder='Confirm Password'
            onChange={(event) => setconfirmPassword(event.target.value)}
          />
        </label>
        <button className={styles.button} type="submit" onClick={handleSubmit}>Sign up</button>
    </form>
    <hr />
    <button className={styles.button} type="submit" onClick={handleSubmit}>Signup with Google</button>
    <h3 className={styles.footer}>Already have an account? <Link to='/Login' className={styles.link}>Login</Link></h3>
    </div>
    </div>
    </div>
  );
};


export default Signup