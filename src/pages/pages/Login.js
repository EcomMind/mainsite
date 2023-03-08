import React, { useState } from 'react'
import ecommind from '../assets/ecommind.png'
import styles from '../styles/Login.module.css'
import { Link } from 'react-router-dom';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      email: email,
      password: password,
    }
    setEmail('');
    setPassword('');
    // go to Home page
    window.location.href = '/home';
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