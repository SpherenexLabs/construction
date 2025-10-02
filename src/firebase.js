// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAOFbpbOwdren9NlNtWvRVyf4DsDf9-2H4",
  authDomain: "procart-8d2f6.firebaseapp.com",
  databaseURL: "https://procart-8d2f6-default-rtdb.firebaseio.com",
  projectId: "procart-8d2f6",
  storageBucket: "procart-8d2f6.firebasestorage.app",
  messagingSenderId: "1026838026898",
  appId: "1:1026838026898:web:56b3889e347862ca37a44b",
  measurementId: "G-RW7V299RPY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

// PDF Storage functions
export const uploadPDFToStorage = async (pdfBlob, filename, metadata) => {
  try {
    console.log('Uploading PDF to Firebase Storage:', filename);
    
    // Create a reference to the file location
    const storageRef = ref(storage, `pdfs/${filename}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, pdfBlob);
    console.log('PDF uploaded successfully:', snapshot);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('PDF download URL:', downloadURL);
    
    // Save metadata to Firestore
    const docRef = await addDoc(collection(db, 'quotations'), {
      ...metadata,
      filename,
      downloadURL,
      storageRef: snapshot.ref.fullPath,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    console.log('PDF metadata saved to Firestore:', docRef.id);
    
    return {
      id: docRef.id,
      downloadURL,
      storageRef: snapshot.ref.fullPath
    };
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw error;
  }
};

// Get all PDFs from Firestore
export const getAllPDFs = async () => {
  try {
    console.log('Fetching all PDFs from Firestore...');
    const q = query(collection(db, 'quotations'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const pdfs = [];
    querySnapshot.forEach((doc) => {
      pdfs.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log('Fetched PDFs:', pdfs.length);
    return pdfs;
  } catch (error) {
    console.error('Error fetching PDFs:', error);
    throw error;
  }
};

// Update PDF metadata
export const updatePDFMetadata = async (docId, updatedData) => {
  try {
    console.log('Updating PDF metadata:', docId);
    const docRef = doc(db, 'quotations', docId);
    await updateDoc(docRef, {
      ...updatedData,
      updatedAt: new Date().toISOString()
    });
    console.log('PDF metadata updated successfully');
  } catch (error) {
    console.error('Error updating PDF metadata:', error);
    throw error;
  }
};

// Delete PDF from Storage and Firestore
export const deletePDF = async (docId, storageRefPath) => {
  try {
    console.log('Deleting PDF:', docId);
    
    // Delete from Storage
    if (storageRefPath) {
      const storageRef = ref(storage, storageRefPath);
      await deleteObject(storageRef);
      console.log('PDF deleted from Storage');
    }
    
    // Delete from Firestore
    await deleteDoc(doc(db, 'quotations', docId));
    console.log('PDF metadata deleted from Firestore');
  } catch (error) {
    console.error('Error deleting PDF:', error);
    throw error;
  }
};

export default app;