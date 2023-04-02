<!-- src/routes/Results.svelte -->
<script>
  import { onMount } from 'svelte';
  import { getCandidates } from '$lib/getCandidates';
  import { firestore } from '$lib/firebaseConfig';
  import { collection, getDocs } from 'firebase/firestore';

  /**
	 * @type {any[]}
	 */
  let candidates = [];
  /**
	 * @type {any[]}
	 */
  let results = [];

  async function fetchResults() {
    const querySnapshot = await getDocs(collection(firestore, 'candidates'));
    /**
	   * @type {any[]}
	   */
    const votes = [];

    results = candidates.map((candidate) => {
      const candidateData = candidate;
      return { id: candidate.id, name: candidateData.name, votes: candidateData.votes };
    });
  }

  onMount(async () => {
    candidates = await getCandidates();
    await fetchResults();
  });
</script>
<h1>Voting Results</h1>
<table>
  <thead>
    <tr>
      <th>Candidate Name</th>
      <th>Votes</th>
    </tr>
  </thead>
  <tbody>
    {#each results as result (result.id)}
      <tr>
        <td>{result.name}</td>
        <td>{result.votes}</td>
      </tr>
    {/each}
  </tbody>
</table>
