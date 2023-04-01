<script lang="ts">
  import {auth} from "$lib/firebaseConfig";
  import { signInWithEmailAndPassword } from "firebase/auth";
  import user from "$stores/users";
	import { goto } from "$app/navigation";

  let email = "";
  let password = "";
  let verified = "";
  async function login() {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      $user = userCredential.user;
      verified = userCredential.user.providerId;
      console.log($user);
      if(verified){
        goto('/vote');
      }

    } catch (error) {
      console.error("Error logging in: ", error);
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
  <br />
  <button type="submit">Log in</button>
</form>
