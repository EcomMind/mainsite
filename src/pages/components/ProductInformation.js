import { useState } from 'react';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { onSnapshot } from 'firebase/firestore';
import { useEffect } from 'react';
import { db, storage } from '../../firebase';
import { Link } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import {v4} from 'uuid'

function ProductInformation() {
  const { projectId } = useParams();
  const [projectName, setProjectName] = useState('');
  const [projectIndustry, setProjectIndustry] = useState('');
  const [projectAudience, setProjectAudience] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectProductDescription, setProjectProductDescription] = useState('');
  const [subprojects, setSubprojects] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePath2, setImagePath] = useState('');
  const [imageurl, setImageurl] = useState('');
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

  useEffect(() => {
    const unsubscribe = onSnapshot(productInformationSubProjectRef, (doc) => {  
        if (doc.exists()) {
            setProjectIndustry(doc.data().content[0]);
            setProjectAudience(doc.data().content[1]);
            setProjectDescription(doc.data().content[2]);
            setProjectProductDescription(doc.data().content[3]);
            setImageurl(doc.data().content[4]);
        }
    });
    return () => unsubscribe();
    }, []);

  const handleSave = async (event) => {   
      event.preventDefault();
      try {
          await updateDoc(projectRef, { projectName: projectName });
          await updateDoc(productInformationSubProjectRef, { content: [projectIndustry, projectAudience, projectDescription, projectProductDescription, imageurl, imagePath2] });
      } catch (error) {
          console.error('Error updating document: ', error);
      }
  };  

  const handleImageUpload = () => {
    if (image == null) return;

    if (image.size > 10000000) {
      alert('Image size is too large');
      return;
    }
    
    if(image.size > 1000000){
      console.log('Image size is too large, resizing...')
      resizeImage(image, 500, 500, 0.5).then((resizedImage) => {
        setImage(resizedImage);
      });
    }

    const storageRef = getStorage();
    const imagePath = `images/${image.name + v4()}`;
    const imageRef = ref(storageRef, imagePath);

    // Delete the previously stored image
    if (imageurl !== '') {
      const previousImageRef = ref(storageRef, imageurl);
      deleteObject(previousImageRef)
        .then(() => {
          console.log('Previous image deleted');
        })
        .catch((error) => {
          console.error('Error deleting previous image: ', error);
        });
    }

    // Upload the new image
    const uploadTask = uploadBytesResumable(imageRef, image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // ...
      },
      (error) => {
        console.error('Error uploading image: ', error);
      },
      () => {
        getDownloadURL(imageRef).then((url) => {
          setImageurl(url);
          console.log(imageurl);
          alert('Image uploaded successfully');
        }).then(() => {
          setImagePath(imagePath);
        });
      }
    );
  };

  const resizeImage = async (file, maxWidth, maxHeight, quality) => {
    return new Promise(async (resolve, reject) => {
      const reader = new FileReader();
      await reader.readAsDataURL(file);
      reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = async function () {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
  
          let width = img.width;
          let height = img.height;
  
          // Calculate new dimensions to fit within maxWidth and maxHeight
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
  
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
          console.log(width, height)
          canvas.width = width;
          canvas.height = height;
  
          // Draw the image on the canvas with the new dimensions
          await ctx.drawImage(img, 0, 0, width, height);
  
          // Convert canvas to blob and resolve with the new file
          canvas.toBlob(async (blob) => {
            console.log(blob);
            await resolve(new File([blob], file.name, { type: file.type, lastModified: file.lastModified }));
          }, file.type, quality);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  }


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
      <input type="file" onChange={(event) => {setImage(event.target.files[0])}} />
      <button onClick={handleImageUpload}>Upload</button>
      <div>
        {imageurl ? <img src={imageurl} alt=""/> : null}
      </div>
      {subprojects.map((subproject) => (
        <div key={subproject.id}>
          <Link to={`${projectLinks[subproject.subprojectName]}${projectId}`}>{subproject.subprojectName}</Link>
        </div>
      ))}
    </div>
  );
}

export default ProductInformation;