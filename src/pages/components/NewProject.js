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
import styles from './productDisplay.module.css'

function NewProject({ id, name, imageUrl, description }) {
    
    return (
      
      
        <div style={{ border: "1px solid black", padding: "10px", margin: "10px" }}>
          <h1>Click To Create A New Project</h1>
        </div>
    
      
    );
  
}

export default NewProject