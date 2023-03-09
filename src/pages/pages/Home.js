import React, { useEffect, useState } from 'react';
import ecommind from '../assets/ecommind.png'
import styles from '../styles/Home.module.css'
import { Link } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { addDoc, collection, where, query, set, setDoc, getDocs, getDoc, doc } from "@firebase/firestore"
import { useNavigate } from 'react-router-dom';

function Home() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const collectionRef = collection(db, 'projects');
  const nav = useNavigate();

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
            await setDoc(doc(collectionRef, docRef.id, 'subprojects', 'Product Information'), {
                subprojectName: 'Product Information',
                content: ["", "", "", "", "", ""],
              });
            await setDoc(doc(collectionRef, docRef.id, 'subprojects', 'Website Generator'), {
                subprojectName: 'Website Generator',
                content: [],
              });
            await setDoc(doc(collectionRef, docRef.id, 'subprojects', 'Advertising Generator'), {
                subprojectName: 'Advertising Generator',
                content: [],
              });
            await setDoc(doc(collectionRef, docRef.id, 'subprojects', 'Social Media Content Generator'), {
                subprojectName: 'Social Media Content Generator',
                content: [],
              });
            await setDoc(doc(collectionRef, docRef.id, 'subprojects', 'Email Marketing Generator'), {
                subprojectName: 'Email Marketing Generator',
                content: [],
              });
            nav('/ProductInformation/' + docRef.id)
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
                <Link to={`/ProductInformation/${project.id}`}>
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