import React, { useEffect, useState } from 'react';
import ecommind from '../assets/ecommind.png'
import styles from '../styles/Home.module.css'
import { Link } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { addDoc, collection, where, query, set, setDoc, getDocs, getDoc, doc } from "@firebase/firestore"
import {useParams} from "react-router-dom";
import { onSnapshot } from "firebase/firestore";

function ProjectDetails({ match }) {
    const { projectId } = useParams();
    const [subprojects, setSubprojects] = useState([]);
    const subprojectsRef = collection(db, 'projects', projectId, 'subprojects');
  
    useEffect(() => {
      const unsubscribe = onSnapshot(subprojectsRef, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSubprojects(data);
      });
  
      return () => unsubscribe();
    }, []);
  
    return (
      <div>
        <h1>Subprojects for Project {projectId}</h1>
        {subprojects.map((subproject) => (
          <div key={subproject.id}>
            <h2>{subproject.subprojectName}</h2>
            <p>{subproject.content}</p>
          </div>
        ))}
      </div>
    );
  }
  
  export default ProjectDetails;