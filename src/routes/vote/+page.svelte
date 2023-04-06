<script lang="ts">
	import { auth } from '$lib/firebaseConfig';
	import {
		collection,
		getDoc,
		orderBy,
		limit,
		query,
		getDocs,
		doc,
		setDoc,
		where
	} from 'firebase/firestore';
	import { firestore } from '$lib/firebaseConfig';
	import { onMount } from 'svelte';
	import { getCandidates } from '$lib/getCandidates';
	import { incrementCandidateVote, setUserHasVoted } from '$lib/vote';

	let candidates: any[] = [];
	let selectedCandidate: any[] = [];

	async function submitVote(_uid: string, _selectedCandidate: any | string) {
		if (!selectedCandidate) return;

		const votesRef = collection(firestore, 'votes');

		const userVoteQuery = query(
			votesRef,
			where('userId', '==', _uid),
			where('votedFor', '==', _selectedCandidate.id)
		);
		const userVoteParty = query(
			votesRef,
			where('userId', '==', _uid),
			where('voteParty', '==', _selectedCandidate.voteParty)
		);
		const votesQuery = query(
			collection(firestore, 'votes'),
			orderBy('timestamp', 'desc'),
			limit(1)
		);

		const userVotePartySnapshot = await getDocs(userVoteParty);
		const userVoteCandidateSnapshot = await getDocs(userVoteQuery);
		const votesSnapshot = await getDocs(votesQuery);
		const latestVote = votesSnapshot.docs[0];

		const vote = {
			userId: _uid,
			votedFor: _selectedCandidate.id,
			voteParty: _selectedCandidate.voteParty,
			prevVoteId: latestVote ? latestVote.id : null,
			timestamp: new Date().toISOString()
		};

		const voteRef = doc(
			firestore,
			'votes',
			`${_selectedCandidate.voteParty}|${_selectedCandidate.id}_${_uid}`
		);

		if (!userVoteCandidateSnapshot.empty) {
			alert('You have already voted for this candidate.');
			return;
		}
		if (!userVotePartySnapshot.empty) {
			alert('You have already voted for this party.');
			return;
		}

		try {
			await setDoc(voteRef, vote);
			await incrementCandidateVote(_selectedCandidate.id);
			await setUserHasVoted(_uid, _selectedCandidate);
			alert('Vote submitted successfully!');
		} catch (error: any) {
			console.error('Error submitting vote:', error.message);
			alert('An error occurred while submitting your vote. Please try again.');
		}
	}

	async function handleVoteSubmit() {
		if (!selectedCandidate) {
			console.error('No candidate selected');
			return;
		}

		const uid = auth.currentUser?.uid;

		if (!uid) {
			console.error('User ID not found');
			return;
		}

		try {
			// @ts-ignore
			await submitVote(uid, selectedCandidate);
			console.log('Vote submitted successfully');
			// Redirect or show a success message
		} catch (error) {
			console.error('Error submitting vote:', error);
		}
	}

	onMount(async () => {
		candidates = await getCandidates();
	});
</script>

<h1>Vote for a Candidate</h1>
<form on:submit|preventDefault={handleVoteSubmit}>
	<fieldset>
		<legend>Select a candidate:</legend>
		{#each candidates as candidate (candidate.id)}
			<div>{candidate.toISOString}</div>
			<div>
				<input
					type="radio"
					id="candidate-{candidate.id}"
					name="candidate"
					value={candidate}
					bind:group={selectedCandidate}
				/>
				<label for="candidate-{candidate.id}">{candidate.name}</label>
			</div>
		{/each}
	</fieldset>
	<button type="submit">Submit Vote</button>
</form>
