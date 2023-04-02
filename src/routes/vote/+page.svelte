<script>
  import { auth } from '$lib/firebaseConfig';
  import { collection, getDoc, orderBy, limit, query, getDocs, doc, setDoc } from 'firebase/firestore';
  import { firestore } from '$lib/firebaseConfig';
  import { onMount } from 'svelte';
  import { getCandidates } from '$lib/getCandidates';
  import { incrementCandidateVote, setUserHasVoted } from '$lib/vote';

  /**
	 * @type {any[]}
	 */
  let candidates = [];
  let selectedCandidate = '';


  /**
	 * @param {any} _uid
	 * @param {string} _selectedCandidate
	 */
  async function submitVote(_uid, _selectedCandidate) {
    if (!selectedCandidate) return;

    const votesQuery = query(
    collection(firestore, 'votes'),
    orderBy('timestamp', 'desc'),
    limit(1)
  );
  
  const votesSnapshot = await getDocs(votesQuery);
  const latestVote = votesSnapshot.docs[0];
    const vote = {
      userId: _uid,
      votedFor: _selectedCandidate,
      timestamp: new Date().toISOString(),
      prevVoteId: latestVote ? latestVote.id : null,
    };
    
    const voteRef = doc(firestore, 'votes', `${_uid}_${_selectedCandidate}`);

    try {
      await setDoc(voteRef, vote);
      await incrementCandidateVote(selectedCandidate);
      await setUserHasVoted(_uid, _selectedCandidate);
      verifyVoteChain();
      alert('Vote submitted successfully!');
      return true;
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('An error occurred while submitting your vote. Please try again.');
      return false;
    }
    
  }

  async function verifyVoteChain() {
  let currentVoteId = null;
  let valid = true;

  while (valid) {
    // @ts-ignore
    const currentVoteRef = doc(firestore, 'votes', currentVoteId);
    // @ts-ignore
    const currentVoteDoc = await getDoc(currentVoteRef);

    if (!currentVoteDoc.exists()) {
      break;
    }

    // @ts-ignore
    const currentVoteData = currentVoteDoc.data();
    if (currentVoteData.prevVoteId !== currentVoteId) {
      valid = false;
      console.error('Invalid vote chain at:', currentVoteId);
      break;
    }

    currentVoteId = currentVoteData.prevVoteId;
  }

  if (valid) {
    console.log('Vote chain verified');
  }
}

  onMount(async () => {
    candidates = await getCandidates();
  });

  async function handleVoteSubmit() {
    if (!selectedCandidate) {
      console.error('No candidate selected');
      return;
    }

    const  uid  = auth.currentUser?.uid;
    if (!uid) {
      console.error('User ID not found');
      return;
    }

    try {
      await submitVote(uid, selectedCandidate);
      console.log('Vote submitted successfully');
      // Redirect or show a success message
    } catch (error) {
      console.error('Error submitting vote:', error);
    }
  }

</script>
<h1>Vote for a Candidate</h1>
<form on:submit|preventDefault={handleVoteSubmit}>
  <fieldset>
    <legend>Select a candidate:</legend>
    {#each candidates as candidate (candidate.id)}
      <div>
        <input
          type="radio"
          id="candidate-{candidate.id}"
          name="candidate"
          value="{candidate.id}"
          bind:group={selectedCandidate}
        />
        <label for="candidate-{candidate.id}">{candidate.name}</label>
      </div>
    {/each}
  </fieldset>
  <button type="submit">Submit Vote</button>
</form>
