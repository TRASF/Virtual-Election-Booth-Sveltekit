<script context="module">
// @ts-nocheck

    import { browser } from '$app/environment'
    import { getAuth } from 'firebase/auth';
    import user from '$lib/stores/users';
  
    export async function load({ page, fetch }) {
      if (browser) {
        const auth = getAuth();
        if (auth.currentUser) {
          user.set(auth.currentUser);
        } else {
          return {
            status: 401,
            error: new Error('Unauthorized'),
          };
        }
      }
    }
  </script>
  
  <slot />