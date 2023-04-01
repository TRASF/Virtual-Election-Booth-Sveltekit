// src/lib/addCandidate.js
import { firestore } from '$lib/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

/**
 * @param {any} candidateData
 */
export async function addCandidate(candidateData) {
  try {
    const docRef = await addDoc(collection(firestore, 'candidates'), candidateData);
    console.log('Document written with ID:', docRef.id);
  } catch (error) {
    console.error('Error adding document:', error);
  }
}
