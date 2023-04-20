<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import user from '$lib/stores/users';
  import { onDestroy } from 'svelte';
  
  let unsubscribe: () => void;
  let isLoading = true;

  onMount(async () => {
    unsubscribe = user.subscribe(($user) => {
      isLoading = false;
      if (!$user) {
        goto('/login');
      }
    });
  });

  onDestroy(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });
</script>

{#if !isLoading}
  <slot />
{/if}
  
