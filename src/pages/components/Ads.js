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
  const [imagePath, setImagePath] = useState('');
  const [image, setImage] = useState(null);
  const [imageurl, setImageUrl] = useState('');
  const [imageNoBG, setImageNoBG] = useState(null);
  const [imageNoBgUrl, setImageNoBgUrl] = useState('');
  const projectRef = doc(collection(db, 'projects'), projectId);
  const productInformationSubProjectRef = doc(collection(projectRef, 'subprojects'), 'Product Information');
  const adsInformationSubProjectRef = doc(collection(projectRef, 'subprojects'), 'Advertising Generator');
  let returnStatement = "";
  let message = "";
  let data2 = "";

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
            setImagePath(doc.data().content[4]);
        }
    });
    return () => unsubscribe();
    }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(adsInformationSubProjectRef, (doc) => {  
        if (doc.exists()) {
            setProductDescriptionShort(doc.data().content[0]);
            setProductDescriptionLong(doc.data().content[1]);
            setImageUrl(doc.data().content[2]);
        }
    });
    return () => unsubscribe();
    }, []);

  const handleSave = async (event) => {   
      event.preventDefault();
      try {
          await updateDoc(adsInformationSubProjectRef, { content: [productDescriptionShort, productDescriptionLong, imageurl] });
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

  const handleButton1Click = async () => {
    message = "Create a product description for a " + projectIndustry + " product that is targeted towards " + projectAudience + ". The product is offering " + projectDescription + ". The product description should include some of the following: " + projectProductDescription + ". The name of the product is " + projectName + ".";
    data2 = await processMessageToChatGPT(message, 100)
    console.log(data2)
    setProductDescriptionShort(data2);
  };

  const handleButton2Click = async () => {
    message = "Create a product description for a " + projectIndustry + " product that is targeted towards " + projectAudience + ". The product is offering " + projectDescription + ". The product description should include some of the following: " + projectProductDescription + ". The name of the product is " + projectName + ".";
    data2 = await processMessageToChatGPT(message, 300)
    console.log(data2)
    setProductDescriptionLong(data2);
  };

  async function processMessageToChatGPT(message, max_tokens){
    // console.log(process.env.REACT_APP_gptkey)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + process.env.REACT_APP_gptkey
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{role:'system', content:message}],
        max_tokens: max_tokens,
      })
    });
    const data = await response.json();
    // console.log(data.choices[0].message.content);
    return data.choices[0].message.content;
  }

  const getImage = async () => {
    const storageRef = ref(storage, imagePath);
    await getDownloadURL(storageRef).then(async (url) => {
      // Download the file using fetch()
      await fetch(url)
        .then(response => response.blob())
        .then(blob => {
          // Use the file blob to display the image or download it
          setImage(blob);
          console.log('File blob:', blob);
          sendImage();
        })
        .catch((error) => {
          console.error('Error downloading file:', error);
        });
    })
    .catch((error) => {
      console.error('Error retrieving file URL:', error);
    });
    
  }

  const sendImage = async () => {
    // Get the image file from state
    const imageFile = image;
  
    // Create a FormData object to send the file
    const formData = new FormData();
    await formData.append('image', imageFile);
  
    // Set the API key in the headers
    const headers = new Headers();
    headers.append('Authorization', 'my-secret-key');
  
    // Send the POST request to the API
    await fetch('http://localhost:5000/remove-background', {
      method: 'POST',
      headers: headers,
      body: formData
    })
    .then(response => {
      // Handle the response from the API
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.blob();
    })
    .then(blob => {
      // Use the file blob to display the image or download it
      setImageNoBG(blob);
      console.log('API response blob:', blob);
      handleImageUpload();
    })
    .catch(error => {
      console.error('Error sending image to API:', error);
    });    
  }

  const handleImageUpload = () => {
    console.log('Uploading image');
    if (imageNoBG == null) return;

    if (imageNoBG.size > 10000000) {
      alert('Image size is too large');
      return;
    }

    const storageRef = getStorage();
    const imagePath = `images/${imageNoBG.name + v4()}`;
    const imageRef = ref(storageRef, imagePath);

    // Delete the previously stored image
    if (imageNoBgUrl !== '') {
      const previousImageRef = ref(storageRef, imageNoBgUrl);
      deleteObject(previousImageRef)
        .then(() => {
          console.log('Previous image deleted');
        })
        .catch((error) => {
          console.error('Error deleting previous image: ', error);
        });
    }

    // Upload the new image
    const uploadTask = uploadBytesResumable(imageRef, imageNoBG);
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
          setImageNoBgUrl(url);
          console.log(imageurl);
          alert('Image uploaded successfully');
        }).then(() => {
          setImagePath(imagePath);
        });
      }
    );
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
        <button type="submit" onClick={handleSave}>save text</button>

      </form>
      {/* a button with the text "get image" that calls the getImage function */}
      <button onClick={getImage}>Get Image</button>
      <div>
        {imageNoBgUrl ? <img src={imageNoBgUrl} alt=""/> : null}
      </div>
      {subprojects.map((subproject) => (
        <div key={subproject.id}>
          <Link to={`${projectLinks[subproject.subprojectName]}${projectId}`}>{subproject.subprojectName}</Link>
        </div>
      ))}
    </div>
  );
}

export default Ads;