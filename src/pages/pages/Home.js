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
        <img src={ecommind} alt="ecommind" className={styles.logo2}/>
        <div className={styles.container}>
            <h1>Home</h1>
            <p>Welcome to the home page, <span>{user.displayName}</span></p>
        </div>
        <Link to="/Profile">Profile</Link>
        </div>
    )
    } else {
      // User is not signed in
      return <div>Please sign in</div>;
    }


    


}

export default Home