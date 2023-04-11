<script lang="ts">
  import {auth} from "$lib/firebaseConfig";
  import { signInWithEmailAndPassword } from "firebase/auth";
  import user from "$stores/users";
	import { goto } from "$app/navigation";

  let attempts = 0;
  let message = '';
  let email = "";
  let password = "";
  let verified = "";

  async function login() {

    if(attempts>=5){
      alert("You have reach the maximum attempts to login please wait for 5 minutes before attempt again")
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      $user = userCredential.user;
      verified = userCredential.user.providerId;
      console.log($user);
      if(verified){
        goto('/vote');
      }

    } catch (error: any) {
      console.error("Error logging in: ", error.message);
      attempts++;
      message = error.message;
    }
    
  }

</script>

<h1>Login</h1>
<form on:submit|preventDefault={login}>
  <label>
    Email:
    <input type="email" bind:value={email} />
  </label>
  <br />
  <label>
    Password:
    <input type="password" bind:value={password} />
  </label>
  <div>{message}</div>
  <br />
  <button type="submit">Log in</button>
</form>
