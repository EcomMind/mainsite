import React, { useEffect, useState } from 'react';
import ecommind from '../assets/ecommind.png'
import styles from '../styles/Home.module.css'
import { Link } from 'react-router-dom';
import { auth } from '../../firebase';

function Home() {
    const [user, setUser] = useState(null);

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        setUser(user);
      });
  
      return () => {
        unsubscribe();
      };
    }, []);
  
    if (user) {
      // User is signed in
      return (
        <div>
          <div className={styles.header}>
            <Link to ='/Aboutus'>
              <button className={styles.button}>About Us</button>
            </Link>
            <Link to ='/Pricing'>
              <button className={styles.button}>Pricing</button>
            </Link>
            <Link to ='/Contactus'>
              <button className={styles.button}>Contact Us</button>
            </Link>
            <img src={ecommind} alt="ecommind" className={styles.logo}/>
            <Link to="/Profile">
              <button className={styles.button}>Profile</button>
            </Link>
          </div>
          <hr/>
          <div className={styles.main}>
            <h1 className={styles.title}>Welcome, <span className={styles.userName}>{user.displayName}</span></h1>
  
          </div>
        </div>
    )
    } else {
      // User is not signed in
      return <div>Please sign in</div>;
    }


    


}

export default Home