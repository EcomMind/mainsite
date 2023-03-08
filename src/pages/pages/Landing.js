import React from 'react'
import ecommind from '../assets/ecommind.png'
import styles from '../styles/Landing.module.css'
import TypingText from './Typewriter'
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className={styles.Landing}>
        <img src={ecommind} alt="ecommind" className={styles.logo}/>
        <br />
        <h1 className={styles.title}>Transforming Ecommerce with AI</h1>
        <h2 className={styles.description}>   
            EcomMind is a startup that uses AI for rapid deployment of ecommerce solutions. Our goal is to break down the barriers of launching a product online, and making the process effortless. See how Ecommind can help you launch in less than 30 minutes.
        </h2>
        <h1 className={styles.generator}>AI generated <span className={styles.TypingText}><TypingText /></span></h1>
        <br />
        <Link to='/Signup'>
            <button className={styles.button1}>Signup</button>
        </Link>
        <Link to='/Login'>
            <button className={styles.button1}>Login</button>
        </Link>
    </div>
  )
}

export default Landing