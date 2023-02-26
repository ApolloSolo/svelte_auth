<script>
  import user from "../user";
  import Login from "../lib/Login.svelte";

  $: is_logged_in = $user === null ? true : false;

  const logout = () => {
    user.update((val) => (val = null));
  };
</script>

<h1>Welcome to AppSolo Tech.</h1>
{#if is_logged_in}
  <h2>Thank You</h2>
  <input type="button" value="Logout!" on:click={logout} />
{:else}
  <h2>Would you like to log in?</h2>
  <Login />
{/if}
