import React from 'react'
import ecommind from '../../assets/ecommind.png'
import styles from '../../styles/Login.module.css'
import { Link } from 'react-router-dom';


function VerifyEmail() {
  return (
    <div>
        <img src={ecommind} alt="ecommind" className={styles.logo2}/>
        <div className={styles.container}>
            <h1>Verify Email</h1>
            <p>An email has been sent to your email address. Please check your inbox and click the link to verify your email address.</p>
        </div>
    </div>
  )
}

export default VerifyEmail