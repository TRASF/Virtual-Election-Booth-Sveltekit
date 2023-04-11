<script lang="ts">
    import { auth } from '$lib/firebaseConfig';
    import { createUserWithEmailAndPassword } from 'firebase/auth';
    import { goto } from '$app/navigation';
  
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
  