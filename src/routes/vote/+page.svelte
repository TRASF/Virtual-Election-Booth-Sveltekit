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
		updateDoc,
		increment
	} from 'firebase/firestore';
	import { firestore } from '$lib/firebaseConfig';
	import { onMount } from 'svelte';
	import { getCandidates } from '$lib/getCandidates';
	import { incrementCandidateVote, setUserHasVoted } from '$lib/vote';
	import { calculateHash } from '$lib/calculatedHash';
	import PrivateRoute from '$lib/components/PrivateRoute.svelte';

	let candidates: any[] = [];
	let selectedCandidate: any[] = [];

	async function submitVote(_uid: string, _selectedCandidate: any | string) {
		if (!selectedCandidate) return;

		const votesRef = collection(firestore, 'votes');
		const votesQuery = query(
			collection(firestore, 'votes'),
			orderBy('timestamp', 'desc'),
			limit(1)
		);

		const votesSnapshot = await getDocs(votesQuery);
		const latestVote = votesSnapshot.docs[0];

		let duplicateVote = false;

		let currentVote: any | null = latestVote;
		while (currentVote) {
			const currentVoteData = currentVote.data();
			if (
				currentVoteData.userId === _uid &&
				(currentVoteData.votedForCandidate === _selectedCandidate.id ||
					currentVoteData.VotedForparty === _selectedCandidate.party)
			) {
				duplicateVote = true;
				break;
			}
			const previousVoteId = currentVoteData.previousVoteId;
			if (previousVoteId) {
				currentVote = await getDoc(doc(firestore, 'votes', previousVoteId));
			} else {
				currentVote = null;
			}
		}

		if (duplicateVote) {
			if (latestVote.data().votedForCandidate === _selectedCandidate.id) {
				alert('You have already voted for this candidate.');
			} else {
				alert('You have already voted for this party.');
			}
			return;
		}

		const vote = {
			previousVoteId: latestVote ? latestVote.id : null,
			previousHash: latestVote ? latestVote.data().hash : null,
			timestamp: new Date().toISOString(),
			hash: '',
			userId: _uid,
			votedForCandidate: _selectedCandidate.id,
			VotedForparty: _selectedCandidate.party,
		};

		const voteRef = doc(
			firestore,
			'votes',
			`${_selectedCandidate.party}|${_selectedCandidate.id}_${_uid}`
		);
		const userDocRef = doc(firestore, 'voteParties', `${_selectedCandidate.party}`);
		try {
			vote.hash = calculateHash(vote);
			await updateDoc(userDocRef, { update: new Date(), votes: increment(1) });
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

<PrivateRoute>
	<h1>Vote for a Candidate</h1>
	<form on:submit|preventDefault={handleVoteSubmit}>
		<fieldset>
			<legend>Select a candidate:</legend>
			{#each candidates as candidate (candidate.id)}
				<div>{candidate.id}</div>
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
</PrivateRoute>
