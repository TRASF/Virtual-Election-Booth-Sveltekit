import { firestore } from '$lib/firebaseConfig';
import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { user } from './stores';

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
 * @param {any} candidate
 */
  export async function setUserHasVoted(userId, candidate) {
    try {
      const userDocRef = doc(firestore, 'votes', `${candidate.voteParty}|${candidate.id}_${userId}`);
      await updateDoc(userDocRef, { hasVoted: true });
      console.log('User vote status updated');
    } catch (error) {
      console.error('Error updating user vote status:', error);
    }
  }
