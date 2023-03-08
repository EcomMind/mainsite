import React, { useEffect, useState } from 'react';
import ecommind from '../assets/ecommind.png'
import styles from '../styles/Profile.module.css'
import { Link } from 'react-router-dom';
import { auth } from '../../firebase';

function Profile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        setUser(user);
      });
  
      return () => {
        unsubscribe();
      };
    }, []);

    return (
        <div>
        <img src={ecommind} alt="ecommind" className={styles.logo2}/>
        <div className={styles.container}>
            <h1>Profile</h1>
            <p>Here is your profile information:</p>
            <p>Name: {user.displayName}</p>
            <p>Email: {user.email}</p>
        </div>
        </div>
    )
}

export default Profile