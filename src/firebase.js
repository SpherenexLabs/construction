// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDCtqaHkwMMnGLU7NGeITbPzTTQpK22mMs",
  authDomain: "vrmgroups-48319.firebaseapp.com",
  projectId: "vrmgroups-48319",
  storageBucket: "vrmgroups-48319.firebasestorage.app",
  messagingSenderId: "646911616967",
  appId: "1:646911616967:web:ce1d5f5a42ffe83e279be2",
  measurementId: "G-S0LR2G7SML"
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
    console.log('📤 Uploading PDF to Firebase Storage:', filename);
    console.log('PDF Blob size:', pdfBlob.size, 'bytes');
    console.log('Metadata:', metadata);
    
    // Create a reference to the file location
    const storageRef = ref(storage, `pdfs/${filename}`);
    console.log('Storage reference created:', storageRef.fullPath);
    
    // Upload the file
    console.log('Starting upload...');
    const snapshot = await uploadBytes(storageRef, pdfBlob);
    console.log('✅ PDF uploaded successfully:', snapshot.metadata);
    
    // Get download URL
    console.log('Getting download URL...');
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('✅ PDF download URL:', downloadURL);
    
    // Save metadata to Firestore
    console.log('Saving metadata to Firestore...');
    const docRef = await addDoc(collection(db, 'quotations'), {
      ...metadata,
      filename,
      downloadURL,
      storageRef: snapshot.ref.fullPath,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    console.log('✅ PDF metadata saved to Firestore with ID:', docRef.id);
    
    return {
      id: docRef.id,
      downloadURL,
      storageRef: snapshot.ref.fullPath
    };
  } catch (error) {
    console.error('❌ Error uploading PDF to Firebase:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
};

// Get all PDFs from Firestore
export const getAllPDFs = async () => {
  try {
    console.log('📥 Fetching all PDFs from Firestore...');
    const q = query(collection(db, 'quotations'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const pdfs = [];
    querySnapshot.forEach((doc) => {
      pdfs.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log('✅ Fetched', pdfs.length, 'PDFs from Firebase');
    if (pdfs.length > 0) {
      console.log('First PDF:', pdfs[0]);
    }
    return pdfs;
  } catch (error) {
    console.error('❌ Error fetching PDFs from Firestore:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
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
    console.log('Deleting item:', docId);
    console.log('Storage path:', storageRefPath);
    
    // Delete from Storage (handle if file doesn't exist)
    if (storageRefPath) {
      try {
        console.log('Deleting PDF:', storageRefPath);
        const storageRef = ref(storage, storageRefPath);
        await deleteObject(storageRef);
        console.log('✅ PDF deleted from Storage');
      } catch (storageError) {
        // If file doesn't exist in storage, log but continue to delete from Firestore
        if (storageError.code === 'storage/object-not-found') {
          console.warn('⚠️ PDF file not found in Storage (may have been deleted already):', storageRefPath);
        } else if (storageError.message && (storageError.message.includes('QUIC') || storageError.message.includes('CONNECTION'))) {
          console.warn('⚠️ Network error deleting from Storage, continuing to Firestore:', storageError.message);
        } else {
          console.error('❌ Storage deletion error:', storageError);
          // Don't throw, continue to Firestore deletion
        }
      }
    }
    
    // Delete from Firestore
    console.log('Deleting item from Firestore:', docId);
    await deleteDoc(doc(db, 'quotations', docId));
    console.log('✅ PDF metadata deleted from Firestore');
    
    return true;
  } catch (error) {
    console.error('❌ Error deleting PDF:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
};;

// Sync existing Storage files to Firestore
export const syncStorageToFirestore = async () => {
  try {
    console.log('🔄 Starting sync of Storage files to Firestore...');
    
    // List all files in the pdfs folder
    const pdfsRef = ref(storage, 'pdfs/');
    const listResult = await listAll(pdfsRef);
    console.log(`📂 Found ${listResult.items.length} files in Storage`);
    
    // Get existing Firestore documents
    const existingDocs = await getAllPDFs();
    const existingFilenames = new Set(existingDocs.map(doc => doc.filename));
    console.log(`📄 Found ${existingDocs.length} documents in Firestore`);
    
    let syncedCount = 0;
    let skippedCount = 0;
    
    // Process each file
    for (const itemRef of listResult.items) {
      const filename = itemRef.name;
      
      // Skip if already in Firestore
      if (existingFilenames.has(filename)) {
        console.log(`⏭️  Skipping ${filename} - already in Firestore`);
        skippedCount++;
        continue;
      }
      
      try {
        // Get download URL
        const downloadURL = await getDownloadURL(itemRef);
        
        // Parse filename to extract information
        // Possible formats:
        // 1. quotation_QTN-068046_1764924071752.pdf
        // 2. Tax-Quotation-QTN-068046.pdf
        // 3. Invoice-Quotation-QTN-068046.pdf
        // 4. Construction-Quotation-QTN-068046.pdf
        
        let quotationNumber = 'Unknown';
        let timestamp = Date.now();
        let documentTitle = 'Quotation';
        let type = 'quotation';
        
        // Try pattern 1: quotation_QTN-XXX_timestamp.pdf
        let matches = filename.match(/quotation_(.+?)_(\d+)\.pdf/);
        if (matches) {
          quotationNumber = matches[1];
          timestamp = parseInt(matches[2]);
        } else {
          // Try pattern 2: Tax-Quotation-QTN-XXX.pdf or Invoice-Quotation-QTN-XXX.pdf
          matches = filename.match(/(Tax|Invoice|Construction)-Quotation-(.+?)\.pdf/);
          if (matches) {
            documentTitle = `${matches[1]} Quotation`;
            quotationNumber = matches[2];
            type = matches[1].toLowerCase() === 'invoice' ? 'invoice' : 'quotation';
          } else {
            // Try to extract QTN number
            matches = filename.match(/QTN-(\d+)/i);
            if (matches) {
              quotationNumber = `QTN-${matches[1]}`;
            } else {
              quotationNumber = filename.replace('.pdf', '');
            }
          }
        }
        
        // Create metadata from filename
        const metadata = {
          type: type,
          documentTitle: documentTitle,
          quotationNumber: quotationNumber,
          customerName: 'Unknown Customer',
          siteLocationName: '',
          totalAmount: 0,
          materials: [],
          billTo: { name: 'Unknown Customer', address: '', contactNo: '', gstin: '', state: '' },
          siteLocation: { name: '', address: '', contactNo: '' },
          company: {
            name: "VRM GROUPS",
            phone: "+91 9900315454",
            email: "info@vrmgroups.com",
            website: "www.vrmgroups.com",
            address1: "15th Cross, A Block No.27",
            address2: "Ground Floor, Bhuvaneshwari Nagar",
            address3: "Magadi Main Road, Bangalore - 560091",
            gstin: "29ATHPV3440K1Z5"
          },
          invoice: { 
            number: quotationNumber, 
            date: new Date(timestamp).toISOString().slice(0, 10) 
          },
          taxRates: { sgst: 9, cgst: 9 },
          discountPercent: 0,
          status: 'active',
          filename: filename,
          downloadURL: downloadURL,
          storageRef: itemRef.fullPath,
          createdAt: new Date(timestamp).toISOString(),
          updatedAt: new Date().toISOString(),
          syncedFromStorage: true
        };
        
        // Add to Firestore
        const docRef = await addDoc(collection(db, 'quotations'), metadata);
        console.log(`✅ Synced ${filename} to Firestore with ID: ${docRef.id}`);
        syncedCount++;
        
      } catch (error) {
        console.error(`❌ Error syncing ${filename}:`, error);
      }
    }
    
    console.log(`\n📊 Sync Complete:`);
    console.log(`   ✅ Synced: ${syncedCount} files`);
    console.log(`   ⏭️  Skipped: ${skippedCount} files (already in Firestore)`);
    console.log(`   📁 Total Storage files: ${listResult.items.length}`);
    
    return {
      synced: syncedCount,
      skipped: skippedCount,
      total: listResult.items.length
    };
    
  } catch (error) {
    console.error('❌ Error syncing Storage to Firestore:', error);
    throw error;
  }
};

// ── DRAFT FUNCTIONS ──────────────────────────────────────────────────────────

// Save a new draft or update an existing one
export const saveDraftToFirebase = async (draftId, draftData) => {
  try {
    const payload = { ...draftData, updatedAt: new Date().toISOString() };
    if (draftId) {
      const docRef = doc(db, 'drafts', draftId);
      await updateDoc(docRef, payload);
      return draftId;
    } else {
      const docRef = await addDoc(collection(db, 'drafts'), {
        ...payload,
        createdAt: new Date().toISOString(),
      });
      return docRef.id;
    }
  } catch (error) {
    console.error('Error saving draft to Firebase:', error);
    throw error;
  }
};

// Get all drafts ordered by last updated
export const getAllDrafts = async () => {
  try {
    const q = query(collection(db, 'drafts'), orderBy('updatedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching drafts from Firebase:', error);
    throw error;
  }
};

// Delete a draft
export const deleteDraftFromFirebase = async (docId) => {
  try {
    await deleteDoc(doc(db, 'drafts', docId));
  } catch (error) {
    console.error('Error deleting draft from Firebase:', error);
    throw error;
  }
};

export default app;