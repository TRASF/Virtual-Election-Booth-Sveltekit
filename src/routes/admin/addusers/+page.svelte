<script lang='ts'>
    let userListText = ''
    let partyList = ''

	async function handlerAdd() {

	}
    let userList = []

	$: {
		userList = userListText.split(',').map(user => user.trim());
  	}
	
</script>

<div>
	<h2>Add User Party</h2>
	<form on:submit|preventDefault={handlerAdd}>
        <label for="candidateName">Party List:</label>
		<input id="candidateName" type="textfield" bind:value={userListText} required />
        
		<label for="candidateName">User List:</label>
		<input id="candidateName" type="textfield" bind:value={partyList} required />

		<button type="submit">Add Candidate</button>
	</form>
</div>