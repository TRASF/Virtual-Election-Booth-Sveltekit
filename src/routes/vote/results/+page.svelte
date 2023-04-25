<!-- src/routes/Results.svelte -->
<script>
	import { onMount } from 'svelte';
	import { firestore } from '$lib/firebaseConfig';
	import { collection, getDocs } from 'firebase/firestore';
	import { getCandidates } from '$lib/getCandidates';
  let parties = [];
	let candidates = [];

	async function fetchResults() {
		const querySnapshot = await getDocs(collection(firestore, 'voteParties'));
		parties = querySnapshot.docs.map((partyDoc) => {
			const partyData = partyDoc.data();
			return {
				id: partyDoc.id,
				name: partyData.Name,
				candidates: partyData.candidates.map((candidateId) => candidates.find((candidate) => candidate.id === candidateId)),
				votes: partyData.votes,
			};
		});
	}

	onMount(async () => {
		candidates = await getCandidates();
		await fetchResults();
	});
</script>

<style>
	body {
		font-family: Arial, sans-serif;
		background-color: #f8f8f8;
	}

	.container {
		width: 100%;
		max-width: 800px;
		margin: 50px auto;
		padding: 30px;
		background-color: #ffffff;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		border-radius: 4px;
	}

	h1 {
		text-align: center;
		margin-bottom: 25px;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th,
	td {
		padding: 12px;
		text-align: left;
		border: 1px solid #ccc;
	}

	th {
		background-color: #f2f2f2;
		font-weight: bold;
	}

	tbody tr:nth-child(even) {
		background-color: #f8f8f8;
	}

	.party {
		border: 1px solid #ccc;
		border-radius: 5px;
		margin-bottom: 1rem;
		padding: 1rem;
	}
	.party-title {
		font-weight: bold;
		margin-bottom: 0.5rem;
	}
</style>

<h1>Voting Results</h1>
<div class="container">
	{#each parties as party (party.id)}
		<div class="party">
			<div class="party-title">{party.name} (Total Votes: {party.votes})</div>
			<table>
				<thead>
					<tr>
						<th>Candidate Name</th>
						<th>Votes</th>
					</tr>
				</thead>
				<tbody>
					{#each party.candidates as candidate (candidate.id)}
						<tr>
							<td>{candidate.name}</td>
							<td>{candidate.votes}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/each}
</div>
