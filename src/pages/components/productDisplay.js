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

function ProductDisplay({ id, name, imageUrl, description }) {
    const [tempImageURL, setTempImageURL] = useState('');
    const [tempName, setTempName] = useState('');
    const [tempDescription, setTempDescription] = useState('');
    const projectRef = doc(collection(db, 'projects'), id);

    useEffect(() => {
        const unsubscribe = onSnapshot(projectRef, (doc) => {
          if (doc.exists()) {
            setTempName(doc.data().projectName);
            setTempDescription(doc.data().shortdescription);
            setTempImageURL(doc.data().imageNoBGUrl);
          }
        });
        return () => unsubscribe();
      }, []);
    
    return (
      <Link to={`/ProductInformation/${id}`}>
        <button style={{ border: "none", background: "none", padding: 0, margin: 0 }}>
          <div style={{ border: "1px solid black", padding: "10px", margin: "10px" }}>
            <h2>{tempName}</h2>
            <img src={tempImageURL} alt={tempName} style={{ width: "50%", height: "auto", marginBottom: "10px" }} />
            <p>{tempDescription}</p>
          </div>
        </button>
      </Link>
    );
  
}

export default ProductDisplay