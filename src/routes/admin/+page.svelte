<!-- src/routes/Admin.svelte -->
<script lang="ts">
	import { addCandidate } from '$lib/addCandidate';

	let candidateName = '';
	let candidateParty = '';

	async function handleSubmit() {
		await addCandidate({ name: candidateName, voteParty: candidateParty });
		candidateName = '';
		candidateParty = '';
	}
</script>

<div>
	<h2>Add Candidate</h2>
	<form on:submit|preventDefault={handleSubmit}>
		<label for="candidateName">Candidate Name:</label>
		<input id="candidateName" type="text" bind:value={candidateName} required />

		<label for="candidateParty">Candidate Party:</label>
		<input id="candidateParty" type="text" bind:value={candidateParty} required />

		<button type="submit">Add Candidate</button>
	</form>
</div>

<style>
	/* Add any necessary CSS styling here */
</style>
