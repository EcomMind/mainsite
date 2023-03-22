import React from 'react'
import ecommind from '../../assets/ecommind.png'
import styles from '../../styles/Landing.module.css'
import TypingText from './Typewriter'
import { Link } from 'react-router-dom';

function Landing() {

  return (
    <div className={styles.Landing}>

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

        <div class={styles.mainbodycontent}>
          <h1 className={styles.title}>Transforming Ecommerce with AI</h1>
          <h2 className={styles.description}>   
              EcomMind is a startup that uses AI for rapid deployment of ecommerce solutions. Our goal is to break down the barriers of launching a product online, and making the process effortless. See how Ecommind can help you launch in less than 30 minutes.
          </h2>
          <h1 className={styles.generator}>AI generated <span className={styles.purplecomofont}><TypingText /></span></h1>

          <div class={styles.landingoptions}>
            <Link to='/Signup'>
                <button className={styles.button2}>Signup</button>
            </Link>
            <Link to='/Login'>
                <button className={styles.button2}>Login</button>
            </Link>
          </div>
        </div>
    </div>
  )
}

export default Landing