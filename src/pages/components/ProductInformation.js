import React from 'react'
import { useState } from 'react';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { Navigate, useParams } from 'react-router-dom';
import { onSnapshot } from 'firebase/firestore';
import { useEffect } from 'react';
import { db, storage } from '../../firebase';
import { Link } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import {v4} from 'uuid'
import { useNavigate } from "react-router-dom";
import {ProductDisplay} from './productDisplay'

function ProductInformation() {
  const navigate = useNavigate();
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
  
  const projectRef = doc(collection(db, 'projects'), projectId);

  useEffect(() => {
    const unsubscribe = onSnapshot(projectRef, (doc) => {
      if (doc.exists()) {
        setProjectName(doc.data().projectName);
        setProjectIndustry(doc.data().projectIndustry);
        setProjectAudience(doc.data().projectAudience);
        setProjectOffering(doc.data().offering);
        setUserDescription(doc.data().userDescription);
        setProductPrice(doc.data().productPrice);
        setShortDescription(doc.data().shortdescription);
        setLongDescription(doc.data().longdescription);
        setImageurl(doc.data().imageNoBGUrl);
        setImagePath(doc.data().imageNoBGPath);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async (event) => {   
      // get long and short description from gpt api
      try {
          await updateDoc(projectRef, { projectName: projectName, projectIndustry: projectIndustry, projectAudience: projectAudience, offering: projectOffering, userDescription: userDescription, productPrice: productPrice, shortdescription: shortDescription, longdescription: longDescription, imageNoBGUrl: imageurl, imageNoBGPath: imagePath});
      } catch (error) {
          console.error('Error updating document: ', error);
      }
      alert('Saved!');
      navigate('/home');
  };  

  async function createShortDescription(e){
    e.preventDefault();
    const messageShort = "Create a product description for a " + projectIndustry + " product that is targeted towards " + projectAudience + ". The product is offering " + projectOffering + ". The product description should include some of the following: " + userDescription + ". The name of the product is " + projectName + ". This should be 1 paragraph long.";
    await processMessageToChatGPT(messageShort, 100).then((result) => {
        setShortDescription(result);
    }
    );
    console.log(shortDescription)
  }

  async function createLongDescription(e){
    e.preventDefault();
    const messageLong = "Create a product description for a " + projectIndustry + " product that is targeted towards " + projectAudience + ". The product is offering " + projectOffering + ". The product description should include some of the following: " + userDescription + ". The name of the product is " + projectName + ". This should be 2-3 longer paragraphs long.";
    await processMessageToChatGPT(messageLong, 300).then((result) => {
        setLongDescription(result);
    }
    );
    console.log(longDescription)
  }
    

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
        n: 1,
        
      })
    });
    const data = await response.json();
    // console.log(data.choices[0].message.content);
    return data.choices[0].message.content;
  }


  const handleImageUpload = async () => {
    if (!image) return;
    console.log(image.size);
  
    if (image.size > 10000000) {
      alert('Image size is too large');
      return;
    }
  
    let newImage = image;
  
    // resize the image
  
    if (image.size > 0) {
      console.log('Image size is too large, resizing...');
      const resizedImage = await resizeImage(image, 500, 500, 0.5);
      newImage = new File([resizedImage], image.name, {
        type: image.type,
        lastModified: Date.now(),
      });
    }
  
    //get image without background
    console.log("removing background")
    const imageWithoutBackground = await removeBackground(newImage);
  
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
    const uploadTask = uploadBytesResumable(imageRef, imageWithoutBackground);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // ...
      },
      (error) => {
        console.error('Error uploading image: ', error);
      },
      () => {
        getDownloadURL(imageRef).then(async (url) => {
          console.log(imageurl);
          alert('Image uploaded successfully');
          setImageurl(url);
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
        console.log(img.onerror)
        img.onerror = reject;
      };
      console.log(reader.onerror)
      reader.onerror = reject;
    });
  }
  
  const removeBackground = (imageFile) => {
    return new Promise(async (resolve, reject) => {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const headers = new Headers();
      headers.append('Authorization', 'my-secret-key');
      
      fetch('http://localhost:5000/remove-background', {
        method: 'POST',
        headers: headers,
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Bad request');
        }
        return response.blob();
      })
      .then(async blob => {
        await resolve(new File([blob], imageFile.name, { type: imageFile.type, lastModified: imageFile.lastModified }));
      })
      .catch(error => {
        //reject if error
        reject();
        console.error('Error sending image to API:', error);
      });  
    });  
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
          <input type="text" value={projectOffering} onChange={(e) => setProjectOffering(e.target.value)} />
        </label>
        <label>
          Product Description (3 sentences max):
          <input type="text" value={userDescription} onChange={(e) => setUserDescription(e.target.value)} />
        </label>
        <label>
          What is the price of your product?:
          <input type="text" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} />
        </label>
      </form>
      <form>
        <label>
          Short Description
          <input type="text" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
        </label>
        <button onClick={createShortDescription}>Regenerate Short Description</button>
        <br/>
        <label>
          Long Description
          <input type="text" value={longDescription} onChange={(e) => setLongDescription(e.target.value)} />
        </label>
        <button onClick={createLongDescription}>Regenerate Long Description</button>
      </form>

      <input type="file" onChange={(event) => {setImage(event.target.files[0])}} />
      <button onClick={handleImageUpload}>Upload</button>
      <div>
        {imageurl ? <img src={imageurl} alt=""/> : null}
      </div>
      <button type="submit" onClick={handleSave}>Save</button>
    </div>
  );
}

export default ProductInformation;