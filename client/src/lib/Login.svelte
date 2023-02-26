<script>
  import user from "../user.js";
  let username = "";
  let password = "";
  let current_error = null;

  const login = () => {
    fetch("http://127.0.0.1:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username: username, password: password })
    })
      .then((res) => {
        if (res.status < 299) return res.json();
        if (res.status > 299) current_error = "Some issue in post res.";
      })
      .then((data) => {
        if (data) user.update((val) => (val = { ...data }));
        console.log(data);
      })
      .catch((error) => {
        current_error = error;
        console.log(error);
      });
  };
</script>

<form on:submit|preventDefault={login}>
  <div>
    <label for="username">Username</label>
    <input type="text" id="username" bind:value={username} />
  </div>
  <div>
    <label for="password">Password</label>
    <input type="password" id="password" bind:value={password} />
  </div>
  <button type="submit">Submit</button>
</form>
