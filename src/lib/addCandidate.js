// src/lib/addCandidate.js
import { firestore } from '$lib/firebaseConfig';
import { collection, addDoc, updateDoc, doc, query, getDocs, limit, orderBy, where } from 'firebase/firestore';
import sha256 from 'crypto-js/sha256';

/**
 * @param {any} candidateData
 */
export async function addCandidate(candidateData) {
  let candidate = {
    name: candidateData.name,
    votes: 0,
    voteParty: '',
    previousHash: '',
    createdAt: new Date(),
    hash: ''
  };

  try {
    // Get the last candidate from the collection
    const lastCandidateQuery = query(collection(firestore, 'candidates'), orderBy('createdAt', 'desc'), limit(1));
    const lastCandidateSnapshot = await getDocs(lastCandidateQuery);
   
    
    let lastCandidateHash = '';
    // Get the hash from the last candidate
    if (!lastCandidateSnapshot.empty) {
      lastCandidateHash = lastCandidateSnapshot.docs[0].data().hash;
    }
    
    
    // Generate the hash for the new candidate
    candidate.previousHash = lastCandidateHash;
    const hash = sha256(JSON.stringify(candidate)).toString();
    candidate.hash = hash;
    
    // Add the new candidate to the collection
    const candidateDocRef = await addDoc(collection(firestore, 'candidates'), candidate);

    const votePartiesRef = collection(firestore, 'voteParties');
    const votePartyQuery = query(votePartiesRef, where('partyName', '==', candidateData.voteParty));
    const votePartySnapshot = await getDocs(votePartyQuery);
    let votePartyDocRef;

    if (votePartySnapshot.empty) {
      // If it doesn't exist, create a new voteParty document
      let voteParty = {
        candidate: candidateDocRef.id,
        votes: 0,
        partyName: candidateData.voteParty,
        createdAt: new Date(),
        updateAt: new Date() 
      }

      votePartyDocRef = await addDoc(collection(firestore, 'voteParties'), voteParty);
    } else {
      // If it exists, get the reference to the existing document
      votePartyDocRef = votePartySnapshot.docs[0].ref;
      await updateDoc(votePartyDocRef, { updateAt: new Date() });

    }

    candidate.voteParty = votePartyDocRef.id;
    await updateDoc(doc(firestore, 'candidates', candidateDocRef.id), {
      voteParty: votePartyDocRef.id,
    });
  } catch (error) {
    console.error('Error adding document:', error);
  }
}