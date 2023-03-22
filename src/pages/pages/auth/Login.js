import React, { useState } from 'react'
import ecommind from '../../assets/ecommind.png'
import styles from '../../styles/Login.module.css'
import { Link } from 'react-router-dom';
import { auth } from '../../../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();
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
      nav('/Home')
    }).catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log('Error:', error);
      console.log('Error code:', errorCode);
      console.log('Error message:', errorMessage);
    })

  };

  return (
    <div>
      {/* This is the header */}
        <div class={styles.ecommindheader}>
          <div>
            <img src={ecommind} alt="ecommind" className={styles.headerlogo}/>
          </div>
          <nav class={styles.nav}>
            <Link to ='/Aboutus'>
              <button className={styles.button1}>About Us</button>
            </Link>
            <Link to ='/Pricing'>
              <button className={styles.button1}>Pricing</button>
            </Link>
            <Link to ='/Contactus'>
              <button className={styles.button1}>Contact Us</button>
            </Link>
          </nav>
        </div>
    <div className={styles.container}>
      
      <div class={styles.mainbodycontent}>
      <h1 class={styles.title}>Log In!</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="email"
            value={email}
            className={styles.inputfield}
            placeholder='Email'
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label>
          <input
            type="text"
            value={password}
            className={styles.inputfield}
            placeholder='Password'
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button className={styles.button1} type="submit" onClick={handleSubmit}>Login</button>
    </form>
    <div>
      <h3 className={styles.footer}>Dont Have an Account? <Link to='/Signup' className={styles.link}>Sign Up!</Link></h3>
      <h3 className={styles.footer}>Forgot Your Password? <Link to='/Forgotpassword' className={styles.link}>Reset it here</Link></h3>
    </div>
    </div>
    </div>
    </div>
  );
}

export default Login