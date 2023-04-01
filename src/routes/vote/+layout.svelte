<script lang="ts">
    import user from '$stores/users';
    import { logout } from '$lib/logout';
  </script>
  
  <header>
    <nav>
      <a href="/vote">Vote</a>
      <a href="/vote/results">Results</a>
      <button on:click={logout}>Logout</button>
    </nav>
  </header>
  
  <slot />
  