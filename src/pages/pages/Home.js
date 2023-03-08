import React, { useEffect, useState } from 'react';
import ecommind from '../assets/ecommind.png'
import styles from '../styles/Signup.module.css'
import { Link } from 'react-router-dom';
import { auth } from '../../firebase';

function Home() {
    
    const [name, setName] = useState(null);
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                setName(user.displayName);
            } else {
                setName(null);
            }
        });
    }, []);
  return (
    <div>
        {name ? <p>Signed in</p> : <p>Not signed in</p>}
    </div>
  )
}

export default Home