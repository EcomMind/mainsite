import { useState } from 'react';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { onSnapshot } from 'firebase/firestore';
import { useEffect } from 'react';
import { db, storage } from '../../firebase';
import { Link } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import {v4} from 'uuid'

function Ads() {
  const { projectId } = useParams();
  const [projectName, setProjectName] = useState('');
  const [projectIndustry, setProjectIndustry] = useState('');
  const [projectAudience, setProjectAudience] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectProductDescription, setProjectProductDescription] = useState('');
  const [productDescriptionShort, setProductDescriptionShort] = useState('');
  const [productDescriptionLong, setProductDescriptionLong] = useState('');
  const [subprojects, setSubprojects] = useState([]);
  const projectRef = doc(collection(db, 'projects'), projectId);
  const productInformationSubProjectRef = doc(collection(projectRef, 'subprojects'), 'Product Information');
  const adsInformationSubProjectRef = doc(collection(projectRef, 'subprojects'), 'Advertising Generator');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(projectRef, 'subprojects'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubprojects(data);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(projectRef, (doc) => {
      if (doc.exists()) {
        setProjectName(doc.data().projectName);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(productInformationSubProjectRef, (doc) => {  
        if (doc.exists()) {
            setProjectIndustry(doc.data().content[0]);
            setProjectAudience(doc.data().content[1]);
            setProjectDescription(doc.data().content[2]);
            setProjectProductDescription(doc.data().content[3]);
        }
    });
    return () => unsubscribe();
    }, []);

    useEffect(() => {
      const unsubscribe = onSnapshot(adsInformationSubProjectRef, (doc) => {  
          if (doc.exists()) {
              setProductDescriptionShort(doc.data().content[0]);
              setProductDescriptionLong(doc.data().content[1]);
          }
      });
      return () => unsubscribe();
      }, []);

  const handleSave = async (event) => {   
      event.preventDefault();
      try {
          await updateDoc(adsInformationSubProjectRef, { content: [productDescriptionShort, productDescriptionLong] });
      } catch (error) {
          console.error('Error updating document: ', error);
      }
  };  

  const projectLinks = {
    "Email Marketing Generator": "/Email/",
    "Advertising Generator": "/Ads/",
    "Social Media Content Generator": "/Social/",
    "Website Generator": "/Web/",
    "Product Information": "/ProductInformation/"
  };

  const handleButton1Click = () => {
    setProductDescriptionShort('Text 1 rendered!');
  };

  const handleButton2Click = () => {
    setProductDescriptionLong('Text 2 rendered!');
  };

  
  return (
    <div>
      <h1>Project {projectName}</h1>
      <form>
      <div>
          <label>Textbox 1:</label>
          <input type="text" value={productDescriptionShort} readOnly />
          <button type="button" onClick={handleButton1Click}>
            Render Text 1
          </button>
        </div>
        <div>
          <label>Textbox 2:</label>
          <input type="text" value={productDescriptionLong} readOnly />
          <button type="button" onClick={handleButton2Click}>
            Render Text 2
          </button>
        </div>
      </form>
      {subprojects.map((subproject) => (
        <div key={subproject.id}>
          <Link to={`${projectLinks[subproject.subprojectName]}${projectId}`}>{subproject.subprojectName}</Link>
        </div>
      ))}
    </div>
  );
}

export default Ads;