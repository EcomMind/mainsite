import React, { useState } from 'react';
import ecommind from '../assets/ecommind.png'
import styles from '../styles/Signup.module.css'
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [clicked, setClicked] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      email: email,
    }
    setClicked(true);
  };

  return (
    <div>
      <img src={ecommind} alt="ecommind" className={styles.logo2}/>
      <div className={styles.container}>
        {clicked ? (
          <h2>An email has been sent, please check your inbox.</h2>
        ) : ( 
          <div>
        <h1>Reset Password</h1>
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
          <button className={styles.button} type="submit" onClick={handleSubmit}>Reset Password</button>
      </form>
      </div>
      )}
      <h3 className={styles.footer}>Dont Have an Account? <Link to='/Signup' className={styles.link}>Sign Up!</Link></h3>
      </div>
    </div>
     
  );
}

export default ForgotPassword