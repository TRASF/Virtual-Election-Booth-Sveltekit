// src/lib/addCandidate.js
import { firestore } from '$lib/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

/**
 * @param {any} candidateData
 */
export async function addCandidate(candidateData) {
  let candidate = {
    name: candidateData.name,
    votes: 0,
    voteParty: candidateData.voteParty
  }
  try {
    const docRef = await addDoc(collection(firestore, 'candidates'), candidate);
    console.log('Document written with ID:', docRef.id);
  } catch (error) {
    console.error('Error adding document:', error);
  }
}
