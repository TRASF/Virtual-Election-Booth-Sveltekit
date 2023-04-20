<script context="module">
// @ts-nocheck

    import { browser } from '$app/environment';
  
    export function load({ error }) {
      if (browser && error.status === 401) {
        return {
          redirect: '/login',
        };
      }
    }
  </script>