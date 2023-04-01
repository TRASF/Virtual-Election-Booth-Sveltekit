<script lang="ts">
    import user from '$stores/users';
    import PrivateRoute from '$lib/components/PrivateRoute.svelte';
  
    // Replace this with an API call to fetch the vote results
    const results = [
      { name: 'Candidate A', votes: 25 },
      { name: 'Candidate B', votes: 35 },
      { name: 'Candidate C', votes: 15 },
    ];
  
    let totalVotes = 0;
  
    $: {
      totalVotes = results.reduce((sum, candidate) => sum + candidate.votes, 0);
    }
  </script>
  
  <PrivateRoute>
    <h1>Vote Results</h1>
  
    <div class="results">
      {#each results as result (result.name)}
        <div class="result">
          <div class="name">{result.name}</div>
          <div class="bar" style="width: {result.votes / totalVotes * 100}%">
            <div class="votes">{result.votes} votes</div>
          </div>
        </div>
      {/each}
    </div>
  </PrivateRoute>
  
  <style>
    .results {
      width: 100%;
    }
  
    .result {
      margin-bottom: 20px;
    }
  
    .name {
      font-weight: bold;
    }
  
    .bar {
      background-color: #4caf50;
      text-align: center;
      color: white;
      padding: 5px;
      border-radius: 5px;
    }
  
    .votes {
      font-weight: bold;
    }
  </style>
  