<script>
  import user from '$stores/users';
  import { collection, addDoc } from 'firebase/firestore';
  import { firestore } from '$lib/firebaseConfig';

  let selectedOption = '';

  async function submitVote() {
    if (!selectedOption) return;

    const vote = {
      userId: $user?.uid,
      option: selectedOption,
      timestamp: new Date().toISOString(),
    };
    
    try {
      const votesRef = collection(firestore, 'votes');
      await addDoc(votesRef, vote);
      alert('Vote submitted successfully!');
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('An error occurred while submitting your vote. Please try again.');
    }
  }
</script>

<select bind:value={selectedOption}>
  <option value="">Select an option</option>
  <!-- Add available voting options here -->
  <option value="option1">Option 1</option>
  <option value="option2">Option 2</option>
  <option value="option3">Option 3</option>
</select>
<button on:click={submitVote}>Submit Vote</button>
