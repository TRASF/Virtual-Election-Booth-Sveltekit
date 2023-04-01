<script>
	import user from '$stores/users';
	import { collection, addDoc } from 'firebase/firestore';
	import { firestore } from '$lib/firebaseConfig';
	import { getCandidates } from '$lib/getCandidates';
	import { onMount } from 'svelte';

	/**
	 * @type {any[]}
	 */
	let candidates = [];
	let selectedCandidate = '';

	onMount(async () => {
		candidates = await getCandidates();
	});

	async function submitVote() {
		if (selectedCandidate) {
		}
		const voteData = {
			voterId: $user?.uid,
			candidateId: selectedCandidate,
			timestamp: new Date().toISOString()
		};

    try {
    const docRef = await addDoc(collection(firestore, 'votes'), voteData);
    console.log('Document written with ID:', docRef.id);
  } catch (error) {
    console.error('Error adding document:', error);
  }
	}
</script>

<select bind:value="{selectedCandidate}">
  <option value="">Select a candidate</option>
  {#each candidates as candidate (candidate.id)}
    <option value="{candidate.id}">{candidate.name}</option>
  {/each}
</select>
<button on:click={submitVote}>Submit Vote</button>
