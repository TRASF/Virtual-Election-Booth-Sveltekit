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

<style>
  body {
    font-family: Arial, sans-serif;
    background-color: #f8f8f8;
  }

  .container {
    width: 100%;
    max-width: 400px;
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

  label {
    display: block;
    margin-bottom: 10px;
  }

  input {
    width: 100%;
    padding: 8px 12px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .error-message {
    color: #c00;
    margin-bottom: 15px;
  }

  button {
    width: 100%;
    padding: 10px;
    background-color: #0275d8;
    border: none;
    border-radius: 4px;
    color: #ffffff;
    font-size: 16px;
    cursor: pointer;
  }

  button:hover {
    background-color: #016cbe;
  }
</style>