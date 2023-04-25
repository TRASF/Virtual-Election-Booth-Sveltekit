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
	import { incrementCandidateVote, setUserHasVoted } from '$lib/voteHepler';
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

	let parties: any[] = [];

	async function fetchPartiesAndCandidates() {
		const partiesSnapshot = await getDocs(collection(firestore, 'voteParties'));
		parties = partiesSnapshot.docs.map((partyDoc) => {
			const partyData = partyDoc.data();
			return {
				id: partyDoc.id,
				name: partyData.Name,
				candidates: partyData.candidates.map((candidateId: any) => candidates.find((candidate) => candidate.id === candidateId)),
				votes: partyData.votes,
			};
		});
	}

	onMount(async () => {
		candidates = await getCandidates();
		await fetchPartiesAndCandidates();

	});
</script>

<PrivateRoute>
	<style>
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
		.candidate {
			margin-bottom: 0.25rem;
		}
	</style>

	<h1>Vote for a Candidate</h1>
	<form on:submit|preventDefault={handleVoteSubmit}>
		{#each parties as party (party.id)}
			<div class="party">
				<div class="party-title">{party.name}</div>
				{#each party.candidates as candidate (candidate.id)}
					<div class="candidate">
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
			</div>
		{/each}
		<button type="submit">Submit Vote</button>
	</form>
</PrivateRoute>


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
  
	fieldset {
	  border: 1px solid #ccc;
	  padding: 20px;
	  margin-bottom: 20px;
	}
  
	legend {
	  font-weight: bold;
	  padding: 0 5px;
	}
  
	div {
	  margin-bottom: 10px;
	}
  
	button {
	  background-color: #4CAF50;
	  color: white;
	  padding: 10px 20px;
	  border: none;
	  border-radius: 4px;
	  cursor: pointer;
	  font-size: 16px;
	}
  
	button:hover {
	  background-color: #45a049;
	}
  </style>
  