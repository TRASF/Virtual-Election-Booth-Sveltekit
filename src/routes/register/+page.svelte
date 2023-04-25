<script lang="ts">
    import { auth } from '$lib/firebaseConfig';
    import { createUserWithEmailAndPassword } from 'firebase/auth';
    import { goto } from '$app/navigation';
    
    let IdentificationID = ''
    let email = '';
    let password = '';
    let confirmPassword = '';
    let errorMessage = '';
  
    async function register() {
      if (password !== confirmPassword) {
        errorMessage = 'Passwords do not match';
        return;
      }
  
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('User registered:', userCredential.user);
        goto('/login');
      } catch (error : any) {
        console.error('Error registering user:', error);
        errorMessage = error.message;
      }
    }
  </script>
  
  <h1>Register</h1>
  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {/if}
  <form on:submit|preventDefault={register}>
    <!-- <label>
      IdentificationID:
      <input type="text" bind:value={IdentificationID} required />
    </label>
     -->
    <label>
      Email:
      <input type="email" bind:value={email} required />
    </label>
    <br />
    <label>
      Password:
      <input type="password" bind:value={password} minlength="8" required />
    </label>
    <br />
    <label>
      Confirm Password:
      <input type="password" bind:value={confirmPassword} minlength="8" required />
    </label>
    <br />
    <button type="submit">Register</button>
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
      background-color: #5cb85c;
      border: none;
      border-radius: 4px;
      color: #ffffff;
      font-size: 16px;
      cursor: pointer;
    }
  
    button:hover {
      background-color: #4cae4c;
    }
  </style>