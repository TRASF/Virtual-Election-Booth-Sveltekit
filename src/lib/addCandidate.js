// src/lib/addCandidate.js
import { firestore } from '$lib/firebaseConfig';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { user } from './stores';

/**
 * @param {any} candidateData
 */
export async function addCandidate(candidateData) {
  let candidate = {
    name: candidateData.name,
    votes: 0,
    voteParty: ''
  }

  try {
    const candidateDocRef = await addDoc(collection(firestore, 'candidates'), candidate);

    let voteParty = {
      uid: candidateDocRef.id,
    }

    const votePartyDocRef = await addDoc(collection(firestore, 'voteParties'), voteParty);
    
    candidate.voteParty = votePartyDocRef.id;
    await updateDoc(doc(firestore, 'candidates', candidateDocRef.id), {
      voteParty: votePartyDocRef.id
    });
  } catch (error) {
    console.error('Error adding document:', error);
  }
}