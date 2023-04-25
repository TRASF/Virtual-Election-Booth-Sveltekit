<script lang="ts">
  
    import { logout } from '$lib/logout';
    import PrivateRoute from '$lib/components/PrivateRoute.svelte';
  </script>
  <PrivateRoute>
    
    <header>
      <nav>
        <a href="/vote">Vote</a>
        <a href="/vote/results">Results</a>
        <button on:click={logout}>Logout</button>
      </nav>
    </header>
    
    <slot />
    
  </PrivateRoute>