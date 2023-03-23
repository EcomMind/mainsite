import React from 'react'
import { getStorage, ref, uploadBytesResumable, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import { useState } from 'react';
import { auth, db, storage } from '../../firebase';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { useEffect } from 'react';
import { onSnapshot } from "firebase/firestore";
import styles from './Ads.module.css';


function Ads({projectId}) {
  const [imageurl, setImageurl] = useState('');
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
  const [backgroundDescription, setBackgroundDescription] = useState('');
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


  const generateImage = async (prompt) => {
    console.log(" ");
  };

  const changeBackgroundPrompt = async (prompt) => {
    // console.log(" ");
    // setBackgroundDescription(prompt);
    console.log(backgroundDescription)
  };

  
  
  return (
    <div>
        <h1>Adsvertisement Generator</h1>
        <h2>Image advertisement generator:</h2>
        <img src={imageurl} alt="image" className={styles.image}></img>
        <input value={backgroundDescription} onChange={(e) => setBackgroundDescription(e.target.value)} ></input>
        <button className={styles.button} onClick={changeBackgroundPrompt}>Change Background Prompt</button>
        <button className={styles.button} onClick={generateImage}>Generate Image(s)</button>
        {/* display first image, button to generate images, change background */}
        <br></br>
        <h2>Description generator:</h2>
     

    </div>
  )
}

export default Ads