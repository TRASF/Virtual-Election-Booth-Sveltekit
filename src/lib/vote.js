import { firestore } from '$lib/firebaseConfig';
import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';

/**
 * @param {string} candidateId
 */
export async function incrementCandidateVote(candidateId) {
    try {
      const candidateDocRef = doc(firestore, 'candidates', candidateId);
      await updateDoc(candidateDocRef, { votes: increment(1) });
      console.log('Vote count updated for candidate:', candidateId);
    } catch (error) {
      console.error('Error updating candidate vote count:', error);
    }
  }
  /**
 * @param {string} userId
 * @param {any} candidateId
 */
  export async function setUserHasVoted(userId, candidateId) {
    try {
      const userDocRef = doc(firestore, 'votes', `${userId}_${candidateId}`);
      await updateDoc(userDocRef, { hasVoted: true });
      console.log('User vote status updated');
    } catch (error) {
      console.error('Error updating user vote status:', error);
    }
  }