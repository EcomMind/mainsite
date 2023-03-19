import React, { useEffect, useState } from 'react';
import ecommind from '../assets/ecommind.png'
import styles from '../styles/Home.module.css'
import { Link } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { addDoc, collection, where, query, set, setDoc, getDocs, getDoc, doc } from "@firebase/firestore"
import { useNavigate } from 'react-router-dom';
import ProductDisplay from '../components/productDisplay';
import NewProject from '../components/NewProject';
import ProductInformation from '../components/ProductInformation';

function Home() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('home');
  const [projects, setProjects] = useState([]);
  const [currentProjectID, setCurrentProjectID] = useState('');
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
          projectIndustry: '',
          projectAudience: '',
          offering: '',
          userDescription: '',
          productPrice: '',
          shortdescription: '',
          longdescription: '',
          imageNoBGUrl: '',
          imageNoBGPath: '',
        })
          .then(async (docRef) => {
            // add a new subproject to the project
            // await addDoc(collection(collectionRef, 'projects').doc(docRef.id).collection('subprojects'), {
            await setDoc(doc(collectionRef, docRef.id, 'subprojects', 'Product Information'), {
                subprojectName: 'Product Information',
                content: ["", "", "", "", "", "", ""],
              });
            await setDoc(doc(collectionRef, docRef.id, 'subprojects', 'Website Generator'), {
                subprojectName: 'Website Generator',
                content: [],
              });
            await setDoc(doc(collectionRef, docRef.id, 'subprojects', 'Advertising Generator'), {
                subprojectName: 'Advertising Generator',
                content: ["", "", "", "", "", "", ""],
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

  const handleModifyProject = async (projectID) => {
    await new Promise(resolve => {
      setCurrentProjectID(projectID);
      resolve();
    });
  };
  
  useEffect(() => {
    if (currentProjectID !== '') {
      console.log(currentProjectID);
      setPage('productInfo');
      
    }
  }, [currentProjectID]);

  const handleGoToHome = () => {
    setPage('home');
    console.log(page);
  }

  const handleGoToAds = () => {
    setPage('ads');
    console.log(page);
  }

  const handleGoToEmail = () => {
    setPage('email');
    console.log(page);
  }


  if (user) {
    // User is signed in
    return (
      <div>

        {/* This is the header */}
        <div className={styles.ecommindheader}>
          <div>
            <img src={ecommind} alt="ecommind" className={styles.headerlogo}/>
          </div>
          <nav className={styles.nav}>
            <Link to ='/Aboutus'>
              <button className={styles.button1}>About Us</button>
            </Link>
            <Link to ='/Pricing'>
              <button className={styles.button1}>Pricing</button>
            </Link>
            <Link to ='/Contactus'>
              <button className={styles.button1}>Contact Us</button>
            </Link>
            <div>
              {/* profile button here*/}
              
            </div>
          </nav>
        </div>

        {/* This is main body content */}
        <div className={styles.mainbodycontent}>
          <div className={styles.leftpurplebar}>
          </div>
          <div className={styles.sidebarleft}>
          <button className={styles.button2} onClick={handleGoToHome}>Products</button>
          <button className={styles.button2} onClick={handleGoToAds}>Marketing Content</button>
          <button className={styles.button2} onClick={handleGoToEmail}>Email Builder</button>
          </div>
          {page === 'home' ? (
          <div className={styles.productgallerycontent}>
            <div className={styles.mainbodytitle}>
              <h1>Welcome, <span className={styles.userName}>{user.displayName}</span></h1>
            </div>
            {/* display projects */}
            
              <div className={styles.projectsContainer}>
                {projects.map((project) => (
                  <div key={project.id} className={styles.projects}>
                    <button className={styles.buttonContainer} onClick={() => handleModifyProject(project.id)}>
                      <ProductDisplay id={project.id} />
                    </button>
                    
                  </div>
                ))}
                <div className={styles.projects}>
                <button className={styles.containerBut} onClick={handleCreateProject}>
                  <NewProject/>
                </button>
                </div>
              </div>
          </div>
          ) : page === 'productInfo' ?(
            <div>
              <ProductInformation projectId={currentProjectID} />

            </div>
          ) : (
            <div>
              <div>
                <h1>Other component that gets called goes here</h1>
              </div>
              <div>
                {/* render the components on the side of the screen */}
              </div>
            </div>
          )}  
        </div>
      </div>
    )
  } else {
    // User is not signed in
    return <div>Please sign in</div>;
  }
}

export default Home;