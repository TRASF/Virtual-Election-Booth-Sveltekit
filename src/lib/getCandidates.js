// src/lib/getCandidates.js
import { firestore } from '$lib/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export async function getCandidates() {
  /**
     * @type {{ id: string; }[]}
     */
  const candidates = [];
  const querySnapshot = await getDocs(collection(firestore, 'candidates'));
  querySnapshot.forEach((doc) => {
    candidates.push({ id: doc.id, ...doc.data() });
  });
  return candidates;
}
