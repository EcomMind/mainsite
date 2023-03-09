import { useState } from 'react';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { onSnapshot } from 'firebase/firestore';
import { useEffect } from 'react';
import { db } from '../../firebase';


function ProductInformation() {
  const { projectId } = useParams();
  const [projectName, setProjectName] = useState('');
  const [subprojects, setSubprojects] = useState([]);
  const projectRef = doc(collection(db, 'projects'), projectId);

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

  const handleNameChange = async (event) => {
    event.preventDefault();
    try {
      await updateDoc(projectRef, { projectName: projectName });
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  return (
    <div>
      <h1>Project {projectName}</h1>
      <form onSubmit={handleNameChange}>
        <label>
          Name:
          <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
        </label>
        <button type="submit">Save</button>
      </form>
      {subprojects.map((subproject) => (
        <div key={subproject.id}>
          <h2>{subproject.subprojectName}</h2>
          <p>{subproject.content}</p>
        </div>
      ))}
    </div>
  )
}

export default ProductInformation;