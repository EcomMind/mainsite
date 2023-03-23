import { useState } from 'react';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { onSnapshot } from 'firebase/firestore';
import { useEffect } from 'react';
import { auth, db, storage } from '../../firebase';
import { Link } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import {v4} from 'uuid'
import styles from '../styles/Ads.module.css';
import ProductDisplay from './productDisplay';
import ProductDisplayMain from './ProductDisplayMain';
import { getDocs, query, where } from 'firebase/firestore';


function Ads() {
  const { id } = useParams();
  // const navigate = useNavigate();
  const { projectId } = useParams();
  const [projectName, setProjectName] = useState('');
  const [projectIndustry, setProjectIndustry] = useState('');
  const [projectAudience, setProjectAudience] = useState('');
  const [projectOffering, setProjectOffering] = useState('');
  const [userDescription, setUserDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePath, setImagePath] = useState('');
  const [imageurl, setImageurl] = useState('');
  
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const collectionRef = collection(db, 'projects');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  // const projectRef = doc(collection(db, 'projects'), projectId);
  // const adsInformationSubProjectRef = doc(collection(projectRef, 'subprojects'), 'Advertising Generator');

  // get all of the projects
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



  // da return
  return (
    <div>
      <h1>here</h1>
      <div className={styles.projectsContainer}      >
              {projects.map((project) => (
                <div key={project.id} className={styles.projects}
                draggable="true"
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", "dragged-item");
                  e.dataTransfer.effectAllowed = "all";
                }}>
                  <ProductDisplayMain id={project.id} />
                </div>
              ))}
      </div>
      <div
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDraggingOver(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
      }}
      onDragLeave={() => {
        setIsDraggingOver(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setIsDraggingOver(false);

        // handle drop action
        const data = event.dataTransfer.getData("text/plain");
        if (data === "dragged-item") {
          console.log("item dropped");
        }
      }}
      style={{ backgroundColor: isDraggingOver ? "gray" : "white" }}
    >
      Drop here!
    </div>
    </div>
  );
}

export default Ads;