import { useState } from 'react';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { onSnapshot } from 'firebase/firestore';
import { useEffect } from 'react';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';

function ProductInformation() {
  const { projectId } = useParams();
  const [projectName, setProjectName] = useState('');
  const [projectIndustry, setProjectIndustry] = useState('');
  const [projectAudience, setProjectAudience] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectProductDescription, setProjectProductDescription] = useState('');
  const [subprojects, setSubprojects] = useState([]);
  const projectRef = doc(collection(db, 'projects'), projectId);
  const productInformationSubProjectRef = doc(collection(projectRef, 'subprojects'), 'Product Information');


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

  // useeffect function to get the subproject data, through the content array which looks like this:
    // content: ["", "", "", "", ""]
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
    

  

  const handleSave = async (event) => {   
      event.preventDefault();
      try {
          await updateDoc(projectRef, { projectName: projectName });
          await updateDoc(productInformationSubProjectRef, { content: [projectIndustry, projectAudience, projectDescription, projectProductDescription] });
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
  
  return (
    <div>
      <h1>Project {projectName}</h1>
      <form>
        <label>
          Name:
          <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
        </label>
        <label>
          Target industry:
          <input type="text" value={projectIndustry} onChange={(e) => setProjectIndustry(e.target.value)} />
        </label>
        <label>
          Target audience:
          <input type="text" value={projectAudience} onChange={(e) => setProjectAudience(e.target.value)} />
        </label>
        <label>
          What are you offering? (Physical goods, services, etc.):
          <input type="text" value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} />
        </label>
        <label>
          Product Description (3 sentences max):
          <input type="text" value={projectProductDescription} onChange={(e) => setProjectProductDescription(e.target.value)} />
        </label>
        <button type="submit" onClick={handleSave}>Save</button>
      </form>
      {subprojects.map((subproject) => (
        <div key={subproject.id}>
          <Link to={`${projectLinks[subproject.subprojectName]}${projectId}`}>{subproject.subprojectName}</Link>
        </div>
      ))}
    </div>
  );
}

export default ProductInformation;