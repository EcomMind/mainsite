import React, { useEffect, useState } from 'react';
import ecommind from '../assets/ecommind.png'
import styles from '../styles/Home.module.css'
import { Link } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { addDoc, collection, where, query, set, setDoc, getDocs, getDoc, doc } from "@firebase/firestore"

function Home() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const collectionRef = collection(db, 'projects');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        
        const q = await query(collectionRef, where('userId', '==', user.uid));
        await getDocs(q)
        .then((querySnapshot) => {
          // map the documents in the snapshot to an array of project objects
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          // set the projects state with the array of project objects
          setProjects(data);
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
        
      } else {
        setProjects([]);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user]);

  const handleCreateProject = async () => {
    if (user) {
      // create a new project for the current user
      if(collection){

        await addDoc(collectionRef, {
          userId: user.uid,
          projectName: 'New Project',
        })
          .then(async (docRef) => {
            // add a new subproject to the project
            // await addDoc(collection(collectionRef, 'projects').doc(docRef.id).collection('subprojects'), {
            await addDoc(collection(collectionRef, docRef.id, 'subprojects'), {
                subprojectName: 'Product Information',
                content: '',
              });
            await addDoc(collection(collectionRef, docRef.id, 'subprojects'), {
                subprojectName: 'Website Generator',
                content: '',
              });
            await addDoc(collection(collectionRef, docRef.id, 'subprojects'), {
                subprojectName: 'Advertising Generator',
                content: '',
              });
            await addDoc(collection(collectionRef, docRef.id, 'subprojects'), {
                subprojectName: 'Social Media Content Generator',
                content: '',
              });
            await addDoc(collection(collectionRef, docRef.id, 'subprojects'), {
                subprojectName: 'Email Marketing Generator',
                content: '',
              });
          })
          .catch((error) => {
            console.error('Error adding document: ', error);
          });
      }
    }
  };

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
          {/* display projects */}
                    
          {projects.map((project) => (
            <div key={project.id}>
              <h2>
                <Link to={`/ProjectDetails/${project.id}`}>
                  {project.projectName}
                </Link>
              </h2>
            </div>
          ))}
          {/* button to create a new project */}
          <button onClick={handleCreateProject}>Create New Project</button>
        </div>
      </div>
    )
  } else {
    // User is not signed in
    return <div>Please sign in</div>;
  }
}

export default Home;