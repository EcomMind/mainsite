import React, { useState } from 'react';
import ecommind from '../assets/ecommind.png'
import styles from '../styles/Signup.module.css'
import { Link } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [buttonClicked, setButtonClicked] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      email: email,
      name: name,
      password: password,
      confirmPassword: confirmPassword
    }
    setName('');
    setEmail('');
    setPassword('');
    setconfirmPassword('');
    setButtonClicked(true);

    // go to Home page
    window.location.href = '/home';
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
    <button className={styles.button} type="submit" onClick={handleSubmit}>Signup with Facebook</button>
    <h3 className={styles.footer}>Already have an account? <Link to='/Login' className={styles.link}>Login</Link></h3>
    </div>
    </div>
    </div>
  );
};


export default Signup