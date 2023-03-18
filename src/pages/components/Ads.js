import { useState } from 'react';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { onSnapshot } from 'firebase/firestore';
import { useEffect } from 'react';
import { db, storage } from '../../firebase';
import { Link } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import {v4} from 'uuid'
import styles from '../styles/Ads.module.css';

function Ads() {
  const { id } = useParams();
  // const navigate = useNavigate();
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
  
  // const projectRef = doc(collection(db, 'projects'), projectId);
  // const adsInformationSubProjectRef = doc(collection(projectRef, 'subprojects'), 'Advertising Generator');


  // da return
  return (
    <div>
      <h1>here</h1>
    </div>
  );
}

export default Ads;